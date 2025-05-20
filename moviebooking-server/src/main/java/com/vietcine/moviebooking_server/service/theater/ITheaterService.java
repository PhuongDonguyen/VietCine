package com.vietcine.moviebooking_server.service.theater;

import com.vietcine.moviebooking_server.dto.response.MovieWithShowtimesResponse;
import com.vietcine.moviebooking_server.dto.response.TheaterResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface ITheaterService {
    List<String> getAllCities();
    List<TheaterResponse> getRecommendedTheatersByCity(String city);
    List<TheaterResponse> getAllTheatersByCity(String city);
    List<TheaterResponse> getTheatersByBrandAndCity(Integer brandId, String city);
    List<Map<String, String>> getNextDays(int days);
    List<MovieWithShowtimesResponse> getMoviesWithShowtimesByTheater(Integer theaterId, String date);
}
