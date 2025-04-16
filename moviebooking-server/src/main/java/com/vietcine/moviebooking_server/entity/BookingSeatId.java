package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@ToString
@Embeddable
public class BookingSeatId implements Serializable {
    private static final long serialVersionUID = -8400431171422166397L;
    @NotNull
    @Column(name = "BookingId", nullable = false)
    private Integer bookingId;

    @NotNull
    @Column(name = "SeatId", nullable = false)
    private Integer seatId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        BookingSeatId entity = (BookingSeatId) o;
        return Objects.equals(this.seatId, entity.seatId) &&
                Objects.equals(this.bookingId, entity.bookingId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(seatId, bookingId);
    }

}