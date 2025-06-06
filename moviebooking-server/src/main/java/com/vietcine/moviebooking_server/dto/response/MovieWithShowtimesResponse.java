package com.vietcine.moviebooking_server.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class MovieWithShowtimesResponse {
    private Integer id;
    private String title;
    private String posterUrl;
    private Double rating;
    private Integer duration;
    private String slug;
    private List<GenreResponse> genres;
    private List<ShowtimeResponse> showtimes;
}
