package com.vietcine.moviebooking_server.service.food;

import com.vietcine.moviebooking_server.dto.response.FoodResponse;

import java.util.List;

public interface IFoodService {
    List<FoodResponse> getFoodByTheaterBrand(Integer theaterId);
}
