package com.vietcine.moviebooking_server.service.movie;

import com.vietcine.moviebooking_server.dto.response.MovieDetailResponse;
import com.vietcine.moviebooking_server.dto.response.MovieResponse;
import com.vietcine.moviebooking_server.entity.Movie;
import com.vietcine.moviebooking_server.mapper.MovieMapper;
import com.vietcine.moviebooking_server.repository.IMovieRepository;
import com.vietcine.moviebooking_server.specification.MovieSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class MovieService implements IMovieService {
    private final IMovieRepository movieRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private MovieMapper movieMapper;

    public MovieService(IMovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public List<MovieResponse> getAllMovies() {
        List<Movie> movies = movieRepository.findByIsAvailableTrueAndReleaseDateLessThanEqual(LocalDate.now());
        return movies.stream()
                .map(movieMapper::toMovieDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getAvailableMovies(Pageable pageable, String search, Integer genreId, LocalDate showDate) {
        Specification<Movie> spec = Specification
                .where(MovieSpecification.titleContains(search))
                .and(MovieSpecification.hasGenre(genreId))
                .and(MovieSpecification.hasShowDate(showDate))
                .and(MovieSpecification.isAvailable(true));

        // Fetch paginated result
        Page<Movie> moviePage = movieRepository.findAll(spec, pageable);

        // Convert to DTOs
        List<MovieResponse> movieResponses = moviePage.getContent().stream()
                .map(movieMapper::toMovieDTO)
                .collect(Collectors.toList());

        // Wrap in result map
        Map<String, Object> result = new HashMap<>();
        result.put("content", movieResponses);

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("currentPage", moviePage.getNumber());
        pagination.put("totalPages", moviePage.getTotalPages());
        pagination.put("totalElements", moviePage.getTotalElements());
        pagination.put("pageSize", moviePage.getSize());

        result.put("pagination", pagination);

        return result;
    }

    @Override
    public Map<String, List<MovieResponse>> getRecommendedMoviesByCategory() {
        // Get all available movies
        List<Movie> availableMovies = movieRepository.findByIsAvailable(true);

        // Group movies by genre
        Map<String, List<MovieResponse>> recommendedByGenre = new HashMap<>();

        availableMovies.forEach(movie -> {
            movie.getGenres().forEach(genre -> {
                String genreName = genre.getName();

                // Initialize list if not present
                recommendedByGenre.putIfAbsent(genreName, new ArrayList<>());

                // Add movie to genre list if not already present
                List<MovieResponse> moviesInGenre = recommendedByGenre.get(genreName);
                MovieResponse movieResponse = movieMapper.toMovieDTO(movie);

                // Only add if not already there and limit to 8 movies per genre
                if (moviesInGenre.size() < 8 &&
                        !moviesInGenre.stream().anyMatch(m -> m.getId().equals(movieResponse.getId()))) {
                    moviesInGenre.add(movieResponse);
                }
            });
        });

        return recommendedByGenre;
    }

    @Override
    public MovieDetailResponse getMovieDetailBySlug(String slug) {
        Movie movie = movieRepository.findBySlugWithAllRelationships(slug)
                .orElseThrow(() -> new RuntimeException("Movie not found with slug: " + slug));

        MovieDetailResponse movieResponse = movieMapper.toMovieDetailDTO(movie);
        return movieResponse;
    }

    @Override
    public MovieResponse getMovieDetailById(Integer id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));

        return movieMapper.toMovieDTO(movie);
    }
}