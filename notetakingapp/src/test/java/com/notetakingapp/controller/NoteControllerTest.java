package com.notetakingapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.notetakingapp.dto.request.CreateNoteRequest;
import com.notetakingapp.dto.request.RegisterRequest;
import com.notetakingapp.dto.request.UpdateNoteRequest;
import com.notetakingapp.repository.NoteRepository;
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

import com.jayway.jsonpath.JsonPath;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class NoteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NoteRepository noteRepository;

    private String userToken;

    @BeforeEach
    void setUp() throws Exception {
        noteRepository.deleteAll();
        userRepository.deleteAll();

        RegisterRequest request = new RegisterRequest("noteuser", "notes@test.com", "Password123!");
        MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        userToken = JsonPath.read(result.getResponse().getContentAsString(), "$.data.accessToken");
    }

    @Test
    void testCreateNoteAndGetNotes() throws Exception {
        CreateNoteRequest request = new CreateNoteRequest("My First Note", "Hello World", "#FFFFFF", "test");

        mockMvc.perform(post("/api/v1/notes")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.title").value("My First Note"))
                .andExpect(jsonPath("$.data.content").value("Hello World"));

        mockMvc.perform(get("/api/v1/notes")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content[0].title").value("My First Note"))
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }

    @Test
    void testUnauthorizedAccess() throws Exception {
        CreateNoteRequest request = new CreateNoteRequest("My First Note", "Hello World", "#FFFFFF", "test");

        mockMvc.perform(post("/api/v1/notes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void testUpdateNote() throws Exception {
        CreateNoteRequest createReq = new CreateNoteRequest("Title 1", "Content 1", "#000000", "");
        MvcResult createResult = mockMvc.perform(post("/api/v1/notes")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createReq)))
                .andReturn();

        String noteId = JsonPath.read(createResult.getResponse().getContentAsString(), "$.data.id");

        UpdateNoteRequest updateReq = new UpdateNoteRequest("Updated Title", "Updated Content", "#FFFFFF", true, false,
                "urgent");
        mockMvc.perform(put("/api/v1/notes/" + noteId)
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Updated Title"))
                .andExpect(jsonPath("$.data.isPinned").value(true));
    }

    @Test
    void testDeleteNote() throws Exception {
        CreateNoteRequest createReq = new CreateNoteRequest("To be deleted", "Delete me", "#000000", "");
        MvcResult createResult = mockMvc.perform(post("/api/v1/notes")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createReq)))
                .andReturn();

        String noteId = JsonPath.read(createResult.getResponse().getContentAsString(), "$.data.id");

        mockMvc.perform(delete("/api/v1/notes/" + noteId)
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/notes/" + noteId)
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isNotFound());
    }
}
