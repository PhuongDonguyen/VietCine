package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.response.ApiResponse;
import com.vietcine.moviebooking_server.dto.response.MovieDetailResponse;
import com.vietcine.moviebooking_server.dto.response.MovieResponse;
import com.vietcine.moviebooking_server.dto.response.PaginationMeta;
import com.vietcine.moviebooking_server.service.movie.IMovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestController
@RequestMapping("/api/movies")
@Tag(name = "Movies", description = "APIs for managing movies")
public class MovieController {
    @Autowired
    private IMovieService movieService;

    @GetMapping
    @Operation(summary = "Get available movies", description = "Retrieves a paginated list of available movies with optional filters")
    public ResponseEntity<ApiResponse> getAvailableMovies(
            @PageableDefault(size = 4, sort = "id", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer genreId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        try {
            System.out.println("Search: " + search);
            Map<String, Object> data = movieService.getAvailableMovies(pageable, search, genreId, date);
            Map<String, Object> pagination = (Map<String, Object>) data.get("pagination");
            PaginationMeta paginationMeta = PaginationMeta.builder()
                    .totalPages((Integer) pagination.get("totalPages"))
                    .pageSize((Integer) pagination.get("pageSize"))
                    .currentPage((Integer) pagination.get("currentPage"))
                    .totalElements((Long) pagination.get("totalElements"))
                    .build();
            ApiResponse<List<MovieResponse>> apiResponse = ApiResponse.<List<MovieResponse>>builder()
                    .message("Success")
                    .success(true)
                    .data((List<MovieResponse>) data.get("content"))
                    .paginationMeta(paginationMeta)
                    .build();
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ApiResponse("Error retrieving movies: " + e.getMessage(), false, INTERNAL_SERVER_ERROR)
            );
        }
    }

    @GetMapping("/recommended")
    @Operation(summary = "Get recommended movies", description = "Retrieves a list of recommended movies by category")
    public ResponseEntity<ApiResponse> getRecommendedMovies() {
        try {
            return ResponseEntity.ok(new ApiResponse("Success", true, movieService.getRecommendedMoviesByCategory()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ApiResponse("Error retrieving recommended movies: " + e.getMessage(), false, INTERNAL_SERVER_ERROR)
            );
        }
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get movie by slug", description = "Retrieves details of a movie by its slug")
    public ResponseEntity<ApiResponse> getMovieBySlug(
            @PathVariable String slug) {
        try {
            MovieDetailResponse movie = movieService.getMovieDetailBySlug(slug);
            Map<String, Object> result = new HashMap<>();
            result.put("data", movie);

            return ResponseEntity.ok(new ApiResponse("Success", true, result));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(
                    new ApiResponse("Movie not found: " + e.getMessage(), false, null)
            );
        }
    }

    @GetMapping("/detail/{id}")
    @Operation(summary = "Get movie by ID", description = "Retrieves detailed information of a movie by its ID")
    public ResponseEntity<ApiResponse> getMovieDetailById(
            @PathVariable Integer id) {
        try {
            MovieResponse movieDetail = movieService.getMovieDetailById(id);
            return ResponseEntity.ok(new ApiResponse("Success", true, movieDetail));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(
                    new ApiResponse("Movie not found: " + e.getMessage(), false, null)
            );
        }
    }
}