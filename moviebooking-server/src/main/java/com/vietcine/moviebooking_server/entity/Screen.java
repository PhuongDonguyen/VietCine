package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@ToString
@Entity
public class Screen {
    @Id
    @Column(name = "ScreenId", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "TheaterId", nullable = false)
    private Theater theater;

    @Size(max = 10)
    @NotNull
    @Nationalized
    @Column(name = "ScreenNumber", nullable = false, length = 10)
    private String screenNumber;

    @NotNull
    @Column(name = "TotalSeats", nullable = false)
    private Integer totalSeats;
}