package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Nationalized;

@Getter
@Setter
@ToString
@Entity
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FoodId", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @Column(name = "FoodName", nullable = false, length = 100)
    private String foodName;

    @Size(max = 200)
    @NotNull
    @Nationalized
    @Column(name = "Description", nullable = false, length = 200)
    private String description;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "TheaterBrandId", nullable = false)
    private TheaterBrand theaterBrand;

    @NotNull
    @Column(name = "Price", nullable = false)
    private Integer price;

}