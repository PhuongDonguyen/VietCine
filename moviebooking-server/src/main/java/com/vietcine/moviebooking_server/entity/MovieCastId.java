package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@ToString
@Embeddable
public class MovieCastId implements Serializable {
    @Column(name = "MovieId")
    private Integer movieId;

    @Column(name = "CastId")
    private Integer castId;
}