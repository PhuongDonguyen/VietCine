package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.response.APIResponse;
import com.vietcine.moviebooking_server.dto.response.MovieDetailResponse;
import com.vietcine.moviebooking_server.dto.response.MovieResponse;
import com.vietcine.moviebooking_server.service.movie.IMovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestController // Changed from @Controller to @RestController
@RequestMapping("/api/movies")
@Tag(name = "Movies", description = "APIs for managing movies")
public class MovieController {
    @Autowired
    private IMovieService movieService;

    @GetMapping
    @Operation(summary = "Get all movies", description = "Retrieves a paginated list of movies with optional filters")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved movies"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<APIResponse> getAllMovies(
            @Parameter(description = "Page number (1-based)", example = "1") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "Number of items per page", example = "8") @RequestParam(defaultValue = "8") int limit,
            @Parameter(description = "Search keyword for movie title") @RequestParam(required = false) String search,
            @Parameter(description = "Filter by genre") @RequestParam(required = false) String genre,
            @Parameter(description = "Filter by release date (yyyy-MM-dd)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        try {
            Pageable pageable = PageRequest.of(page - 1, limit);
            Map<String, Object> serviceResult = movieService.getAllMovies(pageable, search, genre, date);
            Map<String, Object> result = new HashMap<>();
            result.put("data", serviceResult.get("content"));

            Map<String, Object> pagination = new HashMap<>();
            pagination.put("page", page);
            pagination.put("size", limit);
            pagination.put("totalElements", serviceResult.get("totalElements"));
            pagination.put("totalPages", serviceResult.get("totalPages"));

            result.put("pagination", pagination);

            return ResponseEntity.ok(new APIResponse("Success", true, result));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new APIResponse("Error retrieving movies: " + e.getMessage(), false, INTERNAL_SERVER_ERROR)
            );
        }
    }

    @GetMapping("/available")
    @Operation(summary = "Get available movies", description = "Retrieves a paginated list of currently available movies")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved available movies"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<APIResponse> getAvailableMovies(
            @Parameter(description = "Page number (1-based)", example = "1") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "Number of items per page", example = "8") @RequestParam(defaultValue = "8") int limit
    ) {
        try {
            Pageable pageable = PageRequest.of(page - 1, limit);
            Map<String, Object> serviceResult = movieService.getAvailableMovies(pageable);
            Map<String, Object> result = new HashMap<>();
            result.put("data", serviceResult.get("content"));

            Map<String, Object> pagination = new HashMap<>();
            pagination.put("page", page);
            pagination.put("size", limit);
            pagination.put("totalElements", serviceResult.get("totalElements"));
            pagination.put("totalPages", serviceResult.get("totalPages"));

            result.put("pagination", pagination);

            return ResponseEntity.ok(new APIResponse("Success", true, result));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new APIResponse("Error retrieving movies: " + e.getMessage(), false, INTERNAL_SERVER_ERROR)
            );
        }
    }

    @GetMapping("/recommended")
    @Operation(summary = "Get recommended movies", description = "Retrieves a list of recommended movies by category")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved recommended movies"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<APIResponse> getRecommendedMovies() {
        try {
            Map<String, Object> result = new HashMap<>();
            result.put("data", movieService.getRecommendedMoviesByCategory());

            return ResponseEntity.ok(new APIResponse("Success", true, result));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new APIResponse("Error retrieving recommended movies: " + e.getMessage(), false, INTERNAL_SERVER_ERROR)
            );
        }
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get movie by slug", description = "Retrieves details of a movie by its slug")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved movie"),
            @ApiResponse(responseCode = "404", description = "Movie not found")
    })
    public ResponseEntity<APIResponse> getMovieBySlug(
            @Parameter(description = "Slug of the movie") @PathVariable String slug) {
        try {
            MovieDetailResponse movie = movieService.getMovieDetailBySlug(slug);
            Map<String, Object> result = new HashMap<>();
            result.put("data", movie);

            return ResponseEntity.ok(new APIResponse("Success", true, result));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(
                    new APIResponse("Movie not found: " + e.getMessage(), false, null)
            );
        }
    }

    @GetMapping("/detail/{id}")
    @Operation(summary = "Get movie by ID", description = "Retrieves detailed information of a movie by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved movie details"),
            @ApiResponse(responseCode = "404", description = "Movie not found")
    })
    public ResponseEntity<APIResponse> getMovieDetailById(
            @Parameter(description = "ID of the movie") @PathVariable Integer id) {
        try {
            MovieResponse movieDetail = movieService.getMovieDetailById(id);
            return ResponseEntity.ok(new APIResponse("Success", true, movieDetail));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(
                    new APIResponse("Movie not found: " + e.getMessage(), false, null)
            );
        }
    }
}