package com.vietcine.moviebooking_server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FoodResponse {
    private Integer id;
    private String foodName;
    private String description;
    private Integer price;
}
