package com.vietcine.moviebooking_server.entity;

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
public class Seat {
    @Id
    @Column(name = "SeatId", nullable = false)
    private Integer id;

    @Size(max = 1)
    @NotNull
    @Nationalized
    @Column(name = "Row", nullable = false, length = 1)
    private String row;

    @NotNull
    @Column(name = "\"Column\"", nullable = false)
    private Integer column;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "SeatTypeId", nullable = false)
    private SeatType seatType;
}