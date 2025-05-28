package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.ShowtimeSeat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IShowtimeSeatRepository extends JpaRepository<ShowtimeSeat, Integer> {
    Optional<ShowtimeSeat> findByShowtimeIdAndSeatId(Integer showtimeId, Integer seatId);
}
