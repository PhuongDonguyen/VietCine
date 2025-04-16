package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.dto.response.MovieResponse;
import com.vietcine.moviebooking_server.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IMovieRepository extends JpaRepository<Movie, Integer>, JpaSpecificationExecutor<Movie> {
    boolean existsByTitle(String name);
    List<Movie> findByIsAvailable(boolean isAvailable);
    Page<Movie> findByIsAvailable(boolean isAvailable, Pageable pageable);
    Optional<Movie> findBySlug(String slug);
    @Query("SELECT m FROM Movie m " +
            "LEFT JOIN FETCH m.director " +
            "LEFT JOIN FETCH m.genres " +
            "LEFT JOIN FETCH m.showtimes s " +
            "LEFT JOIN FETCH s.screen " +
            "LEFT JOIN FETCH m.movieCasts mc " +
            "LEFT JOIN FETCH mc.cast " +
            "WHERE m.slug = :slug")
    Optional<Movie> findBySlugWithAllRelationships(@Param("slug") String slug);
}
