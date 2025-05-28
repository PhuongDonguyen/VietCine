package com.vietcine.moviebooking_server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SeatPriceResponse {
    private Integer seatTypeId;
    private String seatTypeName;
    private Integer price;
    private Integer priceIncrease;
    private Integer totalPrice;
}
