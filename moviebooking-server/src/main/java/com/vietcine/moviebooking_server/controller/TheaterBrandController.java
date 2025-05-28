package com.vietcine.moviebooking_server.controller;
import com.vietcine.moviebooking_server.dto.response.ApiResponse;
import com.vietcine.moviebooking_server.dto.response.TheaterBrandResponse;
import com.vietcine.moviebooking_server.service.theaterBrand.ITheaterBrandService;
import com.vietcine.moviebooking_server.service.theater.ITheaterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theater-brands")
@Tag(name = "Theater Brands & Theaters", description = "APIs for handling theaters and brands by city")
public class TheaterBrandController {

    @Autowired
    private ITheaterService theaterService;

    @Autowired
    private ITheaterBrandService theaterBrandService;

    @GetMapping
    @Operation(summary = "Get brands by city", description = "Returns all theater brands available in a given city")
    public ResponseEntity<ApiResponse> getBrandsByCity(
            @RequestParam String city
    ) {
        try {
            List<TheaterBrandResponse> brands = theaterBrandService.getBrandsByCity(city);
            return ResponseEntity.ok(new ApiResponse("Success", true, brands));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ApiResponse("Error retrieving brands: " + e.getMessage(), false, null)
            );
        }
    }
}