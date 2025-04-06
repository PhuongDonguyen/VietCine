package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@ToString
@Entity
public class Showtime {
    @Id
    @Column(name = "ShowtimeId", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "MovieId", nullable = false)
    private Movie movie;

    @NotNull
    @Column(name = "StartTime", nullable = false)
    private Instant startTime;

    @NotNull
    @Column(name = "EndTime", nullable = false)
    private Instant endTime;

}