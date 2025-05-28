package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IBookingSeatRepository extends JpaRepository<BookingSeat, Long> {
}
