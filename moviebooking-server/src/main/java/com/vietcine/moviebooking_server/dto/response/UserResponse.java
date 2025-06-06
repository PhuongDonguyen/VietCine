package com.vietcine.moviebooking_server.dto.response;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Integer id;
    private String email;
    private String fullName;
    private String phone;
    private Instant createdAt;
    private String address;
    private String avatar;
    private String role;
}
