package com.vietcine.moviebooking_server.dto.response;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TheaterBrandResponse {
    private Integer id;
    private String name;
    private String logo;
}
