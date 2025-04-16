package com.vietcine.moviebooking_server.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
public class UserOAuthRequest {
    @NotEmpty(message = "không thể đẻ trống email")
    private String email;
    @NotEmpty(message = "không thể đẻ trống fullName")
    private String fullName;
    private Instant createdAt;
    @NotEmpty(message = "không thể đẻ trống avatar")
    private String avatar;
    @NotEmpty(message = "không thể đẻ trống role")
    private String role;
    @NotEmpty(message = "không thể đẻ trống providerId")
    private String providerId;
    @NotEmpty(message = "không thể đẻ trống uid")
    private String uid;
    @NotEmpty(message = "không thể đẻ trống idToken")
    private String idToken;
}
