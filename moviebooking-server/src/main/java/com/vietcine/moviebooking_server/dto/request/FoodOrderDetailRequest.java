package com.vietcine.moviebooking_server.dto.request;

import lombok.Data;

@Data
public class FoodOrderDetailRequest {
    private Integer foodOrderId;
    private Integer foodId;
    private Integer quantity;
}
