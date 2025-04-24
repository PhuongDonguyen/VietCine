package com.vietcine.moviebooking_server.mapper;

import com.vietcine.moviebooking_server.dto.response.TheaterResponse;
import com.vietcine.moviebooking_server.entity.Theater;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TheaterMapper {
    TheaterResponse toTheaterDTO(Theater theater);
}
