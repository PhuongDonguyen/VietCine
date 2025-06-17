package com.vietcine.moviebooking_server.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@ToString
@Entity
@Table(name = "FoodOrder")
public class FoodOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FoodOrderId", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "TheaterId", nullable = false)
    private Theater theater;

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
    @Nationalized
    @Column(name = "VnpTxnRef", nullable = true, length = 10)
    private String vnpTxnRef;

    @NotNull
    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = true;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @Column(name = "Status", nullable = false, length = 100)
    private String status;

    @OneToMany(mappedBy = "foodOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<FoodOrderDetail> foodOrderDetails = new HashSet<>();
}