import { useNavigate } from "react-router-dom";

interface Movie {
    id: string;
    title: string;
    poster: string;
    rating: string;
    categories: string[];
}

export function FeaturedMovies() {
    const navigate = useNavigate();

    // Mock data for featured movies
    const featuredMovies: Movie[] = [
        {
            id: "1",
            title: "Lật Mặt 7: Một Điều Ước",
            poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2525&q=80",
            rating: "9.2",
            categories: ["Hành Động", "Hài"]
        },
        {
            id: "2",
            title: "Mai",
            poster: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80",
            rating: "8.7",
            categories: ["Tình Cảm", "Tâm Lý"]
        },
        {
            id: "3",
            title: "Gặp Lại Chị Bầu",
            poster: "https://images.unsplash.com/photo-1604975701397-6365ccbd028a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
            rating: "7.8",
            categories: ["Hài", "Gia Đình"]
        },
        {
            id: "4",
            title: "Quỷ Cẩu",
            poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
            rating: "8.5",
            categories: ["Kinh Dị", "Tâm Lý"]
        }
    ];

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
                                    src={movie.poster}
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
                                    {movie.categories.map((category, index) => (
                                        <span key={index} className="text-xs text-gray-400 mr-2">{category}</span>
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
