package com.vietcine.moviebooking_server.dto.response;

import com.vietcine.moviebooking_server.entity.Movie;
import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MovieResponse {
    private Integer id;
    private String title;
    private Integer duration;
    private LocalDate releaseDate;
    private String description;
    private DirectorResponse director;
    private String trailerUrl;
    private String englishTitle;
    private Boolean isAvailable;
    private String posterUrl;
    private Double rating;
    private Set<GenreResponse> genres;
}
