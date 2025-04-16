package com.vietcine.moviebooking_server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SeatTypeWithPriceResponse {
    private Integer seatTypeId;
    private String typeName;
    private Integer price;
    private Integer priceIncrease;
    private Integer totalPrice;
}
