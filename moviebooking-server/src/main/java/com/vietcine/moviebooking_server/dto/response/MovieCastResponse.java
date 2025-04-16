package com.vietcine.moviebooking_server.dto.response;

import lombok.Data;

@Data
public class MovieCastResponse {
    private CastResponse Cast;
    private String CharacterName;
}
