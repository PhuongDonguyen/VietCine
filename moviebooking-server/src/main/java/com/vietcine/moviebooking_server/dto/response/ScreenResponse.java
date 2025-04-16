package com.vietcine.moviebooking_server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScreenResponse {
    private Integer id;
    private String screenNumber;
    private Integer totalSeats;
    private TheaterResponse theater;
}