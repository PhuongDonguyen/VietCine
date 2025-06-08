package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.SeatPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ISeatPriceRepository extends JpaRepository<SeatPrice, Integer> {
    @Query(value = "EXEC GetSeatPricesByScreenId @ScreenId = :screenId, @BookingDate = :bookingDate", nativeQuery = true)
    List<Object[]> findByScreenIdAndBookingDate(@Param("screenId") int screenId, @Param("bookingDate") LocalDate bookingDate);
}