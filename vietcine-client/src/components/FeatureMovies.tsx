import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

interface Genre {
    id: string,
    name: string
}

interface Movie {
    id: string;
    title: string;
    posterUrl: string;
    rating: string;
    genres: Genre[];
}

export function FeaturedMovies() {
    const navigate = useNavigate();
    const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeaturedMovies = async () => {
            try {
                const response = await axios.get("http://localhost:8081/api/movies/available");
                setFeaturedMovies(response.data.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch featured movies");
                setLoading(false);
                console.error("Error fetching featured movies:", err);
            }
        };

        fetchFeaturedMovies();
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-black">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-white">Loading featured movies...</div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 bg-black">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-red-500">{error}</div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-black">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white">
                        <span className="border-b-2 border-red-600 pb-1">Phim Đang Chiếu</span>
                    </h2>
                    <button
                        onClick={() => navigate("/movies")}
                        className="text-red-600 hover:text-red-500 transition duration-300">
                        Xem tất cả &rarr;
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {featuredMovies.map((movie) => (
                        <div
                            key={movie.id}
                            className="relative group cursor-pointer"
                            onClick={() => navigate(`/movie-detail?id=${movie.id}`)}
                        >
                            <div className="aspect-[2/3] overflow-hidden rounded-lg">
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute top-2 right-2 bg-red-600 text-white text-sm font-semibold py-1 px-2 rounded">
                                {movie.rating}
                            </div>
                            <div className="mt-2">
                                <h3 className="text-lg font-semibold text-white group-hover:text-red-500 transition duration-300">{movie.title}</h3>
                                <div className="flex flex-wrap mt-1">
                                    {movie.genres.map((genre, index) => (
                                        <span key={index} className="text-xs text-gray-400 mr-2">{index != 0 ? genre.name.toLowerCase(): genre.name} {index == 0 && ', '}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}