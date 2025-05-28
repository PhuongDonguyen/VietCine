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
    List<MovieResponse> getAllMovies();

    Map<String, Object> getAvailableMovies(Pageable pageable, String search, Integer genreId, LocalDate showDate);

    Map<String, List<MovieResponse>> getRecommendedMoviesByCategory();

    MovieDetailResponse getMovieDetailBySlug(String slug);

    MovieResponse getMovieDetailById(Integer movieId);
}