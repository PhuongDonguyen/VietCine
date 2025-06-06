package com.vietcine.moviebooking_server.dto.response;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingFoodResponse {
    private Integer id;
    private Integer bookingId;
    private String foodName;
    private Integer quantity;
    private Integer total;
} 