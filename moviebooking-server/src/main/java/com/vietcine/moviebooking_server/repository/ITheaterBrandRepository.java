package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.TheaterBrand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ITheaterBrandRepository extends JpaRepository<TheaterBrand, Integer> {
    @Query("""
        SELECT DISTINCT tb FROM TheaterBrand tb
        JOIN tb.theaters t
        WHERE t.city = :city
    """)
    List<TheaterBrand> findBrandsByCity(@Param("city") String city);

}
