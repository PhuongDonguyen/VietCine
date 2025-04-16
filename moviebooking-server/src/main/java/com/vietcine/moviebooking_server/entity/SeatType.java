package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Nationalized;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@ToString
@Entity
public class SeatType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SeatTypeId", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Nationalized
    @Column(name = "TypeName", nullable = false, length = 50)
    private String typeName;

    @OneToMany(mappedBy = "seatType")
    private Set<PriceAdjustment> priceAdjustments = new LinkedHashSet<>();

    @OneToMany(mappedBy = "seatType")
    private Set<Seat> seats = new LinkedHashSet<>();

    @OneToMany(mappedBy = "seatType")
    private Set<SeatPrice> seatPrices = new LinkedHashSet<>();

}