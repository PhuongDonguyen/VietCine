package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.Theater;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ITheaterRepository extends JpaRepository<Theater, Integer> {
    @Query("SELECT DISTINCT t.city FROM Theater t")
    List<String> findAllCities();

    @Query("""
        SELECT t FROM Theater t 
        WHERE t.city = :city 
        AND t.id = (
            SELECT t2.id FROM Theater t2 
            WHERE t2.theaterBrand = t.theaterBrand AND t2.city = :city 
            ORDER BY SIZE(t2.screens) DESC, t2.id ASC 
            FETCH FIRST 1 ROWS ONLY
        )
    """)
    List<Theater> findRecommendedTheatersByCity(@Param("city") String city);

    List<Theater> findAllTheatersByCity(String city);

    List<Theater> findByTheaterBrandIdAndCity(Integer brandId, String city);



}
