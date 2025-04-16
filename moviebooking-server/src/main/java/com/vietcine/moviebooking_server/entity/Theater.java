package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@ToString
@Entity
public class Theater {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TheaterId", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @Column(name = "Name", nullable = false, length = 100)
    private String name;

    @Size(max = 255)
    @NotNull
    @Nationalized
    @Column(name = "Address", nullable = false)
    private String address;

    @Size(max = 50)
    @NotNull
    @Nationalized
    @Column(name = "City", nullable = false, length = 50)
    private String city;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "TotalScreens", nullable = false)
    private Integer totalScreens;

    @OneToMany(mappedBy = "theater")
    private Set<Screen> screens = new LinkedHashSet<>();

}