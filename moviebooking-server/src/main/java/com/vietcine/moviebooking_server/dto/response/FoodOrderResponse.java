package com.vietcine.moviebooking_server.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FoodOrderResponse {
    private Integer id;
    private Integer userId;
    private TheaterResponse theater;
    private LocalDate receiveDate;
    private Integer paymentId;
    private Integer total;
    private String vnpTxnRef;
    private Boolean isActive;
    private String status;
} 