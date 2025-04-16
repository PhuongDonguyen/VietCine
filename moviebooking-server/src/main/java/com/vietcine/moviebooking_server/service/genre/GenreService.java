package com.vietcine.moviebooking_server.service.genre;

import com.vietcine.moviebooking_server.dto.response.GenreResponse;
import com.vietcine.moviebooking_server.entity.Genre;
import com.vietcine.moviebooking_server.mapper.GenreMapper;
import com.vietcine.moviebooking_server.repository.IGenreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenreService implements IGenreService {
    private final IGenreRepository genreRepository;
    private final GenreMapper genreMapper;

    public GenreService(IGenreRepository genreRepository, GenreMapper genreMapper) {
        this.genreRepository = genreRepository;
        this.genreMapper = genreMapper;
    }

    @Override
    public List<GenreResponse> getAllGenres() {
        return genreRepository.findAll().stream()
                .map(genreMapper::toGenreDTO)
                .toList();
    }
}
