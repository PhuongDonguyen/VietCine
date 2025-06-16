package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.FoodOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IFoodOrderRepository extends JpaRepository<FoodOrder, Integer> {
}