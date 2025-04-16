package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.response.ApiResponse;
import com.vietcine.moviebooking_server.dto.response.MovieResponse;
import com.vietcine.moviebooking_server.service.movie.IMovieService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MovieControllerTest {

    @Mock
    private IMovieService movieService;

    @InjectMocks
    private MovieController movieController;

    private List<MovieResponse> movieResponses;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Create test data
        movieResponses = new ArrayList<>();
        MovieResponse movie = new MovieResponse();
        movie.setId(1);
        movie.setTitle("Test Movie");
        movie.setDuration(120);
        movie.setReleaseDate(LocalDate.of(2023, 5, 15));
        movie.setDescription("Test Description");
        movie.setTrailerUrl("https://example.com/trailer");
        movie.setEnglishTitle("Test Movie");
        movie.setIsAvailable(true);
        movie.setPosterUrl("https://example.com/poster");
        movie.setRating(8.5);
        movie.setGenres(new HashSet<>());

        movieResponses.add(movie);
    }

    @Test
    void getAllMovies_Success() {
        // Arrange
        when(movieService.getAllMovies()).thenReturn(movieResponses);

        // Act
        ResponseEntity<ApiResponse> response = movieController.getAllMovies();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        ApiResponse apiResponse = response.getBody();
        assertNotNull(apiResponse);
        assertEquals("Success", apiResponse.getMessage());
        assertEquals(true, apiResponse.getSuccess());
        assertEquals(movieResponses, apiResponse.getData());

        verify(movieService, times(1)).getAllMovies();
    }

    @Test
    void getAllMovies_Exception() {
        // Arrange
        String errorMessage = "Database connection failed";
        when(movieService.getAllMovies()).thenThrow(new RuntimeException(errorMessage));

        // Act
        ResponseEntity<ApiResponse> response = movieController.getAllMovies();

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        ApiResponse apiResponse = response.getBody();
        assertNotNull(apiResponse);
        assertEquals("Error retrieving movies: " + errorMessage, apiResponse.getMessage());
        assertEquals(true, apiResponse.getSuccess());
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, apiResponse.getData());

        verify(movieService, times(1)).getAllMovies();
    }

    @Test
    void getAvailableMovies_Success() {
        // Arrange
        when(movieService.getAvailableMovies()).thenReturn(movieResponses);

        // Act
        ResponseEntity<ApiResponse> response = movieController.getAvailableMovies();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        ApiResponse apiResponse = response.getBody();
        assertNotNull(apiResponse);
        assertEquals("Success", apiResponse.getMessage());
        assertEquals(true, apiResponse.getSuccess());
        assertEquals(movieResponses, apiResponse.getData());

        verify(movieService, times(1)).getAvailableMovies();
    }

    @Test
    void getAvailableMovies_EmptyList() {
        // Arrange
        when(movieService.getAvailableMovies()).thenReturn(Collections.emptyList());

        // Act
        ResponseEntity<ApiResponse> response = movieController.getAvailableMovies();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        ApiResponse apiResponse = response.getBody();
        assertNotNull(apiResponse);
        assertEquals("Success", apiResponse.getMessage());
        assertEquals(true, apiResponse.getSuccess());
        assertEquals(Collections.emptyList(), apiResponse.getData());

        verify(movieService, times(1)).getAvailableMovies();
    }

    @Test
    void getAvailableMovies_Exception() {
        // Arrange
        String errorMessage = "Service unavailable";
        when(movieService.getAvailableMovies()).thenThrow(new RuntimeException(errorMessage));

        // Act
        ResponseEntity<ApiResponse> response = movieController.getAvailableMovies();

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        ApiResponse apiResponse = response.getBody();
        assertNotNull(apiResponse);
        assertEquals("Error retrieving movies: " + errorMessage, apiResponse.getMessage());
        assertEquals(true, apiResponse.getSuccess());
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, apiResponse.getData());

        verify(movieService, times(1)).getAvailableMovies();
    }
}