package com.vietcine.moviebooking_server.dto.request;

import lombok.Data;

@Data
public class UpdatePasswordRequest {
    String oldPassword;
    String newPassword;
}
