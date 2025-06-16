package com.vietcine.moviebooking_server.dto.request;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class FoodOrderRequest {
    private Integer userId;
    private Integer theaterId;
    private LocalDate receiveDate;
    private Integer paymentId;
    private Integer total;
    private String vnpTxnRef;
    private Boolean isActive = true;
    private List<FoodOrderDetailRequest> foodDetails;
}
