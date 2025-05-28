package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.BookingFood;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IBookingFoodRepository extends JpaRepository<BookingFood, Integer> {
}
