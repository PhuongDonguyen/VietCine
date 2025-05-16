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
public class Voucher {
    @Id
    @Column(name = "VoucherId", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "Discount", nullable = false)
    private Integer discount;

    @NotNull
    @Column(name = "ValidFrom", nullable = false)
    private LocalDate validFrom;

    @NotNull
    @Column(name = "ValidUntil", nullable = false)
    private LocalDate validUntil;

    @NotNull
    @Column(name = "MinBillPrice", nullable = false)
    private Integer minBillPrice;

    @Size(max = 200)
    @NotNull
    @Nationalized
    @Column(name = "Description", nullable = false, length = 200)
    private String description;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "TheaterBrandId", nullable = false)
    private TheaterBrand theaterBrand;

}