package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(@NotEmpty(message = "không thể để trống email") @Email(message = "Email không hợp lệ") String email);

    Optional<User> findByUid(String uid);
}
