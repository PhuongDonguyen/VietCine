package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.response.APIResponse;
import com.vietcine.moviebooking_server.service.seatType.SeatTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seattypes")
public class SeatTypeController {
    @Autowired
    private SeatTypeService seatTypeService;

    @GetMapping
    public ResponseEntity<APIResponse> getAllSeattype() {
        try {
            return ResponseEntity.ok(new APIResponse("Get seats successfully", true, seatTypeService.getAllSeatType()));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(
                    new APIResponse("Error retrieving seats: " + e.getMessage(), false, null)            );
        }
    }

    @GetMapping("/withprice/{screenId}")
    public ResponseEntity<APIResponse> getSeattypesWithPrice(@PathVariable int screenId) {
        try {
            return ResponseEntity.ok(new APIResponse("Get seats successfully", true, seatTypeService.getSeattypesWithPrice(screenId)));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(
                    new APIResponse("Error retrieving seats: " + e.getMessage(), false, null)
            );
        }
    }
}
