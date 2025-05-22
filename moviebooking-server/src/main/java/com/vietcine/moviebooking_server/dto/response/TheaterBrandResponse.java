package com.vietcine.moviebooking_server.dto.response;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TheaterBrandResponse {
    private Integer id;
    private String theaterBrandName;
}
