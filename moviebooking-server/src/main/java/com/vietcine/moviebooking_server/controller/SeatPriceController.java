package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.response.ApiResponse;
import com.vietcine.moviebooking_server.dto.response.SeatPriceResponse;
import com.vietcine.moviebooking_server.service.seatPrice.ISeatPriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/seatprices")
public class SeatPriceController {
    @Autowired
    private ISeatPriceService seatPriceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SeatPriceResponse>>> getSeatPrice(
            @RequestParam(defaultValue = "0") int screenId,
            @RequestParam LocalDate bookingDate) {
        try {
            return ResponseEntity.ok(new ApiResponse<>("Get seat price successfully", true,
                    seatPriceService.getSeatPriceOfScreen(screenId, bookingDate)));
        } catch (Exception e) {
            System.out.println(e.getStackTrace());
            return ResponseEntity.status(404).body(
                    new ApiResponse<>("Error retrieving seat price: " + e.getMessage(), false, null));
        }
    }
}