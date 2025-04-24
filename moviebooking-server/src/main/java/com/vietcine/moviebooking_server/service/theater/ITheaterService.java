package com.vietcine.moviebooking_server.service.theater;

import com.vietcine.moviebooking_server.dto.response.TheaterResponse;

import java.util.List;

public interface ITheaterService {
    List<String> getAllCities();
    List<TheaterResponse> getRecommendedTheatersByCity(String city);
    List<TheaterResponse> getTheatersByBrandAndCity(Integer brandId, String city);

}
