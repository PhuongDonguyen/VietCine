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
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PaymentId", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @Column(name = "PaymentMethod", nullable = false, length = 100)
    private String paymentMethod;

    @OneToMany(mappedBy = "payment")
    private Set<Booking> bookings = new LinkedHashSet<>();

    @OneToMany(mappedBy = "payment")
    private Set<FoodOrder> foodOrders = new LinkedHashSet<>();

}