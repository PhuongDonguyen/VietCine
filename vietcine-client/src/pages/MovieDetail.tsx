import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Star, Clock, Calendar, MapPin } from "lucide-react";

// Import utility components that we'll create
import { MovieShowtimes } from "../components/MovieShowtimes";
import { CastMembers } from "../components/CastMembers";

// Define interfaces for our data models
interface Movie {
    id: string;
    title: string;
    originalTitle?: string;
    poster: string;
    backdrop: string;
    rating: string;
    categories: string[];
    duration: string;
    releaseDate: string;
    synopsis: string;
    director: string;
    cast: CastMember[];
    trailerUrl: string;
}

interface CastMember {
    name: string;
    character: string;
    photo: string;
}

export default function MovieDetail() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id') || "1";
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"showtimes" | "details">("showtimes");
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // This would be fetched from an API in a real application
    useEffect(() => {
        // Simulating API call delay
        const timer = setTimeout(() => {
            // Mock data for the selected movie
            const movieData: Movie = {
                id: id || "1",
                title: "Lật Mặt 7: Một Điều Ước",
                originalTitle: "Face Off 7: One Wish",
                poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2525&q=80",
                backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
                rating: "9.2",
                categories: ["Hành Động", "Hài"],
                duration: "128 phút",
                releaseDate: "26/04/2023",
                synopsis: "Lật Mặt 7: Một Điều Ước là câu chuyện kể về Hiếu - một người cha nghèo, một mình nuôi con gái sau khi vợ mất. Để kiếm tiền chữa bệnh cho con, anh vô tình trở thành một người mạo hiểm. Cuộc sống của Hiếu bắt đầu gặp nhiều rắc rối khi anh biết được một bí mật động trời - thứ có thể đảo lộn cả đời anh. Liệu ước mơ của Hiếu có thành hiện thực, khi mà giữa thực tại và mong muốn là cả một khoảng cách rất lớn, rất xa...",
                director: "Lý Hải",
                cast: [
                    { name: "Lý Hải", character: "Hiếu", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
                    { name: "Quốc Cường", character: "Tú", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
                    { name: "Minh Thảo", character: "Linh", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=922&q=80" },
                    { name: "Thanh Thức", character: "Phong", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
                    { name: "Huỳnh Thi", character: "Bé Na", photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80" }
                ],
                trailerUrl: "https://www.youtube.com/embed/kBY2k3G6LsM"
            };

            setMovie(movieData);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                <NavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                <NavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Phim không tồn tại</h2>
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

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <NavBar />

            {/* Hero section with backdrop */}
            <div className="relative">
                {/* Backdrop with overlay */}
                <div className="relative h-[60vh] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20 z-10"></div>
                    <img
                        src={movie.backdrop}
                        alt={movie.title}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                </div>

                {/* Movie details on top of backdrop */}
                <div className="container mx-auto px-4 relative z-20 -mt-40 flex flex-col md:flex-row gap-8">
                    {/* Movie poster */}
                    <div className="w-64 mx-auto md:mx-0 flex-shrink-0">
                        <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-2xl border-2 border-gray-800">
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Movie info */}
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
                        {movie.originalTitle && (
                            <h2 className="text-xl text-gray-400 mb-4">{movie.originalTitle}</h2>
                        )}

                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="flex items-center">
                                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                                <span>{movie.rating}/10</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-5 w-5 text-gray-400 mr-1" />
                                <span>{movie.duration}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-gray-400 mr-1" />
                                <span>Khởi chiếu: {movie.releaseDate}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {movie.categories.map((category, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-800 text-white text-sm rounded-full"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">Nội dung phim</h3>
                            <p className="text-gray-300">{movie.synopsis}</p>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 flex items-center space-x-2"
                                onClick={() => setActiveTab("showtimes")}
                            >
                                <MapPin className="h-5 w-5" />
                                <span>Mua vé</span>
                            </button>
                            <button
                                className="px-6 py-3 border border-white text-white rounded-md hover:bg-white hover:text-black transition duration-300"
                                onClick={() => window.open(movie.trailerUrl.replace('/embed/', '/watch?v='), '_blank')}
                            >
                                Xem trailer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation tabs */}
            <div className="container mx-auto px-4 mt-12">
                <div className="border-b border-gray-800 flex">
                    <button
                        className={`py-4 px-6 font-medium text-lg transition-colors duration-300 relative ${activeTab === 'showtimes' ? 'text-red-600' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab("showtimes")}
                    >
                        Lịch chiếu
                        {activeTab === 'showtimes' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></div>
                        )}
                    </button>
                    <button
                        className={`py-4 px-6 font-medium text-lg transition-colors duration-300 relative ${activeTab === 'details' ? 'text-red-600' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab("details")}
                    >
                        Chi tiết phim
                        {activeTab === 'details' && (
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
                            <p className="text-gray-300">{movie.director}</p>
                        </div>

                        {/* Cast */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Diễn viên</h3>
                            <CastMembers cast={movie.cast} />
                        </div>

                        {/* Trailer */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Trailer</h3>
                            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full"
                                    src={movie.trailerUrl}
                                    title={`${movie.title} Trailer`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
