package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IBookingRepository extends JpaRepository<Booking, Integer> {
}
