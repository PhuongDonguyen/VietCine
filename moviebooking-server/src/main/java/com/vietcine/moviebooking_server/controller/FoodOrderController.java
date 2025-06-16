package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.request.FoodOrderRequest;
import com.vietcine.moviebooking_server.dto.request.FoodOrderUpdateRequest;
import com.vietcine.moviebooking_server.dto.response.ApiResponse;
import com.vietcine.moviebooking_server.dto.response.FoodOrderResponse;
import com.vietcine.moviebooking_server.service.foodOrder.FoodOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/food-orders")
@Tag(name = "Food Orders", description = "APIs for managing food orders")
public class FoodOrderController {

    @Autowired
    private FoodOrderService foodOrderService;

    @PostMapping
    @Operation(summary = "Create a new food order", description = "Creates a new food order with user, theater, foods, and other details")
    public ResponseEntity<ApiResponse> createFoodOrder(@Valid @RequestBody FoodOrderRequest foodOrderRequest) {
        try {
            FoodOrderResponse foodOrder = foodOrderService.createFoodOrder(foodOrderRequest);
            return ResponseEntity.ok(new ApiResponse("Food order created successfully", true, foodOrder));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("An error occurred: " + e.getMessage(), false, null));
        }
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update food order status", description = "Updates the VNP transaction reference and status to 'Success' or 'Failed' for a specific food order")
    public ResponseEntity<ApiResponse> updateFoodOrder(
            @PathVariable("id") Integer id,
            @Valid @RequestBody FoodOrderUpdateRequest updateRequest) {
        try {
            FoodOrderResponse updatedFoodOrder = foodOrderService.updateFoodOrder(id, updateRequest);
            return ResponseEntity.ok(new ApiResponse("Food order updated successfully", true, updatedFoodOrder));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("An error occurred: " + e.getMessage(), false, null));
        }
    }
}
