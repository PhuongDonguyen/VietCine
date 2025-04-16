package com.vietcine.moviebooking_server.service.user;

import com.vietcine.moviebooking_server.dto.response.MovieResponse;
import com.vietcine.moviebooking_server.entity.Movie;
import com.vietcine.moviebooking_server.mapper.MovieMapper;
import com.vietcine.moviebooking_server.repository.IMovieRepository;
import com.vietcine.moviebooking_server.service.movie.MovieService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MovieServiceTest {

    @Mock
    private IMovieRepository movieRepository;

    @Mock
    private MovieMapper movieMapper;

    @InjectMocks
    private MovieService movieService;

    private List<Movie> movieList;
    private List<MovieResponse> movieResponseList;
    private Movie movie;
    private MovieResponse movieResponse;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup test data
        movie = new Movie();
        movie.setId(1);
        movie.setTitle("Test Movie");
        movie.setIsAvailable(true);

        movieResponse = new MovieResponse();
        movieResponse.setId(1);
        movieResponse.setTitle("Test Movie");
        movieResponse.setIsAvailable(true);

        movieList = Arrays.asList(movie);
        movieResponseList = Arrays.asList(movieResponse);

        // Configure mapper behavior
        when(movieMapper.toMovieDTO(movie)).thenReturn(movieResponse);
    }

    @Test
    void getAllMovies_Success() {
        // Arrange
        when(movieRepository.findAll()).thenReturn(movieList);

        // Act
        List<MovieResponse> result = movieService.getAllMovies();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(movieResponse.getId(), result.get(0).getId());
        assertEquals(movieResponse.getTitle(), result.get(0).getTitle());

        verify(movieRepository, times(1)).findAll();
        verify(movieMapper, times(1)).toMovieDTO(movie);
    }

    @Test
    void getAllMovies_EmptyList() {
        // Arrange
        when(movieRepository.findAll()).thenReturn(new ArrayList<>());

        // Act
        List<MovieResponse> result = movieService.getAllMovies();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(movieRepository, times(1)).findAll();
        verify(movieMapper, never()).toMovieDTO(any());
    }

    @Test
    void getAvailableMovies_Success() {
        // Arrange
        when(movieRepository.findByIsAvailable(true)).thenReturn(movieList);

        // Act
        List<MovieResponse> result = movieService.getAvailableMovies();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(movieResponse.getId(), result.get(0).getId());
        assertEquals(movieResponse.getTitle(), result.get(0).getTitle());
        assertTrue(result.get(0).getIsAvailable());

        verify(movieRepository, times(1)).findByIsAvailable(true);
        verify(movieMapper, times(1)).toMovieDTO(movie);
    }

    @Test
    void getAvailableMovies_EmptyList() {
        // Arrange
        when(movieRepository.findByIsAvailable(true)).thenReturn(new ArrayList<>());

        // Act
        List<MovieResponse> result = movieService.getAvailableMovies();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(movieRepository, times(1)).findByIsAvailable(true);
        verify(movieMapper, never()).toMovieDTO(any());
    }
}