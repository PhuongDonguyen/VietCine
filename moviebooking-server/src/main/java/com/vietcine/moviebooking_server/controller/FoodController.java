package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.response.ApiResponse;
import com.vietcine.moviebooking_server.dto.response.FoodResponse;
import com.vietcine.moviebooking_server.dto.response.GenreResponse;
import com.vietcine.moviebooking_server.service.food.FoodService;
import com.vietcine.moviebooking_server.service.genre.GenreService;
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
@RequestMapping("/api/food")
@Tag(name = "Food", description = "APIs for managing food and beverages")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @GetMapping
    @Operation(summary = "Get food by theater", description = "Retrieves a list of food items available at a specific theater.")
    public ResponseEntity<ApiResponse<List<FoodResponse>>> getFoodByTheaterBrand(@RequestParam Integer theaterBrandId) {
        List<FoodResponse> foods = foodService.getFoodByTheaterBrand(theaterBrandId);
        return ResponseEntity.ok(new ApiResponse<List<FoodResponse>>("Success", true, foods));
    }
}