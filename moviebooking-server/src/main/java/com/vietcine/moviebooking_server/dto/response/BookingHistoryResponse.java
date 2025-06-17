package com.vietcine.moviebooking_server.dto.response;

import lombok.Data;

import java.time.Instant;

@Data
public class BookingHistoryResponse {
    private Integer bookingId;
    private String movieName;
    private String posterUrl;
    private String theaterName;
    private Instant startTime;
}
