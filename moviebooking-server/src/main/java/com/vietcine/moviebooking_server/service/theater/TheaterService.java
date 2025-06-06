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

        // Lấy thời gian hiện tại và chuyển sang UTC+7
        Instant now = Instant.now().plusSeconds(7 * 3600); // Chuyển sang UTC+7
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh")); // Lấy ngày theo UTC+7

        LocalDate targetDate;
        try {
            targetDate = LocalDate.parse(date);
        } catch (DateTimeParseException e) {
            return Collections.emptyList();
        }

        // Xác định khoảng thời gian của ngày cần tìm (theo UTC, vì DB dùng UTC)
        Instant startOfDay = targetDate.atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant endOfDay = targetDate.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);

        // Nếu ngày trùng với hôm nay, dùng thời gian hiện tại (now đã là UTC+7), nếu không thì dùng đầu ngày
        Instant cutoffTime = targetDate.equals(today) ? now : startOfDay;

        List<MovieResponse> allMovie = movieService.getAllMovies();
        List<MovieWithShowtimesResponse> result = new ArrayList<>();

        for (MovieResponse movie : allMovie) {
            List<ShowtimeResponse> showtimes = showtimeService.getShowtimesByMovieId(movie.getId()).stream()
                    .filter(showtime -> showtime.getScreen().getTheater().getId().equals(theaterId))
                    .filter(showtime -> {
                        Instant showtimeStart = showtime.getStartTime(); // Thời gian từ DB (UTC)
                        // Chuyển showtimeStart sang UTC+7 để so sánh
                        Instant showtimeStartInUTC7 = showtimeStart.plusSeconds(7 * 3600);
                        return !showtimeStartInUTC7.isBefore(cutoffTime) && showtimeStart.isBefore(endOfDay);
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
                movieWithShowtimes.setShowtimes(showtimes); // showtimes giữ nguyên giá trị từ DB (UTC)
                for (ShowtimeResponse showtime : showtimes) {
                    List<SeatResponse> seats = seatService.getSeatsByShowtime(showtime.getId());
                    long availableSeats = seats.stream().filter(SeatResponse::isAvailable).count();
                    int totalSeats = seats.size();
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

        // Normalize search name to remove accents, convert to lowercase, and replace 'đ' with 'd'
        String normalizedSearch = Normalizer.normalize(name.trim().toLowerCase(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("[đĐ]", "d");
        System.out.println("Normalized search name: " + normalizedSearch);

        // Fetch all theaters
        List<Theater> theaters = theaterRepository.findAll();
        System.out.println("Total theaters fetched: " + theaters.size());

        // Filter theaters in Java
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
