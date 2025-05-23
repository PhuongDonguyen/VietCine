package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@ToString
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingFood {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingFoodId", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "BookingId", nullable = false)
    private Booking booking;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "FoodId", nullable = false)
    private Food food;

    @NotNull
    @Column(name = "Quantity", nullable = false)
    private Integer quantity;

    @NotNull
    @Column(name = "Total", nullable = false)
    private Integer total;

}