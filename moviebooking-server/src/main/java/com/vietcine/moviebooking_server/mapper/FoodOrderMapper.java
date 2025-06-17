package com.vietcine.moviebooking_server.mapper;

import com.vietcine.moviebooking_server.dto.response.FoodOrderResponse;
import com.vietcine.moviebooking_server.entity.FoodOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FoodOrderMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "theater.id", target = "theaterId")
    @Mapping(source = "payment.id", target = "paymentId")
    FoodOrderResponse toFoodOrderResponse(FoodOrder foodOrder);
} 