package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.response.APIResponse;
import com.vietcine.moviebooking_server.dto.response.ShowtimeResponse;
import com.vietcine.moviebooking_server.service.showtime.ShowtimeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved showtimes"),
            @ApiResponse(responseCode = "404", description = "Movie not found")
    })
    public ResponseEntity<APIResponse> getShowtimesByMovieId(
            @Parameter(description = "ID of the movie") @PathVariable Integer movieId) {
        List<ShowtimeResponse> showtimes = showtimeService.getShowtimesByMovieId(movieId);
        APIResponse response = new APIResponse("Showtimes retrieved successfully", true, showtimes);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get showtime by ID", description = "Retrieves details of a specific showtime")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved showtime"),
            @ApiResponse(responseCode = "404", description = "Showtime not found")
    })
    public ResponseEntity<APIResponse> getShowtimeById(
            @Parameter(description = "ID of the showtime") @RequestParam Integer showtimeId) {
        ShowtimeResponse showtime = showtimeService.getShowtimeById(showtimeId);
        APIResponse response = new APIResponse("Showtime retrieved successfully", true, showtime);
        return ResponseEntity.ok(response);
    }
}