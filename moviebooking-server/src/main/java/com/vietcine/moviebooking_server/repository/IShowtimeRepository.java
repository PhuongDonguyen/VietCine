package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IShowtimeRepository extends JpaRepository<Showtime, Integer> {
    @Query("SELECT s FROM Showtime s " +
            "JOIN FETCH s.movie m " +
            "JOIN FETCH s.screen scr " +
            "JOIN FETCH scr.theater t " +
            "WHERE s.movie.id = :movieId")
    List<Showtime> findByMovieId(@Param("movieId")Integer movieId);
}