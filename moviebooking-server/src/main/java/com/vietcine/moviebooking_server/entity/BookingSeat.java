package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@ToString
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingSeatId", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "BookingId", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "SeatId", nullable = false)
    private Seat seat;

}