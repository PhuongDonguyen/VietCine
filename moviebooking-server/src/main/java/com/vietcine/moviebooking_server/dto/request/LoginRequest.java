package com.vietcine.moviebooking_server.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginRequest {
    @NotEmpty(message = "không thể đẻ trống email")
    @Email(message = "Email không hợp lệ")
    private String email;
    @NotEmpty(message = "không thể đẻ trống password")
    private String password;
}
