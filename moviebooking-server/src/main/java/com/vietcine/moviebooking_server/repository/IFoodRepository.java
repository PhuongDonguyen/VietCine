package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.Food;
import com.vietcine.moviebooking_server.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IFoodRepository  extends JpaRepository<Food, Integer> {
     List<Food> findByTheaterBrand_Id(Integer theaterBrandId);
}
