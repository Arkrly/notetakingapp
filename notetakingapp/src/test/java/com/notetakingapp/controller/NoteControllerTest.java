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

        RegisterRequest request = RegisterRequest.builder()
                .username("noteuser")
                .email("notes@test.com")
                .password("Password123!")
                .build();
        MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        userToken = JsonPath.read(result.getResponse().getContentAsString(), "$.data.token");
    }

    @Test
    void testCreateNoteAndGetNotes() throws Exception {
        CreateNoteRequest request = CreateNoteRequest.builder()
                .title("My First Note")
                .content("Hello World")
                .color("#FFFFFF")
                .tags("test")
                .build();

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
        CreateNoteRequest request = CreateNoteRequest.builder()
                .title("My First Note")
                .content("Hello World")
                .color("#FFFFFF")
                .tags("test")
                .build();

        mockMvc.perform(post("/api/v1/notes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void testUpdateNote() throws Exception {
        CreateNoteRequest createReq = CreateNoteRequest.builder()
                .title("Title 1")
                .content("Content 1")
                .color("#000000")
                .tags("")
                .build();
        MvcResult createResult = mockMvc.perform(post("/api/v1/notes")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createReq)))
                .andReturn();

        String noteId = JsonPath.read(createResult.getResponse().getContentAsString(), "$.data.id");

        UpdateNoteRequest updateReq = UpdateNoteRequest.builder()
                .title("Updated Title")
                .content("Updated Content")
                .color("#FFFFFF")
                .isPinned(true)
                .isArchived(false)
                .tags("urgent")
                .build();
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
        CreateNoteRequest createReq = CreateNoteRequest.builder()
                .title("To be deleted")
                .content("Delete me")
                .color("#000000")
                .tags("")
                .build();
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
