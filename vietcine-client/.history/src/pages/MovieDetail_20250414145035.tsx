import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Star, Clock, Calendar, MapPin } from "lucide-react";
import axios from "axios";
import { MovieShowtimes } from "../components/MovieShowtimes";
import { CastMembers } from "../components/CastMembers";

// Interfaces aligned with backend response
interface Movie {
    id: number;
    title: string;
    englishTitle?: string;
    posterUrl?: string;
    rating?: number;
    genres: Genre[];
    duration: number;
    releaseDate: string;
    description: string;
    director: Director;
    trailerUrl?: string;
    slug: string;
    isAvailable: boolean;
}

interface Genre {
    id: number;
    name: string;
}

interface Director {
    id: number;
    name: string;
    avatar?: string;
}

interface CastMember {
    castId: number;
    actorName: string;
    characterName: string;
    avatar?: string;
}

export default function MovieDetail() {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug?: string }>();
    const [activeTab, setActiveTab] = useState<"showtimes" | "details">("showtimes");
    const [movie, setMovie] = useState<Movie | null>(null);
    const [cast, setCast] = useState<CastMember[] | null>(null);
    const [loadingMovie, setLoadingMovie] = useState<boolean>(true);
    const [loadingCast, setLoadingCast] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch movie details
    useEffect(() => {
        console.log({ slug });
        const fetchMovieDetails = async () => {
            if (!slug) {
                setError("Invalid or missing movie slug");
                setLoadingMovie(false);
                return;
            }

            try {
                setLoadingMovie(true);
                setError(null);
                const response = await axios.get(`http://localhost:8081/api/movies/${slug}`);
                if (response.data.success) {
                    setMovie(response.data.data.data);
                } else {
                    setError("Could not load movie details");
                }
            } catch (err) {
                setError("Failed to fetch movie details. Please try again later.");
                console.error("Error fetching movie:", err);
            } finally {
                setLoadingMovie(false);
            }
        };

        fetchMovieDetails();
    }, [slug]); // Add slug to dependency array

    // Fetch cast when movie ID is available
    useEffect(() => {
        const fetchCast = async () => {
            if (!movie?.id) return;

            try {
                setLoadingCast(true);
                const response = await axios.get(`http://localhost:8081/api/movies/${movie.id}/cast`);
                if (response.data.success) {
                    setCast(response.data.data);
                } else {
                    console.warn("Could not load cast details");
                }
            } catch (err) {
                console.error("Error fetching cast:", err);
            } finally {
                setLoadingCast(false);
            }
        };

        fetchCast();
    }, [movie?.id]);

    // Loading state for movie details
    if (loadingMovie) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                <NavBar transparent={false} fixedTop={true} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                </div>
            </div>
        );
    }

    // Error or no movie state
    if (error || !movie) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                <NavBar transparent={false} fixedTop={true} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">{error || "Phim không tồn tại"}</h2>
                        <button
                            onClick={() => navigate("/")}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                        >
                            Quay lại trang chủ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Format duration to "X phút"
    const formattedDuration = `${movie.duration} phút`;

    // Format release date safely
    const formattedReleaseDate = movie.releaseDate
        ? new Date(movie.releaseDate).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
        : "N/A";

    // Parse trailer URL for YouTube embed
    const getYouTubeEmbedUrl = (url?: string): string => {
        if (!url) return "";
        if (url.includes("youtube.com/embed")) return url;
        const videoIdMatch = url.match(/(?:v=|youtu\.be\/)([^&\n?]+)/);
        return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : "";
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <NavBar transparent={true} fixedTop={false} />

            {/* Hero section with backdrop */}
            <div className="relative">
                <div className="relative h-[60vh] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/40 z-10"></div>
                    <img
                        src={movie.posterUrl || "/default-backdrop.jpg"}
                        alt={movie.title}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                </div>

                {/* Movie details on top of backdrop */}
                <div className="container mx-auto px-4 relative z-20 -mt-40 flex flex-col md:flex-row gap-8">
                    <div className="w-64 mx-auto md:mx-0 flex-shrink-0">
                        <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-2xl border-2 border-gray-800">
                            <img
                                src={movie.posterUrl || "/default-poster.jpg"}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
                        {movie.englishTitle && (
                            <h2 className="text-xl text-gray-400 mb-4">{movie.englishTitle}</h2>
                        )}

                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            {movie.rating !== undefined && (
                                <div className="flex items-center">
                                    <Star className="h-5 w-5 text-yellow-500 mr-1" />
                                    <span>{movie.rating.toFixed(1)}/10</span>
                                </div>
                            )}
                            <div className="flex items-center">
                                <Clock className="h-5 w-5 text-gray-400 mr-1" />
                                <span>{formattedDuration}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-gray-400 mr-1" />
                                <span>Khởi chiếu: {formattedReleaseDate}</span>
                            </div>
                            <div className="flex items-center">
                                <span>Trạng thái: {movie.isAvailable ? "Đang chiếu" : "Ngừng chiếu"}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {movie.genres.map((genre) => (
                                <span
                                    key={genre.id}
                                    className="px-3 py-1 bg-gray-800 text-white text-sm rounded-full"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">Nội dung phim</h3>
                            <p className="text-gray-300">{movie.description || "Không có mô tả."}</p>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 flex items-center space-x-2"
                                onClick={() => setActiveTab("showtimes")}
                            >
                                <MapPin className="h-5 w-5" />
                                <span>Mua vé</span>
                            </button>
                            {movie.trailerUrl && (
                                <button
                                    className="px-6 py-3 border border-white text-white rounded-md hover:bg-white hover:text-black transition duration-300"
                                    onClick={() => window.open(movie.trailerUrl, "_blank")}
                                >
                                    Xem trailer
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation tabs */}
            <div className="container mx-auto px-4 mt-12">
                <div className="border-b border-gray-800 flex">
                    <button
                        className={`py-4 px-6 font-medium text-lg transition-colors duration-300 relative ${activeTab === "showtimes" ? "text-red-600" : "text-gray-400 hover:text-white"
                            }`}
                        onClick={() => setActiveTab("showtimes")}
                    >
                        Lịch chiếu
                        {activeTab === "showtimes" && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></div>
                        )}
                    </button>
                    <button
                        className={`py-4 px-6 font-medium text-lg transition-colors duration-300 relative ${activeTab === "details" ? "text-red-600" : "text-gray-400 hover:text-white"
                            }`}
                        onClick={() => setActiveTab("details")}
                    >
                        Chi tiết phim
                        {activeTab === "details" && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></div>
                        )}
                    </button>
                </div>
            </div>

            {/* Tab content */}
            <div className="container mx-auto px-4 py-8">
                {activeTab === "showtimes" ? (
                    <MovieShowtimes movieId={movie.id} movieTitle={movie.title} />
                ) : (
                    <div className="space-y-8">
                        {/* Director */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Đạo diễn</h3>
                            <div className="flex items-center space-x-4">
                                {movie.director.avatar && (
                                    <img
                                        src={movie.director.avatar}
                                        alt={movie.director.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                )}
                                <p className="text-gray-300">{movie.director.name || "N/A"}</p>
                            </div>
                        </div>

                        {/* Cast */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Diễn viên</h3>
                            {loadingCast ? (
                                <div className="flex items-center justify-center">
                                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
                                </div>
                            ) : cast ? (
                                <CastMembers cast={cast} />
                            ) : (
                                <p className="text-gray-400">Không có thông tin diễn viên.</p>
                            )}
                        </div>

                        {/* Trailer */}
                        {movie.trailerUrl && (
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Trailer</h3>
                                <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full"
                                        src={getYouTubeEmbedUrl(movie.trailerUrl)}
                                        title={`${movie.title} Trailer`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}