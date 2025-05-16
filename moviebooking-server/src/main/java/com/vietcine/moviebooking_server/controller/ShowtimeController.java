package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.response.ApiResponse;
import com.vietcine.moviebooking_server.dto.response.ShowtimeResponse;
import com.vietcine.moviebooking_server.service.showtime.ShowtimeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
@Tag(name = "Showtimes", description = "APIs for managing movie showtimes")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    @Autowired
    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @GetMapping("/{movieId}")
    @Operation(summary = "Get showtimes by movie ID", description = "Retrieves all showtimes for a specific movie")
    public ResponseEntity<ApiResponse> getShowtimesByMovieId(
            @Parameter(description = "ID of the movie") @PathVariable Integer movieId) {
        List<ShowtimeResponse> showtimes = showtimeService.getShowtimesByMovieId(movieId);
        ApiResponse response = new ApiResponse("Showtimes retrieved successfully", true, showtimes);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get showtime by ID", description = "Retrieves details of a specific showtime")
    public ResponseEntity<ApiResponse> getShowtimeById(
            @Parameter(description = "ID of the showtime") @RequestParam Integer showtimeId) {
        ShowtimeResponse showtime = showtimeService.getShowtimeById(showtimeId);
        ApiResponse response = new ApiResponse("Showtime retrieved successfully", true, showtime);
        return ResponseEntity.ok(response);
    }
}