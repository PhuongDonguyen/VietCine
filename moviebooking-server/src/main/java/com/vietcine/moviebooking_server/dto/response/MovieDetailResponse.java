package com.vietcine.moviebooking_server.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
public class MovieDetailResponse {
    private Integer id;
    private String title;
    private String englishTitle;
    private Integer duration;
    private LocalDate releaseDate;
    private String description;
    private DirectorResponse director;
    private String trailerUrl;
    private String posterUrl;
    private Double rating;
    private String slug;
    private Boolean isAvailable;
    private List<GenreResponse> genres;
    private List<ShowtimeResponse> showtimes;
    private List<MovieCastResponse> movieCasts;
}
