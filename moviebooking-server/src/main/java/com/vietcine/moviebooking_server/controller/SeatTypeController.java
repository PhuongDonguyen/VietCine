package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.response.ApiResponse;
import com.vietcine.moviebooking_server.service.seatType.SeatTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seattypes")
public class SeatTypeController {
    @Autowired
    private SeatTypeService seatTypeService;

    @GetMapping
    public ResponseEntity<ApiResponse> getSeatType(@RequestParam(defaultValue = "0") int screenId,@RequestParam(required = true) String bookingDate) {
        try {
            return ResponseEntity.ok(new ApiResponse("Get seattype successfully", true, seatTypeService.getSeattypesOfScreen(screenId, bookingDate)));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(
                    new ApiResponse("Error retrieving seats: " + e.getMessage(), false, null)            );
        }
    }
}
