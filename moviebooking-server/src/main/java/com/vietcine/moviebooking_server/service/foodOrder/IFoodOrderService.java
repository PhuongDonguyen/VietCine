package com.vietcine.moviebooking_server.service.foodOrder;

import com.vietcine.moviebooking_server.dto.request.FoodOrderRequest;
import com.vietcine.moviebooking_server.dto.request.FoodOrderUpdateRequest;
import com.vietcine.moviebooking_server.dto.response.FoodOrderResponse;

public interface IFoodOrderService {
    FoodOrderResponse createFoodOrder(FoodOrderRequest foodOrderRequest);
    FoodOrderResponse updateFoodOrder(Integer id, FoodOrderUpdateRequest updateRequest);
} 