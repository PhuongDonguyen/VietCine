package com.vietcine.moviebooking_server.mapper;


import com.vietcine.moviebooking_server.dto.response.GenreResponse;
import com.vietcine.moviebooking_server.dto.response.MovieResponse;
import com.vietcine.moviebooking_server.entity.Genre;
import com.vietcine.moviebooking_server.entity.Movie;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GenreMapper {
    GenreResponse toGenreDTO(Genre genre);

    Genre toGenre(GenreResponse genreDTO);
}