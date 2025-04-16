package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
public class Director {
    @Id
    @Column(name = "DirectorId", nullable = false)
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

}