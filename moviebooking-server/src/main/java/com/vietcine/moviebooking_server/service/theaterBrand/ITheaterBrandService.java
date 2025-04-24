package com.vietcine.moviebooking_server.service.theaterBrand;

import com.vietcine.moviebooking_server.dto.response.TheaterBrandResponse;

import java.util.List;

public interface ITheaterBrandService {
    List<TheaterBrandResponse> getBrandsByCity(String city);
}
