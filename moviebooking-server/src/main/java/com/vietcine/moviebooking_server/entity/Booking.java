package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@ToString
@Entity
public class Booking {
    @Id
    @Column(name = "BookingId", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @NotNull
    @ColumnDefault("getdate()")
    @Column(name = "BookingDate", nullable = false)
    private Instant bookingDate;

    @NotNull
    @Column(name = "TotalAmount", nullable = false, precision = 8, scale = 2)
    private BigDecimal totalAmount;

    @Size(max = 20)
    @NotNull
    @Nationalized
    @ColumnDefault("N'Pending'")
    @Column(name = "Status", nullable = false, length = 20)
    private String status;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "ShowtimeId", nullable = false)
    private Showtime showtime;

}