package com.vietcine.moviebooking_server.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Nationalized;

@Getter
@Setter
@ToString
@Entity
public class MovieCast {
    @EmbeddedId
    private MovieCastId id;

    @MapsId("movieId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MovieId", nullable = false)
    private Movie movie;

    @MapsId("castId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "CastId", nullable = false)
    private Cast cast;

    @Size(max = 200)
    @NotNull
    @Nationalized
    @Column(name = "CharacterName", nullable = false, length = 200)
    private String characterName;

}