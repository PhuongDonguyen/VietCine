package com.vietcine.moviebooking_server.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@ToString
@Entity
public class Showtime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ShowtimeId", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "MovieId", nullable = false)
    private Movie movie;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "ScreenId", nullable = false)
    private Screen screen;

    @NotNull
    @Column(name = "StartTime", nullable = false)
    private Instant startTime;

    @NotNull
    @Column(name = "EndTime", nullable = false)
    private Instant endTime;

    @OneToMany(mappedBy = "showtime")
    private Set<Booking> bookings = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(name = "ShowtimeSeat",
            joinColumns = @JoinColumn(name = "ShowtimeId"),
            inverseJoinColumns = @JoinColumn(name = "SeatId"))
    private Set<Seat> seats = new LinkedHashSet<>();

}