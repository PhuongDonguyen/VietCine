package com.vietcine.moviebooking_server.mapper;

import com.vietcine.moviebooking_server.dto.response.DirectorResponse;
import com.vietcine.moviebooking_server.entity.Director;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DirectorMapper {
    DirectorResponse toDirectorDTO(Director director);
}
