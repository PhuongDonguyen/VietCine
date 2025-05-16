package com.vietcine.moviebooking_server.service.movie;

import com.vietcine.moviebooking_server.dto.response.MovieDetailResponse;
import com.vietcine.moviebooking_server.dto.response.MovieResponse;
import com.vietcine.moviebooking_server.entity.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface IMovieService {
    // Original method, but now accepts pagination and filtering parameters
    Map<String, Object> getAllMovies(Pageable pageable, String search, Integer genreId, LocalDate showDate);

    // Non-paginated version (if needed)
    List<MovieResponse> getAllMovies();

    // Original method, but now accepts pagination
    Map<String, Object> getAvailableMovies(Pageable pageable);

    // Non-paginated version (if needed)
    List<MovieResponse> getAvailableMovies();

    // New method for recommended movies
    Map<String, List<MovieResponse>> getRecommendedMoviesByCategory();

    MovieDetailResponse getMovieDetailBySlug(String slug);

    MovieResponse getMovieDetailById(Integer movieId);
}