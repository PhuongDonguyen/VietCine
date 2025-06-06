package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IBookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUserIdAndIsActiveTrue(Integer userId);
}
