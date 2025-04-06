package com.vietcine.moviebooking_server.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@ToString
@Embeddable
public class MovieCastId implements Serializable {
    private static final long serialVersionUID = -6132073027074367683L;
}