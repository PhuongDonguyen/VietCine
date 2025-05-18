package com.vietcine.moviebooking_server.service.theater;

import com.vietcine.moviebooking_server.dto.response.*;
import com.vietcine.moviebooking_server.entity.Theater;
import com.vietcine.moviebooking_server.mapper.TheaterMapper;
import com.vietcine.moviebooking_server.repository.ITheaterRepository;
import com.vietcine.moviebooking_server.service.movie.IMovieService;
import com.vietcine.moviebooking_server.service.movie.MovieService;
import com.vietcine.moviebooking_server.service.seat.ISeatService;
import com.vietcine.moviebooking_server.service.showtime.IShowtimeService;
import com.vietcine.moviebooking_server.service.theater.ITheaterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.*;
import java.time.format.DateTimeParseException;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TheaterService implements ITheaterService {

    @Autowired
    private ITheaterRepository theaterRepository;

    @Autowired
    private TheaterMapper theaterMapper;

    @Autowired
    private IMovieService movieService;

    @Autowired
    private IShowtimeService showtimeService;

    @Autowired
    private ISeatService seatService;

    @Override
    public List<String> getAllCities() {
        return theaterRepository.findAllCities();
    }

    @Override
    public List<TheaterResponse> getRecommendedTheatersByCity(String city) {
        return theaterRepository.findRecommendedTheatersByCity(city).stream()
                .map(theaterMapper::toTheaterDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TheaterResponse> getTheatersByBrandAndCity(Integer brandId, String city) {
        return theaterRepository.findByTheaterBrandIdAndCity(brandId, city).stream()
                .map(theaterMapper::toTheaterDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TheaterResponse> getAllTheatersByCity(String city) {
        return theaterRepository.findAllTheatersByCity(city).stream()
                .map(theaterMapper::toTheaterDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, String>> getNextDays(int days) {
        if (days <= 0 || days > 30) {
            return Collections.emptyList();
        }

        List<Map<String, String>> daysList = new ArrayList<>();
        LocalDate today = LocalDate.now();
        Locale vietnameseLocale = new Locale("vi", "VN");

        for (int i = 0; i < days; i++) {
            LocalDate date = today.plusDays(i);
            Map<String, String> dayInfo = new HashMap<>();
            dayInfo.put("day", String.valueOf(date.getDayOfMonth()));
            dayInfo.put("label", i == 0 ? "Hôm nay" : date.getDayOfWeek().getDisplayName(TextStyle.FULL, vietnameseLocale));
            daysList.add(dayInfo);
        }

        return daysList;
    }

    @Override
    public List<MovieWithShowtimesResponse> getMoviesWithShowtimesByTheater(Integer theaterId, String date) {
        if (theaterId == null || theaterId <= 0 || date == null || date.isBlank()) {
            return Collections.emptyList();
        }

        Instant now = Instant.now().plusSeconds(7 * 3600);
        LocalDate today = LocalDate.ofInstant(now, ZoneOffset.UTC);

        LocalDate targetDate;
        try {
            targetDate = LocalDate.parse(date);
        } catch (DateTimeParseException e) {
            return Collections.emptyList();
        }

        Instant startOfDay = targetDate.atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant endOfDay = targetDate.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);

        Instant cutoffTime = targetDate.equals(today) ? now : startOfDay;

        List<MovieResponse> allMovie = movieService.getAllMovies();
        List<MovieWithShowtimesResponse> result = new ArrayList<>();

        for (MovieResponse movie : allMovie) {
            List<ShowtimeResponse> showtimes = showtimeService.getShowtimesByMovieId(movie.getId()).stream()
                    .filter(showtime -> showtime.getScreen().getTheater().getId().equals(theaterId))
                    .filter(showtime -> {
                        Instant showtimeStart = showtime.getStartTime();
                        return !showtimeStart.isBefore(cutoffTime) && showtimeStart.isBefore(endOfDay);
                    })
                    .collect(Collectors.toList());

            if (!showtimes.isEmpty()) {
                MovieWithShowtimesResponse movieWithShowtimes = new MovieWithShowtimesResponse();
                movieWithShowtimes.setId(movie.getId());
                movieWithShowtimes.setTitle(movie.getTitle());
                movieWithShowtimes.setPosterUrl(movie.getPosterUrl());
                movieWithShowtimes.setRating(movie.getRating());
                movieWithShowtimes.setDuration(movie.getDuration());
                movieWithShowtimes.setGenres(new ArrayList<>(movie.getGenres()));
                movieWithShowtimes.setShowtimes(showtimes);
                for (ShowtimeResponse showtime : showtimes) {
                    List<SeatResponse> seats = seatService.getSeatsByShowtime(showtime.getId());
                    long availableSeats = seats.stream().filter(SeatResponse::isAvailable).count(); // Sửa getIsAVailable thành getIsAvailable
                    int totalSeats = seats.size();
                    showtime.setAvailableSeats(String.valueOf(availableSeats));
                }
                result.add(movieWithShowtimes);
            }
        }

        return result;
    }
}
