package com.vietcine.moviebooking_server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TheaterResponse {
    private Integer id;
    private String name;
    private String address;
    private String city;
    private TheaterBrandResponse theaterBrand;
    private Integer totalScreens;
}