package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.response.APIResponse;
import com.vietcine.moviebooking_server.dto.response.TheaterResponse;
import com.vietcine.moviebooking_server.service.theater.ITheaterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/theaters")
@Tag(name = "Theaters", description = "APIs for handling theaters")
public class TheaterController {

    @Autowired
    private ITheaterService theaterService;

    @GetMapping("/cities")
    @Operation(summary = "Get list of cities", description = "Returns all cities that have theaters")
    public ResponseEntity<APIResponse> getAllCities() {
        try {
            List<String> cities = theaterService.getAllCities();
            return ResponseEntity.ok(new APIResponse("Success", true, cities));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new APIResponse("Error retrieving cities: " + e.getMessage(), false, null)
            );
        }
    }

    @GetMapping("/recommend")
    @Operation(summary = "Get recommended theaters by city", description = "Returns a list of recommended theaters in a city")
    public ResponseEntity<APIResponse> getRecommendedTheatersByCity(@RequestParam String city) {
        try {
            List<TheaterResponse> result = theaterService.getRecommendedTheatersByCity(city);
            return ResponseEntity.ok(new APIResponse("Success", true, result));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new APIResponse("Error fetching recommended theaters: " + e.getMessage(), false, null)
            );
        }
    }

    @GetMapping
    @Operation(summary = "Get theaters by brand and city", description = "Returns a list of theaters for a brand in a specific city")
    public ResponseEntity<APIResponse> getTheatersByBrandAndCity(
            @RequestParam Integer brandId,
            @RequestParam String city
    ) {
        try {
            List<TheaterResponse> theaters = theaterService.getTheatersByBrandAndCity(brandId, city);
            return ResponseEntity.ok(new APIResponse("Success", true, theaters));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new APIResponse("Error retrieving theaters: " + e.getMessage(), false, null)
            );
        }
    }
}
