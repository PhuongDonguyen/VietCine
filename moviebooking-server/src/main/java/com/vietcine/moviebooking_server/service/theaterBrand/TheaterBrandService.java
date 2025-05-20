package com.vietcine.moviebooking_server.service.theaterBrand;

import com.vietcine.moviebooking_server.dto.response.TheaterBrandResponse;
import com.vietcine.moviebooking_server.mapper.TheaterBrandMapper;
import com.vietcine.moviebooking_server.repository.ITheaterBrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TheaterBrandService implements ITheaterBrandService{

    @Autowired
    private ITheaterBrandRepository theaterBrandRepository;

    @Autowired
    private TheaterBrandMapper theaterBrandMapper;


    @Override
    public List<TheaterBrandResponse> getBrandsByCity(String city) {
        return theaterBrandRepository.findBrandsByCity(city).stream()
                .map(theaterBrandMapper::toTheaterBrandDTO)
                .collect(Collectors.toList());
    }

}
