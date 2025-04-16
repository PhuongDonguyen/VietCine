package com.vietcine.moviebooking_server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthenticationResponse {
    private String token;
    private UserAuthenticationResponse user;
    private String role;
}
