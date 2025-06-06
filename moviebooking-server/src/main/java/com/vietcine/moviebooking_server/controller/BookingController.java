package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.request.BookingRequest;
import com.vietcine.moviebooking_server.dto.request.BookingUpdateRequest;
import com.vietcine.moviebooking_server.dto.response.ApiResponse;
import com.vietcine.moviebooking_server.dto.response.BookingDetailResponse;
import com.vietcine.moviebooking_server.dto.response.BookingResponse;
import com.vietcine.moviebooking_server.entity.Booking;
import com.vietcine.moviebooking_server.service.booking.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Bookings", description = "APIs for managing movie bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    @Operation(summary = "Create a new booking", description = "Creates a new booking with user, showtime, seats, foods, and other details")
    public ResponseEntity<ApiResponse> createBooking(@Valid @RequestBody BookingRequest bookingRequest) {
        try {
            BookingResponse booking = bookingService.createBooking(bookingRequest);
            return ResponseEntity.ok(new ApiResponse("Booking created successfully", true, booking));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("An error occurred: " + e.getMessage(), false, null));
        }
    }


    @CrossOrigin(origins = "http://localhost:5173")
    @PatchMapping("/{id}")
    @Operation(summary = "Partially update booking status and transaction reference",
            description = "Updates the VNP transaction reference and status to 'Success' or 'Failed' for a specific booking, setting isActive to false for failed bookings")
    public ResponseEntity<ApiResponse> updateBooking(
            @PathVariable("id") Integer id,
            @Valid @RequestBody BookingUpdateRequest updateRequest) {
        try {
            BookingResponse updatedBooking = bookingService.updateBooking(id, updateRequest);
            return ResponseEntity.ok(new ApiResponse("Booking updated successfully", true, updatedBooking));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("An error occurred: " + e.getMessage(), false, null));
        }
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user bookings", description = "Retrieves all active bookings for a specific user with detailed information")
    public ResponseEntity<ApiResponse> getUserBookings(@PathVariable Integer userId) {
        try {
            List<BookingDetailResponse> bookings = bookingService.getUserBookings(userId);
            return ResponseEntity.ok(new ApiResponse("User bookings retrieved successfully", true, bookings));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("An error occurred: " + e.getMessage(), false, null));
        }
    }
}