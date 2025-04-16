package com.vietcine.moviebooking_server.service.movie;

import com.vietcine.moviebooking_server.dto.response.MovieDetailResponse;
import com.vietcine.moviebooking_server.dto.response.MovieResponse;
import com.vietcine.moviebooking_server.entity.Movie;
import com.vietcine.moviebooking_server.mapper.MovieMapper;
import com.vietcine.moviebooking_server.repository.IMovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Join;

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
        List<Movie> movies = movieRepository.findAll();
        return movies.stream()
                .map(movieMapper::toMovieDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getAllMovies(Pageable pageable, String search, String genreId, LocalDate showDate) {
        try {
            // Use manual criteria query for better control over distinct results
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            CriteriaQuery<Movie> query = cb.createQuery(Movie.class);
            Root<Movie> movieRoot = query.from(Movie.class);

            List<Predicate> predicates = new ArrayList<>();

            // Add title search filter if provided
            if (search != null && !search.isEmpty()) {
                predicates.add(
                        cb.like(cb.lower(movieRoot.get("title")), "%" + search.toLowerCase() + "%")
                );
            }

            // Add genre filter if provided
            if (genreId != null && !genreId.isEmpty() && !genreId.equals("all")) {
                Join<Object, Object> genreJoin = movieRoot.join("genres");
                predicates.add(cb.equal(genreJoin.get("id"), genreId));
            }

            // Add date filter if provided
            if (showDate != null) {
                // Convert LocalDate to Instant range for that day (start of day to end of day)
                Instant startOfDay = showDate.atStartOfDay().toInstant(ZoneOffset.UTC);
                Instant endOfDay = showDate.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);

                Join<Object, Object> showtimeJoin = movieRoot.join("showtimes");
                predicates.add(
                        cb.and(
                                cb.greaterThanOrEqualTo(showtimeJoin.get("startTime"), startOfDay),
                                cb.lessThan(showtimeJoin.get("startTime"), endOfDay)
                        )
                );
            }

            // Apply all predicates
            if (!predicates.isEmpty()) {
                query.where(predicates.toArray(new Predicate[0]));
            }

            // Ensure distinct results
            query.select(movieRoot).distinct(true);

            // Execute query
            List<Movie> movies = entityManager.createQuery(query).getResultList();

            // Manual pagination
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), movies.size());

            // If start index is out of bounds, return empty list
            List<Movie> pageContent = start >= movies.size() ? Collections.emptyList()
                    : movies.subList(start, end);

            // Convert to DTOs
            List<MovieResponse> movieResponses = pageContent.stream()
                    .map(movieMapper::toMovieDTO)
                    .collect(Collectors.toList());

            // Create page object
            Page<Movie> moviePage = new PageImpl<>(pageContent, pageable, movies.size());

            // Create response with data and pagination info
            Map<String, Object> result = new HashMap<>();
            result.put("content", movieResponses);
            result.put("totalElements", moviePage.getTotalElements());
            result.put("totalPages", moviePage.getTotalPages());

            return result;
        } catch (Exception e) {
            // Log exception
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<MovieResponse> getAvailableMovies() {
        List<Movie> movies = movieRepository.findByIsAvailable(true);
        return movies.stream()
                .map(movieMapper::toMovieDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getAvailableMovies(Pageable pageable) {
        Page<Movie> moviePage = movieRepository.findByIsAvailable(true, pageable);

        List<MovieResponse> movieResponses = moviePage.getContent().stream()
                .map(movieMapper::toMovieDTO)
                .collect(Collectors.toList());

        // Create response with data and pagination info
        Map<String, Object> result = new HashMap<>();
        result.put("content", movieResponses);
        result.put("totalElements", moviePage.getTotalElements());
        result.put("totalPages", moviePage.getTotalPages());

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

    public MovieResponse getMovieDetailById(Integer id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));

        return movieMapper.toMovieDTO(movie);
    }
}