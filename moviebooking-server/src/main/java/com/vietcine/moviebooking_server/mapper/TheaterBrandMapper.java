package com.vietcine.moviebooking_server.mapper;

import com.vietcine.moviebooking_server.dto.response.TheaterBrandResponse;
import com.vietcine.moviebooking_server.entity.TheaterBrand;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = TheaterMapper.class)
public interface TheaterBrandMapper {
    TheaterBrandResponse toTheaterBrandDTO(TheaterBrand theaterBrand);
}

