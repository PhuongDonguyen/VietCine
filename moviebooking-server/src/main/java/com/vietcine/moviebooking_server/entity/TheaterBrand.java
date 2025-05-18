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
public class TheaterBrand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TheaterBrandId",nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @Column(name = "TheaterBrandName", nullable = false, length = 100)
    private String name;

    @Size(max = 200)
    @Nationalized
    @Column(name = "Logo", nullable = true, length = 200)
    private String logo;

    @ToString.Exclude
    @OneToMany(mappedBy = "theaterBrand", cascade = CascadeType.ALL)
    private Set<Theater> theaters = new LinkedHashSet<>();

}
