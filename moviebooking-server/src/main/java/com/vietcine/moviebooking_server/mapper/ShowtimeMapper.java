package com.vietcine.moviebooking_server.mapper;

import com.vietcine.moviebooking_server.dto.response.ShowtimeResponse;
import com.vietcine.moviebooking_server.entity.Showtime;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {TheaterMapper.class})
public interface ShowtimeMapper {
    ShowtimeResponse toShowtimeDTO(Showtime showtime);
}
