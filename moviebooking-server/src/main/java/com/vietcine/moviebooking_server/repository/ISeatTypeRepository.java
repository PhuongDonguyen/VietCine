package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.Seat;
import com.vietcine.moviebooking_server.entity.SeatType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ISeatTypeRepository extends JpaRepository<SeatType, Integer> {
    @Query(value = "EXEC [GetSeatPricesByScreenId] @ScreenId = :screenId", nativeQuery = true)
    List<Object[]> getSeattypesOfScreen(@Param("screenId") int screenId);
}