package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;

@Getter
@Setter
@ToString
@Entity
public class PriceAdjustment {
    @Id
    @Column(name = "PriceAdjustmentId", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "SeatTypeId", nullable = false)
    private SeatType seatType;

    @Size(max = 50)
    @NotNull
    @Nationalized
    @Column(name = "AdjstmentType", nullable = false, length = 50)
    private String adjstmentType;

    @Size(max = 50)
    @Nationalized
    @Column(name = "DayOfWeek", length = 50)
    private String dayOfWeek;

    @Column(name = "SpecificDate")
    private LocalDate specificDate;

    @NotNull
    @Column(name = "PriceIncrease", nullable = false)
    private Integer priceIncrease;

}