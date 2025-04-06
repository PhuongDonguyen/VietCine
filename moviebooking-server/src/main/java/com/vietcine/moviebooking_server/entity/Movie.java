package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@ToString
@Entity
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MovieId", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @Column(name = "Title", nullable = false, length = 100)
    private String title;

    @NotNull
    @Column(name = "Duration", nullable = false)
    private Integer duration;

    @NotNull
    @Column(name = "ReleaseDate", nullable = false)
    private LocalDate releaseDate;

    @NotNull
    @Nationalized
    @Lob
    @Column(name = "Description", nullable = false)
    private String description;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "DirectorId", nullable = false)
    private Director director;

    @Size(max = 200)
    @Nationalized
    @Column(name = "TrailerUrl", length = 200)
    private String trailerUrl;

    @Size(max = 100)
    @Nationalized
    @Column(name = "EnglishTitle", length = 100)
    private String englishTitle;

    @Column(name = "isAvailable")
    private Boolean isAvailable;

    @Size(max = 200)
    @Nationalized
    @Column(name = "PosterUrl", length = 200)
    private String posterUrl;

    @Column(name = "rating")
    private Double rating;

    @OneToMany(mappedBy = "movie")
    private Set<MovieCast> movieCasts = new LinkedHashSet<>();

    @ManyToMany(mappedBy = "movies")
    private Set<Genre> genres = new LinkedHashSet<>();

    @OneToMany(mappedBy = "movie")
    private Set<Showtime> showtimes = new LinkedHashSet<>();

}