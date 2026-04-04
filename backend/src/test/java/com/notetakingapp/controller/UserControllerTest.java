package com.notetakingapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import com.notetakingapp.dto.request.RegisterRequest;
import com.notetakingapp.dto.request.UpdateUserRequest;
import com.notetakingapp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    private String userToken;

    @BeforeEach
    void setUp() throws Exception {
        userRepository.deleteAll();

        RegisterRequest request = RegisterRequest.builder()
                .username("user123")
                .email("user123@test.com")
                .password("Password123!")
                .build();
        MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        userToken = JsonPath.read(result.getResponse().getContentAsString(), "$.data.token");
    }

    @Test
    void testGetCurrentUser() throws Exception {
        mockMvc.perform(get("/api/v1/users/me")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.username").value("user123"))
                .andExpect(jsonPath("$.data.email").value("user123@test.com"));
    }

    @Test
    void testUpdateUser() throws Exception {
        UpdateUserRequest updateReq = UpdateUserRequest.builder()
                .username("newusername")
                .email("newemail@test.com")
                .build();

        mockMvc.perform(put("/api/v1/users/me")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.username").value("newusername"))
                .andExpect(jsonPath("$.data.email").value("newemail@test.com"));
    }

    @Test
    void testChangePassword() throws Exception {
        Map<String, String> request = new HashMap<>();
        request.put("currentPassword", "Password123!");
        request.put("newPassword", "NewPassword123!");

        mockMvc.perform(patch("/api/v1/users/me/password")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteAccount() throws Exception {
        mockMvc.perform(delete("/api/v1/users/me")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/users/me")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isActive").value(false));
    }
}