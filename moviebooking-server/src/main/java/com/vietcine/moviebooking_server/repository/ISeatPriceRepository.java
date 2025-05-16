package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.SeatPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ISeatPriceRepository extends JpaRepository<SeatPrice, Integer> {
    @Query(value = "EXEC GetSeatPricesByScreenId @ScreenId = :screenId", nativeQuery = true)
    List<Object[]> findByScreenId(int screenId);
}
