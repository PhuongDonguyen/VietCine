package com.vietcine.moviebooking_server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserAuthenticationResponse {
    private Integer id;
    private String uid;
    private String email;
    private String fullName;
    private Instant createdAt;
    private String avatar;
    private String role;
}