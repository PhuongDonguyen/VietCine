package com.vietcine.moviebooking_server.service.seat;

import com.vietcine.moviebooking_server.dto.response.SeatResponse;

import java.util.List;

public interface ISeatService {
    List<SeatResponse> getSeatsByShowtime(int showtimeId);
}
