package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ISeatRepository extends JpaRepository<Seat, Integer> {

    @Query(value = "EXEC GetSeats @ShowtimeId = :showtimeId", nativeQuery = true)
    List<Object[]> getSeatsByShowtimeRaw(@Param("showtimeId") int showtimeId);
}
