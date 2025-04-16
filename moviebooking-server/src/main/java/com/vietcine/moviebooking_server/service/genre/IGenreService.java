package com.vietcine.moviebooking_server.service.genre;


import com.vietcine.moviebooking_server.dto.response.GenreResponse;
import com.vietcine.moviebooking_server.entity.Genre;

import java.util.List;

public interface IGenreService {
    List<GenreResponse> getAllGenres();
}
