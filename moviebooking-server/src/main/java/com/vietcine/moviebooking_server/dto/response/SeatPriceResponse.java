package com.vietcine.moviebooking_server.dto.response;

import com.vietcine.moviebooking_server.entity.SeatType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

public class SeatPriceResponse {
    private Integer id;
    private SeatType seatType;
    private Integer price;
}
