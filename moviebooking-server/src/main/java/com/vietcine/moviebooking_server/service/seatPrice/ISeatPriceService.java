package com.vietcine.moviebooking_server.service.seatPrice;

import com.vietcine.moviebooking_server.dto.response.SeatPriceResponse;

import java.time.LocalDate;
import java.util.List;

public interface ISeatPriceService {
    List<SeatPriceResponse> getSeatPriceOfScreen(int screenId, LocalDate bookingDate);
}
