package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.FoodOrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IFoodOrderDetailRepository extends JpaRepository<FoodOrderDetail, Integer> {
}