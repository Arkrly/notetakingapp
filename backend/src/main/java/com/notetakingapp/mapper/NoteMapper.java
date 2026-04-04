package com.notetakingapp.mapper;

import com.notetakingapp.dto.request.CreateNoteRequest;
import com.notetakingapp.dto.response.NoteResponse;
import com.notetakingapp.entity.Note;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NoteMapper {

    NoteResponse toResponse(Note note);

    List<NoteResponse> toResponseList(List<Note> notes);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "isPinned", ignore = true)
    @Mapping(target = "isArchived", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Note toEntity(CreateNoteRequest request);
}
