package com.vietcine.moviebooking_server.service.food;

import com.vietcine.moviebooking_server.dto.response.FoodResponse;
import com.vietcine.moviebooking_server.mapper.FoodMapper;
import com.vietcine.moviebooking_server.repository.IFoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodService implements IFoodService {
    @Autowired
    private IFoodRepository foodRepository;

    @Autowired
    private FoodMapper foodMapper;

    @Override
    public List<FoodResponse> getFoodByTheaterBrand(Integer theaterId) {
        return foodRepository.findByTheaterBrand_Id(theaterId)
                .stream().map(foodMapper::toFoodDTO)
                .toList();
    }
}
