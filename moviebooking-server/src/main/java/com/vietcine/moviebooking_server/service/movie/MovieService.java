package com.vietcine.moviebooking_server.service.movie;

import com.vietcine.moviebooking_server.dto.response.MovieResponse;
import com.vietcine.moviebooking_server.entity.Movie;
import com.vietcine.moviebooking_server.mapper.MovieMapper;
import com.vietcine.moviebooking_server.repository.IMovieRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieService implements IMovieService {
    private final IMovieRepository movieRepository;

    @Autowired
    private MovieMapper movieMapper;

    public MovieService(IMovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public List<MovieResponse> getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        return movies.stream()
                .map(movieMapper::toMovieDTO) // movie -> movieMapper.toMovieDTO(movie)
                .collect(Collectors.toList());
    }

    @Override
    public List<MovieResponse> getAvailableMovies() {
        List<Movie> movies = movieRepository.findByIsAvailable(true);
        return movies.stream()
                .map(movieMapper::toMovieDTO)
                .collect(Collectors.toList());

    }
}
