package com.notetakingapp.mapper;

import com.notetakingapp.dto.response.UserResponse;
import com.notetakingapp.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toResponse(User user);
}
