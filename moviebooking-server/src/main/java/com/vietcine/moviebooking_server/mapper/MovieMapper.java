package com.vietcine.moviebooking_server.mapper;

import com.vietcine.moviebooking_server.dto.response.MovieDetailResponse;
import com.vietcine.moviebooking_server.dto.response.MovieResponse;
import com.vietcine.moviebooking_server.entity.Movie;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    MovieResponse toMovieDTO(Movie movie);

    MovieDetailResponse toMovieDetailDTO(Movie movie);

    Movie toMovie(MovieResponse movieDTO);
}

