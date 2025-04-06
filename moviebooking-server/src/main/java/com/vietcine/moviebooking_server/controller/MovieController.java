package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.response.ApiResponse;
import com.vietcine.moviebooking_server.dto.response.MovieResponse;
import com.vietcine.moviebooking_server.service.movie.IMovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@Controller
@RequestMapping("/api/movies")
public class MovieController {
    @Autowired
    private IMovieService movieService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllMovies() {
        try {
            return ResponseEntity.ok(new ApiResponse("Success", movieService.getAllMovies()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse("Error retrieving movies: " + e.getMessage(), INTERNAL_SERVER_ERROR));
        }
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse> getAvailableMovies() {
        try {
            return ResponseEntity.ok(new ApiResponse("Success", movieService.getAvailableMovies()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse("Error retrieving movies: " + e.getMessage(), INTERNAL_SERVER_ERROR));
        }
    }
}
