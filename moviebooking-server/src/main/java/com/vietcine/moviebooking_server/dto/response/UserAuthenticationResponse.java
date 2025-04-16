package com.vietcine.moviebooking_server.dto.response;

import com.vietcine.moviebooking_server.entity.Booking;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

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