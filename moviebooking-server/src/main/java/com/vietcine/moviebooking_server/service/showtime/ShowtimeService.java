package com.vietcine.moviebooking_server.service.showtime;

import com.vietcine.moviebooking_server.dto.response.ShowtimeResponse;
import com.vietcine.moviebooking_server.entity.Showtime;
import com.vietcine.moviebooking_server.mapper.ShowtimeMapper;
import com.vietcine.moviebooking_server.repository.IShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShowtimeService implements IShowtimeService{

    private final IShowtimeRepository showtimeRepository;
    private final ShowtimeMapper showtimeMapper;

    @Autowired
    public ShowtimeService(IShowtimeRepository showtimeRepository, ShowtimeMapper showtimeMapper) {
        this.showtimeRepository = showtimeRepository;
        this.showtimeMapper = showtimeMapper;
    }

    @Override
    public List<ShowtimeResponse> getShowtimesByMovieId(Integer movieId) {
        List<Showtime> showtimes = showtimeRepository.findByMovieId(movieId);
        return showtimes.stream()
                .map(showtimeMapper::toShowtimeDTO)
                .collect(Collectors.toList());
    }

    public ShowtimeResponse getShowtimeById(Integer showtimeId) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
        return showtimeMapper.toShowtimeDTO(showtime);
    }
}