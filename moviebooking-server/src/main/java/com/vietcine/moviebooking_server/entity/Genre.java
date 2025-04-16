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
public class Genre {
    @Id
    @Column(name = "GenreId", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Nationalized
    @Column(name = "Name", nullable = false, length = 50)
    private String name;

    @ManyToMany
    @JoinTable(name = "MovieGenre",
            joinColumns = @JoinColumn(name = "GenreId"),
            inverseJoinColumns = @JoinColumn(name = "MovieId"))
    private Set<Movie> movies = new LinkedHashSet<>();

}