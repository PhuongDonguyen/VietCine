package com.vietcine.moviebooking_server.dto.response;

import com.vietcine.moviebooking_server.entity.Movie;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ShowtimeResponse {
    private Integer id;
    private Instant startTime;
    private Instant endTime;
    private MovieResponse movie;
    private ScreenResponse screen;
    private String availableSeats;
}
