import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Genre {
    id: string;
    name: string;
}

interface Movie {
    id: string;
    title: string;
    posterUrl: string;
    rating: string;
    genres: Genre[];
    slug: string;
}

interface PaginationData {
    page: number;
    totalPages: number;
    hasMore: boolean;
}

export default function AllAvailableMovie() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [recommendedMovies, setRecommendedMovies] = useState<{ [key: string]: Movie[] }>({});
    const [categories, setCategories] = useState<Genre[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationData>({
        page: 1,
        totalPages: 1,
        hasMore: false
    });

    // Fetch initial movies and categories
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                setError(null);
                await fetchMovies(1); // Start with page 1

                // Fetch categories/genres
                const categoriesResponse = await axios.get("http://localhost:8081/api/genres");
                setCategories(categoriesResponse.data.data || []);

                setLoading(false);
            } catch (err) {
                setError("Failed to fetch movies data");
                setLoading(false);
                console.error("Error fetching data:", err);
            }
        };

        fetchInitialData();
    }, []);

    // Fetch filtered movies when filters change
    useEffect(() => {
        const fetchFilteredMovies = async () => {
            try {
                setLoading(true);
                setError(null);
                await fetchMovies(1); // Reset to page 1 when filters change
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch filtered movies");
                setLoading(false);
                console.error("Error fetching filtered movies:", err);
            }
        };

        // Use a timeout to debounce the filter changes
        const timeoutId = setTimeout(() => {
            fetchFilteredMovies();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedCategory, selectedDate]);

    // Function to fetch movies with pagination
    const fetchMovies = async (page: number) => {
        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', '4'); // Number of movies per page

        if (searchQuery) {
            params.append('search', searchQuery);
        }

        if (selectedCategory !== "all") {
            params.append('genre', selectedCategory);
        }

        if (selectedDate) {
            params.append('date', selectedDate);
        }

        try {
            const response = await axios.get(`http://localhost:8081/api/movies?${params.toString()}`);

            // Updated to match the new response structure
            const { data } = response.data;
            console.log(data);
            const moviesList = data.data || [];
            const paginationData = data.pagination;

            if (page === 1) {
                // Replace the movies array if it's the first page
                setMovies(moviesList);
            } else {
                // Append to the existing movies array if loading more
                setMovies(prevMovies => [...prevMovies, ...moviesList]);
            }

            setPagination({
                page,
                totalPages: paginationData.totalPages || 1,
                hasMore: page < (paginationData.totalPages || 1)
            });

            // If this is the first page, also fetch recommended movies
            if (page === 1) {
                fetchRecommendedMovies();
            }

            return moviesList;
        } catch (err) {
            console.error("Error fetching movies:", err);
            throw err;
        }
    };

    // Function to fetch recommended movies by category
    const fetchRecommendedMovies = async () => {
        try {
            const response = await axios.get("http://localhost:8081/api/movies/recommended");
            const recommendedData = response.data.data.data || {};
            setRecommendedMovies(recommendedData);
        } catch (err) {
            console.error("Error fetching recommended movies:", err);
            // Don't set error state here, as it's not critical
        }
    };

    // Function to load more movies (next page)
    const handleLoadMore = async () => {
        if (!pagination.hasMore || loadingMore) return;

        try {
            setLoadingMore(true);
            const nextPage = pagination.page + 1;
            await fetchMovies(nextPage);
            setLoadingMore(false);
        } catch (err) {
            setError("Failed to load more movies");
            setLoadingMore(false);
            console.error("Error loading more movies:", err);
        }
    };

    // Movie Card Component
    const MovieCard = ({ movie }: { movie: Movie }) => (
        <div
            className="relative group cursor-pointer"
            onClick={() => navigate(`/movies/${movie.slug}`)}
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
                <h3 className="text-lg font-semibold text-white group-hover:text-red-500 transition duration-300">
                    {movie.title}
                </h3>
                <div className="flex flex-wrap mt-1">
                    {movie.genres.map((genre, index) => (
                        <span key={index} className="text-xs text-gray-400 mr-2">
                            {genre.name}{index < movie.genres.length - 1 ? ", " : ""}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div
            className="bg-black text-white min-h-screen"
            style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2970&q=80)`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
            }}
        >
            {/* Navbar */}
            <NavBar transparent={false} fixedTop={true} />

            {/* Main content with padding to account for fixed navbar */}
            <div className="relative min-h-screen w-full pt-20">
                {/* Overlay to improve text readability */}
                <div className="absolute inset-0 bg-black/80 z-0"></div>

                {/* Part 1: Available Movies with Filters */}
                <section className="py-12 relative z-10">
                    <div className="container mx-auto px-4">
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold text-white mb-8">
                                <span className="border-b-2 border-red-600 pb-1">Phim đang chiếu</span>
                            </h2>

                            {/* Filters */}
                            <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Search Bar */}
                                    <div>
                                        <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-2">
                                            Tìm Kiếm
                                        </label>
                                        <input
                                            type="text"
                                            id="search"
                                            placeholder="Nhập tên phim..."
                                            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    {/* Date Filter */}
                                    <div>
                                        <label htmlFor="date" className="block text-sm font-medium text-gray-400 mb-2">
                                            Ngày Xem
                                        </label>
                                        <input
                                            type="date"
                                            id="date"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                            value={selectedDate}
                                            onChange={e => setSelectedDate(e.target.value)}
                                            min={new Date().toISOString().split("T")[0]} 
                                        />
                                    </div>

                                    {/* Category Filter */}
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-2">
                                            Thể Loại
                                        </label>
                                        <select
                                            id="category"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                            value={selectedCategory}
                                            onChange={e => setSelectedCategory(e.target.value)}
                                        >
                                            <option value="all">Tất cả thể loại</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Movies Grid */}
                            {loading ? (
                                <div className="flex flex-col justify-center items-center h-64">
                                    <div className="flex space-x-2 mb-2">
                                        <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                                    </div>
                                    <div className="text-white">Đang tải danh sách phim...</div>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="text-red-500">{error}</div>
                                </div>
                            ) : movies.length === 0 ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="text-gray-400">Không tìm thấy phim phù hợp với tiêu chí tìm kiếm</div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {movies.map(movie => (
                                            <MovieCard key={movie.id} movie={movie} />
                                        ))}
                                    </div>

                                    {/* Load More / Pagination Controls */}
                                    {pagination.hasMore && (
                                        <div className="mt-10 text-center">
                                            <button
                                                onClick={handleLoadMore}
                                                disabled={loadingMore}
                                                className={`px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-300 ${loadingMore ? 'opacity-70 cursor-not-allowed' : ''
                                                    }`}
                                            >
                                                {loadingMore ? 'Đang tải...' : 'Xem Thêm'}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Part 2: Recommended Movies by Category */}
                <section className="py-12 relative z-10">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-white mb-12">
                            <span className="border-b-2 border-red-600 pb-1">Các phim bạn có thể thích</span>
                        </h2>

                        {Object.keys(recommendedMovies).length === 0 ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="text-gray-400">Đang tải gợi ý phim...</div>
                            </div>
                        ) : (
                            <>
                                {Object.entries(recommendedMovies).map(([category, categoryMovies], index) => (
                                    <div key={index} className="mb-16">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-2xl font-semibold text-white">{category}</h3>
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory(categories.find(c => c.name === category)?.id || "all");
                                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                                }}
                                                className="text-red-600 hover:text-red-500 transition duration-300"
                                            >
                                                Xem tất cả →
                                            </button>
                                        </div>

                                        {/* First row of movies */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                            {categoryMovies.slice(0, 4).map(movie => (
                                                <MovieCard key={movie.id} movie={movie} />
                                            ))}
                                        </div>

                                        {/* Second row of movies if there are more than 4 */}
                                        {categoryMovies.length > 4 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                                {categoryMovies.slice(4, 8).map(movie => (
                                                    <MovieCard key={movie.id} movie={movie} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}