package com.vietcine.moviebooking_server.specification;

import com.vietcine.moviebooking_server.entity.Genre;
import com.vietcine.moviebooking_server.entity.Movie;
import com.vietcine.moviebooking_server.entity.Showtime;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.text.Normalizer;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;

public class MovieSpecification {
    public static Specification<Movie> titleContains(String title) {
        return (root, query, cb) -> {
            if (title == null || title.trim().isEmpty()) return null;
            return cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
        };
    }

    public static Specification<Movie> hasGenre(Integer genreId) {
        return (root, query, cb) -> {
            if (genreId == null) return null;
            Join<Movie, Genre> genres = root.join("genres");
            return cb.equal(genres.get("id"), genreId);
        };
    }

    public static Specification<Movie> hasShowDate(LocalDate showDate) {
        return (root, query, cb) -> {
            if (showDate == null) return null;

            // Join Movie -> Showtime
            Join<Movie, Showtime> showtimes = root.join("showtimes");

            // Convert showDate to start/end of day in UTC
            Instant startOfDay = showDate.atStartOfDay(ZoneOffset.UTC).toInstant();
            Instant endOfDay = showDate.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

            // Check if startTime falls within the UTC day boundaries
            return cb.and(
                    cb.greaterThanOrEqualTo(showtimes.get("startTime"), startOfDay),
                    cb.lessThan(showtimes.get("startTime"), endOfDay)
            );
        };
    }

    public static Specification<Movie> isAvailable(Boolean isAvailable) {
        return (root, query, cb) -> {
            if (isAvailable == null) return null;
            return cb.equal(root.get("isAvailable"), isAvailable);
        };
    }

//    public static Specification<Movie> titleContainsNoAccent(String title) {
//        return (root, query, cb) -> {
//            if (title == null || title.trim().isEmpty()) return null;
//            // Normalize title to remove accents and convert to lowercase
//            String normalizedTitle = Normalizer.normalize(title.toLowerCase(), Normalizer.Form.NFD)
//                    .replaceAll("\\p{M}", "");
//            // Use SQL function to remove accents from the title column
//            Expression<String> normalizedDbTitle = cb.function(
//                    "unaccent", String.class, cb.lower(root.get("title"))
//            );
//            return cb.like(normalizedDbTitle, "%" + normalizedTitle + "%");
//        };
//    }
}
