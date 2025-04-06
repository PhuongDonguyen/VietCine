package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.dto.response.MovieResponse;
import com.vietcine.moviebooking_server.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;

import java.util.List;

public interface IMovieRepository extends JpaRepository<Movie, Integer> {
    boolean existsByTitle(String name);

    List<Movie> findByIsAvailable(boolean b);
}
