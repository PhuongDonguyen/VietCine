package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IGenreRepository extends JpaRepository<Genre, Integer> {
}
