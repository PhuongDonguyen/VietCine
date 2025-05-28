package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.response.ApiResponse;
import com.vietcine.moviebooking_server.dto.response.MovieWithShowtimesResponse;
import com.vietcine.moviebooking_server.dto.response.TheaterResponse;
import com.vietcine.moviebooking_server.service.theater.ITheaterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/theaters")
@Tag(name = "Theaters", description = "APIs for handling theaters")
public class TheaterController {

    @Autowired
    private ITheaterService theaterService;

    @GetMapping("/cities")
    @Operation(summary = "Get list of cities", description = "Returns all cities that have theaters")
    public ResponseEntity<ApiResponse> getAllCities() {
        try {
            List<String> cities = theaterService.getAllCities();
            return ResponseEntity.ok(new ApiResponse("Success", true, cities));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ApiResponse("Error retrieving cities: " + e.getMessage(), false, null)
            );
        }
    }

    @GetMapping("/recommend")
    @Operation(summary = "Get recommended theaters by city", description = "Returns a list of recommended theaters in a city")
    public ResponseEntity<ApiResponse> getRecommendedTheatersByCity(@RequestParam String city) {
        try {
            List<TheaterResponse> result = theaterService.getRecommendedTheatersByCity(city);
            return ResponseEntity.ok(new ApiResponse("Success", true, result));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ApiResponse("Error fetching recommended theaters: " + e.getMessage(), false, null)
            );
        }
    }

    @GetMapping("/all")
    @Operation(summary = "Get all theaters by city", description = "Returns a list of all theaters in a city")
    public ResponseEntity<ApiResponse> getAllTheaterByCity(@RequestParam String city) {
        try {
            List<TheaterResponse> result = theaterService.getAllTheatersByCity(city);
            return ResponseEntity.ok(new ApiResponse("Success",true,result));
        }catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ApiResponse("Error fetching all theaters: " + e.getMessage(), false, null)
            );
        }
    }

    @GetMapping
    @Operation(summary = "Get theaters by brand and city", description = "Returns a list of theaters for a brand in a specific city")
    public ResponseEntity<ApiResponse> getTheatersByBrandAndCity(
            @RequestParam Integer brandId,
            @RequestParam String city
    ) {
        try {
            List<TheaterResponse> theaters = theaterService.getTheatersByBrandAndCity(brandId, city);
            return ResponseEntity.ok(new ApiResponse("Success", true, theaters));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ApiResponse("Error retrieving theaters: " + e.getMessage(), false, null)
            );
        }
    }

    @GetMapping("/list_day")
    @Operation(summary = "Get next N days",
            description = "Returns a list of the next N days starting from today, with day and day-of-week label in Vietnamese. Default is 7 days if 'days' parameter is not provided.")
    public ResponseEntity<ApiResponse> getNextDays(@RequestParam(defaultValue = "7") @Positive Integer days) {
        try {
            List<Map<String, String>> daysList = theaterService.getNextDays(days);
            return ResponseEntity.ok(new ApiResponse("Success", true, daysList));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ApiResponse("Error retrieving days: " + e.getMessage(), false, null)
            );
        }
    }

    @GetMapping("/{theaterId}/movies")
    @Operation(summary = "Get movies with showtimes by theater",
            description = "Returns a list of movies with their showtimes at a specific theater on a specific date (format: yyyy-MM-dd). If date is not provided, returns upcoming showtimes from the current time.")
    public ResponseEntity<ApiResponse> getMoviesWithShowtimesByTheater(
            @PathVariable @Positive Integer theaterId,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") String date
    ) {
        try {
            List<MovieWithShowtimesResponse> movies = theaterService.getMoviesWithShowtimesByTheater(theaterId, date);
            return ResponseEntity.ok(new ApiResponse("Success", true, movies));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ApiResponse("Error retrieving movies and showtimes: " + e.getMessage(), false, null)
            );
        }
    }
}
