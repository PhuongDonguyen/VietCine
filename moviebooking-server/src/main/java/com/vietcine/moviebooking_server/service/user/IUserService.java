package com.vietcine.moviebooking_server.service.user;

import com.vietcine.moviebooking_server.dto.response.UserResponse;

public interface IUserService {
    UserResponse getUserById(Integer id);
}
