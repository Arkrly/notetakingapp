package com.notetakingapp.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for JWT security scenarios (SEC-03, SEC-04).
 */
class JwtUtilsTest {

    private JwtUtils jwtUtils;
    private SecretKey signingKey;

    @BeforeEach
    void setUp() {
        // Use a valid Base64-encoded secret for testing
        String testSecret = "dGVzdFNlY3JldEtleUZvckpXVFRlc3RpbmdQdXJwb3Nlc09ubHlBdXRoVG9rZW5z";
        signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(testSecret));
        jwtUtils = new JwtUtils(testSecret, 3600000L); // 1 hour expiry
    }

    @Test
    void testRejectNoneAlgorithm() {
        // SEC-03: JWT with "none" algorithm should be rejected
        // Create an unsigned token by building without signing
        // This simulates a token with "alg": "none" in the header
        String noneToken = Jwts.builder()
                .subject("testuser")
                .expiration(new Date(System.currentTimeMillis() + 3600000))
                .compact(); // No signWith() - creates unsigned token

        // Should return false - unsigned tokens are invalid
        // parseSignedClaims() with verifyWith() requires signature
        assertFalse(jwtUtils.isTokenValid(noneToken),
                "Token with 'none' algorithm (unsigned) should be rejected");
    }

    @Test
    void testRejectExpiredToken() {
        // SEC-04: JWT with expired timestamp should be rejected
        // Create a token that expired 1 second ago
        String expiredToken = Jwts.builder()
                .subject("testuser")
                .expiration(new Date(System.currentTimeMillis() - 1000)) // expired
                .signWith(signingKey)
                .compact();

        // Should return false - expired tokens are invalid
        assertFalse(jwtUtils.isTokenValid(expiredToken),
                "Expired token should be rejected");
    }

    @Test
    void testAcceptValidToken() {
        // Sanity check: valid JWT with proper signature should be accepted
        String validToken = Jwts.builder()
                .subject("testuser")
                .expiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(signingKey)
                .compact();

        // Should return true - valid tokens are accepted
        assertTrue(jwtUtils.isTokenValid(validToken),
                "Valid token should be accepted");
    }
}
