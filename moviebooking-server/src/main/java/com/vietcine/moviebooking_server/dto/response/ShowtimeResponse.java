package com.vietcine.moviebooking_server.dto.response;

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
    private ScreenResponse screen;
    private String availableSeats;
}
