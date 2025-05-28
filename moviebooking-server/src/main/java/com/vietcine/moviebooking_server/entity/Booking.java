package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@ToString
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingId", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "ShowtimeId", nullable = false)
    private Showtime showtime;

    @NotNull
    @ColumnDefault("getdate()")
    @Column(name = "BookingDate", nullable = false)
    private Instant bookingDate;

    @NotNull
    @Column(name = "Total", nullable = false)
    private Integer total;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @ColumnDefault("N'Pending'")
    @Column(name = "Status", nullable = false, length = 100)
    private String status;

    @Column(name = "Discount")
    private Integer discount;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "PaymentId", nullable = false)
    private Payment payment;

    @NotNull
    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = true;

    @Size(max = 200)
    @Nationalized
    @Column(name = "VnpTxnRef", nullable = false, length = 200)
    private String vnpTxnRef;

    @Column(name = "VoucherUserId", nullable = false)
    private Integer voucherUserId;

    @OneToMany(mappedBy = "booking")
    private Set<BookingFood> bookingFoods = new LinkedHashSet<>();

    @OneToMany(mappedBy = "booking")
    private Set<BookingSeat> bookingSeats = new LinkedHashSet<>();

}