package com.vietcine.moviebooking_server.mapper;

import com.vietcine.moviebooking_server.dto.response.FoodResponse;
import com.vietcine.moviebooking_server.entity.Food;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FoodMapper {
    FoodResponse toFoodDTO(Food food);
}
