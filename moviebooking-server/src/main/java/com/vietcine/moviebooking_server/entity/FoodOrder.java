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
public class FoodOrder {
    @Id
    @Column(name = "FoodOrderId", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "ReceiveDate", nullable = false)
    private LocalDate receiveDate;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "PaymentId", nullable = false)
    private Payment payment;

    @NotNull
    @Column(name = "Total", nullable = false)
    private Integer total;

    @Size(max = 10)
    @NotNull
    @Nationalized
    @Column(name = "VnpTxnRef", nullable = false, length = 10)
    private String vnpTxnRef;

    @NotNull
    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = false;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @Column(name = "Status", nullable = false, length = 100)
    private String status;

}