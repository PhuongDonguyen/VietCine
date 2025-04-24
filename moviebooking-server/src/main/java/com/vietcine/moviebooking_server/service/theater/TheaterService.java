package com.vietcine.moviebooking_server.service.theater;

import com.vietcine.moviebooking_server.dto.response.TheaterResponse;
import com.vietcine.moviebooking_server.entity.Theater;
import com.vietcine.moviebooking_server.mapper.TheaterMapper;
import com.vietcine.moviebooking_server.repository.ITheaterRepository;
import com.vietcine.moviebooking_server.service.theater.ITheaterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TheaterService implements ITheaterService {

    @Autowired
    private ITheaterRepository theaterRepository;

    @Autowired
    private TheaterMapper theaterMapper;

    @Override
    public List<String> getAllCities() {
        return theaterRepository.findAllCities();
    }

    @Override
    public List<TheaterResponse> getRecommendedTheatersByCity(String city) {
        return theaterRepository.findRecommendedTheatersByCity(city).stream()
                .map(theaterMapper::toTheaterDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TheaterResponse> getTheatersByBrandAndCity(Integer brandId, String city) {
        return theaterRepository.findByTheaterBrandIdAndCity(brandId, city).stream()
                .map(theaterMapper::toTheaterDTO)
                .collect(Collectors.toList());
    }



}
