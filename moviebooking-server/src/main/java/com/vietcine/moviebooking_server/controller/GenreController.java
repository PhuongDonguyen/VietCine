package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.response.ApiResponse;
import com.vietcine.moviebooking_server.dto.response.GenreResponse;
import com.vietcine.moviebooking_server.service.genre.GenreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
@Tag(name = "Genres", description = "APIs for managing movie genres")
public class GenreController {

    @Autowired
    private GenreService genreService;

    @GetMapping
    @Operation(summary = "Get all genres", description = "Retrieves a list of all movie genres")
    public ResponseEntity<ApiResponse> getAllGenres() {
        List<GenreResponse> genres = genreService.getAllGenres();
        return ResponseEntity.ok(new ApiResponse("Success", true, genres));
    }
}