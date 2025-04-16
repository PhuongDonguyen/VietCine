package com.vietcine.moviebooking_server.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    @NotEmpty(message = "Không thể để trống tên")
    private String fullName;
    @NotEmpty(message = "không thể đẻ trống email")
    @Email(message = "Email không hợp lệ")
    private String email;
    @NotEmpty(message = "không thể đẻ trống password")
    private String password;
    private String role;
}
