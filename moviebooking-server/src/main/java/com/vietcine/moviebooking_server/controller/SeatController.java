package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.response.APIResponse;
import com.vietcine.moviebooking_server.dto.response.SeatResponse;
import com.vietcine.moviebooking_server.service.seat.SeatService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {
    @Autowired
    private SeatService seatService;

    @GetMapping("/showtime/{showtimeId}")
    public ResponseEntity<APIResponse> getSeatsByShowtime(@PathVariable int showtimeId) {
        try {
            return ResponseEntity.ok(new APIResponse("Get seats successfully", true, seatService.getSeatsByShowtime(showtimeId)));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(
                    new APIResponse("Error retrieving seats: " + e.getMessage(), false, null)
            );
        }
    }
}
