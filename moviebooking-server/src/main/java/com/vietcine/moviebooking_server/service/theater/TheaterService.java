package com.vietcine.moviebooking_server.service.theater;

import com.vietcine.moviebooking_server.dto.response.*;
import com.vietcine.moviebooking_server.entity.Theater;
import com.vietcine.moviebooking_server.mapper.TheaterMapper;
import com.vietcine.moviebooking_server.repository.ITheaterRepository;
import com.vietcine.moviebooking_server.service.movie.IMovieService;
// import com.vietcine.moviebooking_server.service.movie.MovieService; // Not used directly in this method
import com.vietcine.moviebooking_server.service.seat.ISeatService;
import com.vietcine.moviebooking_server.service.showtime.IShowtimeService;
// import com.vietcine.moviebooking_server.service.theater.ITheaterService; // Interface for this class
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.text.Normalizer;
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

    private static final ZoneId TARGET_TIMEZONE = ZoneId.of("Asia/Ho_Chi_Minh");

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
        LocalDate today = LocalDate.now(TARGET_TIMEZONE);
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
    public List<MovieWithShowtimesResponse> getMoviesWithShowtimesByTheater(Integer theaterId, String dateString) {
        if (theaterId == null || theaterId <= 0 || dateString == null || dateString.isBlank()) {
            return Collections.emptyList();
        }

        LocalDate parsedTargetDate;
        try {
            parsedTargetDate = LocalDate.parse(dateString);
        } catch (DateTimeParseException e) {
            // Invalid date format
            return Collections.emptyList();
        }

        ZonedDateTime nowInTargetZone = ZonedDateTime.now(TARGET_TIMEZONE);
        ZonedDateTime startOfTargetDayInZone = parsedTargetDate.atStartOfDay(TARGET_TIMEZONE);
        ZonedDateTime endOfTargetDayInZone = parsedTargetDate.plusDays(1).atStartOfDay(TARGET_TIMEZONE);

        ZonedDateTime effectiveFilterStartTimeInZone;
        if (parsedTargetDate.isEqual(nowInTargetZone.toLocalDate())) {
            // If querying for today, use the current time as the lower bound
            effectiveFilterStartTimeInZone = nowInTargetZone;
        } else if (parsedTargetDate.isBefore(nowInTargetZone.toLocalDate())) {
            // If querying for a past date, no showtimes will be available from "now" onwards.
            // To show all showtimes for a past day, set effective start to start of that day.
            // However, typically we don't show past showtimes unless for historical data.
            // For this logic, let's assume we want all showtimes of that past day.
            effectiveFilterStartTimeInZone = startOfTargetDayInZone;
        }
        else {
            // If querying for a future date, use the start of that day
            effectiveFilterStartTimeInZone = startOfTargetDayInZone;
        }


        List<MovieResponse> allMovies = movieService.getAllMovies();
        List<MovieWithShowtimesResponse> result = new ArrayList<>();

        for (MovieResponse movie : allMovies) {
            List<ShowtimeResponse> showtimes = showtimeService.getShowtimesByMovieId(movie.getId()).stream()
                    .filter(showtime -> showtime.getScreen().getTheater().getId().equals(theaterId))
                    .filter(showtime -> {
                        Instant showtimeInstantUtc = showtime.getStartTime(); // Showtime from DB is UTC
                        if (showtimeInstantUtc == null) {
                            return false;
                        }
                        ZonedDateTime showtimeInTargetZone = showtimeInstantUtc.atZone(TARGET_TIMEZONE);

                        // Showtime must be at or after the effective start time and before the end of the target day
                        return !showtimeInTargetZone.isBefore(effectiveFilterStartTimeInZone) &&
                                showtimeInTargetZone.isBefore(endOfTargetDayInZone);
                    })
                    .collect(Collectors.toList());

            if (!showtimes.isEmpty()) {
                MovieWithShowtimesResponse movieWithShowtimes = new MovieWithShowtimesResponse();
                movieWithShowtimes.setId(movie.getId());
                movieWithShowtimes.setTitle(movie.getTitle());
                movieWithShowtimes.setPosterUrl(movie.getPosterUrl());
                movieWithShowtimes.setRating(movie.getRating());
                movieWithShowtimes.setTrailerUrl(movie.getTrailerUrl());
                movieWithShowtimes.setDuration(movie.getDuration());
                movieWithShowtimes.setSlug(movie.getSlug());
                movieWithShowtimes.setGenres(new ArrayList<>(movie.getGenres()));
                movieWithShowtimes.setShowtimes(showtimes); // Showtimes are still in original DTO form (UTC Instant)
                for (ShowtimeResponse showtime : showtimes) {
                    List<SeatResponse> seats = seatService.getSeatsByShowtime(showtime.getId());
                    long availableSeats = seats.stream().filter(SeatResponse::isAvailable).count();
                    // int totalSeats = seats.size(); // totalSeats not used in ShowtimeResponse
                    showtime.setAvailableSeats(String.valueOf(availableSeats));
                }
                result.add(movieWithShowtimes);
            }
        }
        return result;
    }

    @Override
    public List<TheaterResponse> searchTheatersByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            System.out.println("Search name is null or empty, returning empty list");
            return Collections.emptyList();
        }

        String normalizedSearch = Normalizer.normalize(name.trim().toLowerCase(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("[đĐ]", "d");
        System.out.println("Normalized search name: " + normalizedSearch);

        List<Theater> theaters = theaterRepository.findAll();
        System.out.println("Total theaters fetched: " + theaters.size());

        List<TheaterResponse> result = theaters.stream()
                .filter(theater -> {
                    if (theater.getName() == null) {
                        System.out.println("Theater ID " + theater.getId() + " has null name");
                        return false;
                    }
                    String normalizedName = Normalizer.normalize(theater.getName().toLowerCase(), Normalizer.Form.NFD)
                            .replaceAll("\\p{M}", "")
                            .replaceAll("[đĐ]", "d");
                    boolean matches = normalizedName.contains(normalizedSearch);
                    System.out.println("Theater name: " + theater.getName() + ", Normalized: " + normalizedName + ", Matches: " + matches);
                    return matches;
                })
                .map(theaterMapper::toTheaterDTO)
                .collect(Collectors.toList());

        System.out.println("Theaters found: " + result.size());
        return result;
    }
}