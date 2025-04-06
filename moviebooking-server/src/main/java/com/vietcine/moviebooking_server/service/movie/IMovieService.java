package com.vietcine.moviebooking_server.service.movie;

import com.vietcine.moviebooking_server.dto.response.MovieResponse;
import com.vietcine.moviebooking_server.entity.Movie;

import java.util.List;

public interface IMovieService {
    List<MovieResponse> getAllMovies();
    List<MovieResponse> getAvailableMovies();
}
