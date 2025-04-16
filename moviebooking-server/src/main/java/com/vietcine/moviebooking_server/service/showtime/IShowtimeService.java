package com.vietcine.moviebooking_server.service.showtime;

import com.vietcine.moviebooking_server.dto.response.ShowtimeResponse;

import java.util.List;

public interface IShowtimeService {
    List<ShowtimeResponse> getShowtimesByMovieId(Integer movieId);
}
