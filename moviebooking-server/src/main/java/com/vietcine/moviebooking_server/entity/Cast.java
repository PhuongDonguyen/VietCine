package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Nationalized;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@ToString
@Entity
@Table(name = "\"Cast\"")
public class Cast {
    @Id
    @Column(name = "CastId", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @Column(name = "Name", nullable = false, length = 100)
    private String name;

    @Size(max = 200)
    @Nationalized
    @Column(name = "Avatar", length = 200)
    private String avatar;

    @OneToMany(mappedBy = "cast")
    private Set<MovieCast> movieCasts = new LinkedHashSet<>();
}