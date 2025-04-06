package com.vietcine.moviebooking_server.mapper;

import com.vietcine.moviebooking_server.dto.response.DirectorResponse;
import com.vietcine.moviebooking_server.dto.response.MovieResponse;
import com.vietcine.moviebooking_server.entity.Director;
import com.vietcine.moviebooking_server.entity.Movie;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    MovieResponse toMovieDTO(Movie movie);

    Movie toMovie(MovieResponse movieDTO);
}
