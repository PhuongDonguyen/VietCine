package com.vietcine.moviebooking_server.dto.response;

import com.vietcine.moviebooking_server.entity.Booking;
import lombok.*;

import java.time.Instant;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Integer id;
    private String email;
    private String passwordHash;
    private String fullName;
    private String phone;
    private Instant createdAt;
    private String address;
    private String avatar;
    private String role;
}
