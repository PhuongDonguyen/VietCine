package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
public class BookingSeat {
    @EmbeddedId
    private BookingSeatId id;

    @MapsId("bookingId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "BookingId", nullable = false)
    private Booking booking;

    @MapsId("seatId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "SeatId", nullable = false)
    private Seat seat;

}