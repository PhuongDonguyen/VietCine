package com.vietcine.moviebooking_server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
public class SeatResponse {
    private Integer seatId;
    private String row;
    private Integer column;
    private Integer bookingId;
    private Integer showtimeId;
    private Integer seatTypeId;
    private boolean isAvailable;
}
