package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@ToString
@Entity
@Table(name = "\"User\"")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserId", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @Column(name = "Email", nullable = false, length = 100)
    private String email;

    @Size(max = 255)
    @Nationalized
    @Column(name = "PasswordHash")
    private String passwordHash;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @Column(name = "FullName", nullable = false, length = 100)
    private String fullName;

    @Size(max = 15)
    @Nationalized
    @Column(name = "Phone", length = 15)
    private String phone;

    @NotNull
    @ColumnDefault("getdate()")
    @Column(name = "CreatedAt", nullable = false)
    private Instant createdAt;

    @Size(max = 100)
    @Nationalized
    @Column(name = "Address", length = 100)
    private String address;

    @Size(max = 200)
    @Nationalized
    @Column(name = "Avatar", length = 200)
    private String avatar;

    @Size(max = 10)
    @Nationalized
    @Column(name = "Role", length = 10)
    private String role;

    @Size(max = 20)
    @Nationalized
    @Column(name = "ProviderId", length = 20)
    private String providerId;

    @Size(max = 200)
    @Nationalized
    @Column(name = "UID", length = 200)
    private String uid;

    @Lob
    @Column(name = "IdToken")
    private String idToken;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Booking> bookings = new LinkedHashSet<>();

}