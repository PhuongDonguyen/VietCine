package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IPaymentRepository extends JpaRepository<Payment, Integer> {
    // Custom query methods can be defined here if needed
}
