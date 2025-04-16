package com.vietcine.moviebooking_server.mapper;

import com.vietcine.moviebooking_server.dto.request.SignupRequest;
import com.vietcine.moviebooking_server.dto.request.UserOAuthRequest;
import com.vietcine.moviebooking_server.dto.response.UserAuthenticationResponse;
import com.vietcine.moviebooking_server.dto.response.UserResponse;
import com.vietcine.moviebooking_server.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "id", ignore = true)
    User toUser(SignupRequest request);

    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "id", ignore = true)
    User toUser(UserOAuthRequest request);

    UserResponse toUserDTO(User user);

    UserAuthenticationResponse toUserAuthenticationResponse(User user);
}