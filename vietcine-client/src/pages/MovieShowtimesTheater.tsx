import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Cinema {
    id: string;
    name: string;
    logo: string;
    slug: string;
    brand: string;
    address?: string;
}

interface Movie {
    id: string;
    title: string;
    posterUrl: string;
    genres: string[];
    duration: number;
    rating: string;
    slug: string;
}

interface Showtime {
    id: string;
    startTime: string;
    endTime: string;
    format: string;
}

interface MovieShowtime {
    movie: Movie;
    showtimes: Showtime[];
}

interface CinemaBrand {
    id: string;
    name: string;
    logo: string;
}

export default function MovieShowtimes() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [selectedCinema, setSelectedCinema] = useState<string>("all");
    const [selectedBrand, setSelectedBrand] = useState<string>("all");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [city, setCity] = useState<string>("Hồ Chí Minh");
    const [movieShowtimes, setMovieShowtimes] = useState<MovieShowtime[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Generate dates for the next 7 days
    const generateDates = () => {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const day = date.getDate();
            const dayName = i === 0
                ? "Hôm nay"
                : ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"][date.getDay()];

            dates.push({
                date: date.toISOString().split('T')[0],
                day,
                dayName
            });
        }

        return dates;
    };

    const dates = generateDates();

    // Define cinema brands
    const cinemaBrands: CinemaBrand[] = [
        { id: "cgv", name: "CGV", logo: "/logos/cgv.png" },
        { id: "lotte", name: "Lotte Cinema", logo: "/logos/lotte.png" },
        { id: "galaxy", name: "Galaxy Cinema", logo: "/logos/galaxy.png" },
        { id: "bhd", name: "BHD Star", logo: "/logos/bhd.png" },
        { id: "beta", name: "Beta Cinemas", logo: "/logos/beta.png" },
        { id: "cinestar", name: "Cinestar", logo: "/logos/cinestar.png" },
        { id: "mega", name: "Mega GS", logo: "/logos/megags.png" },
        { id: "cinemax", name: "Cinemax", logo: "/logos/cinemax.png" },
        { id: "dcine", name: "DCINE", logo: "/logos/dcine.png" },
    ];

    useEffect(() => {
        // On component mount, set the selected date to today
        setSelectedDate(dates[0].date);

        // Fetch cinema data
        fetchCinemas();
    }, []);

    useEffect(() => {
        // Reset selected cinema when brand changes
        if (selectedBrand !== "all") {
            setSelectedCinema("all");
        }
    }, [selectedBrand]);

    useEffect(() => {
        // Fetch showtimes when cinema, brand or date selection changes
        if (selectedDate) {
            fetchShowtimes();
        }
    }, [selectedCinema, selectedBrand, selectedDate, city]);

    const fetchCinemas = async () => {
        try {
            setLoading(true);
            setError(null);

            // Mock data for cinemas
            const allCinemas: Cinema[] = [
                { id: "cgv1", name: "CGV Vincom Mega Mall Grand Park", logo: "/logos/cgv.png", slug: "cgv-vincom-mega-mall-grand-park", brand: "cgv", address: "Lô L5-01, Tầng L5, Trung Tâm Thương Mại Vincom Mega Mall Grand Park, Dự án Khu dân cư và Công viên Vinhomes Grand Park, Phường Long Bình và Long Thạnh Mỹ, Quận 9, TP. HCM" },
                { id: "cgv2", name: "CGV Hùng Vương Plaza", logo: "/logos/cgv.png", slug: "cgv-hung-vuong-plaza", brand: "cgv", address: "Tầng 7, Hùng Vương Plaza, 126 Hùng Vương, Quận 5, TP. HCM" },
                { id: "cgv3", name: "CGV Hoàng Văn Thụ", logo: "/logos/cgv.png", slug: "cgv-hoang-van-thu", brand: "cgv", address: "Tầng 1 & 2, Gala Center, 415 Hoàng Văn Thụ, Phường 2, Quận Tân Bình, TP. HCM" },
                { id: "cgv4", name: "CGV Giga Mall Thủ Đức", logo: "/logos/cgv.png", slug: "cgv-giga-mall-thu-duc", brand: "cgv", address: "Tầng 6, TTTM Giga Mall Thủ Đức, 240-242 Phạm Văn Đồng, Phường Hiệp Bình Chánh, Thành phố Thủ Đức, TP. HCM" },
                { id: "cgv5", name: "CGV Aeon Bình Tân", logo: "/logos/cgv.png", slug: "cgv-aeon-binh-tan", brand: "cgv", address: "Tầng 3, TTTM Aeon Mall Bình Tân, Số 1 đường số 17A, khu phố 11, phường Bình Trị Đông B, quận Bình Tân, TP. HCM" },
                { id: "cgv6", name: "CGV Liberty Citypoint", logo: "/logos/cgv.png", slug: "cgv-liberty-citypoint", brand: "cgv", address: "Tầng 3 & 4, TTTM Liberty Citypoint, 59-61 Nguyễn Trãi, P. Bến Thành, Quận 1, TP. HCM" },
                { id: "cgv7", name: "CGV Pearl Plaza", logo: "/logos/cgv.png", slug: "cgv-pearl-plaza", brand: "cgv", address: "Tầng 5, Pearl Plaza, 561A Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. HCM" },

                { id: "lotte1", name: "Lotte Cinema Cantavil", logo: "/logos/lotte.png", slug: "lotte-cinema-cantavil", brand: "lotte", address: "Tầng 7, Cantavil Premier, Số 1 đường Song Hành, Xa lộ Hà Nội, P. An Phú, Quận 2, TP. HCM" },
                { id: "lotte2", name: "Lotte Cinema Cộng Hòa", logo: "/logos/lotte.png", slug: "lotte-cinema-cong-hoa", brand: "lotte", address: "Tầng 4, Pico Plaza, 20 Cộng Hòa, P. 12, Quận Tân Bình, TP. HCM" },
                { id: "lotte3", name: "Lotte Cinema Gold View", logo: "/logos/lotte.png", slug: "lotte-cinema-gold-view", brand: "lotte", address: "Tầng 3, The Gold View, 346 Bến Vân Đồn, P. 1, Quận 4, TP. HCM" },

                { id: "galaxy1", name: "Galaxy Nguyễn Du", logo: "/logos/galaxy.png", slug: "galaxy-nguyen-du", brand: "galaxy", address: "116 Nguyễn Du, P. Bến Thành, Quận 1, TP. HCM" },
                { id: "galaxy2", name: "Galaxy Tân Bình", logo: "/logos/galaxy.png", slug: "galaxy-tan-binh", brand: "galaxy", address: "246 Nguyễn Hồng Đào, P. 13, Quận Tân Bình, TP. HCM" },

                { id: "bhd1", name: "BHD Star Bitexco", logo: "/logos/bhd.png", slug: "bhd-star-bitexco", brand: "bhd", address: "Tầng 3 & 4, TTTM Icon 68, 2 Hải Triều, P. Bến Nghé, Quận 1, TP. HCM" },
                { id: "bhd2", name: "BHD Star Phạm Hùng", logo: "/logos/bhd.png", slug: "bhd-star-pham-hung", brand: "bhd", address: "Tầng 4, TTTM Satra Phạm Hùng, C6/27 Phạm Hùng, Bình Chánh, TP. HCM" },

                { id: "beta1", name: "Beta Cinemas Quang Trung", logo: "/logos/beta.png", slug: "beta-cinemas-quang-trung", brand: "beta", address: "Tầng 5, Vincom Plaza Quang Trung, 190 Quang Trung, P. 10, Quận Gò Vấp, TP. HCM" },

                { id: "cinestar1", name: "Cinestar Quốc Thanh", logo: "/logos/cinestar.png", slug: "cinestar-quoc-thanh", brand: "cinestar", address: "271 Nguyễn Trãi, P. Nguyễn Cư Trinh, Quận 1, TP. HCM" },

                { id: "mega1", name: "Mega GS Cao Thắng", logo: "/logos/megags.png", slug: "mega-gs-cao-thang", brand: "mega", address: "19 Cao Thắng, P. 2, Quận 3, TP. HCM" },

                { id: "cinemax1", name: "Cinemax Nguyễn Trãi", logo: "/logos/cinemax.png", slug: "cinemax-nguyen-trai", brand: "cinemax", address: "Tầng 6, Crescent Mall, 101 Tôn Dật Tiên, P. Tân Phú, Quận 7, TP. HCM" },

                { id: "dcine1", name: "DCINE Bến Thành", logo: "/logos/dcine.png", slug: "dcine-ben-thanh", brand: "dcine", address: "6 Mạc Đĩnh Chi, P. Bến Nghé, Quận 1, TP. HCM" },
            ];

            setCinemas(allCinemas);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch cinemas");
            setLoading(false);
            console.error("Error fetching cinemas:", err);
        }
    };

    const fetchShowtimes = async () => {
        try {
            setLoading(true);
            setError(null);

            // Mock data for showtimes
            const mockMovieShowtimes = [
                {
                    movie: {
                        id: "movie1",
                        title: "Địa Đạo: Mặt Trời Trong Bóng Tối",
                        posterUrl: "https://i.imgur.com/4ZtPRV3.jpg",
                        genres: ["Lịch Sử", "Chiến Tranh"],
                        duration: 128,
                        rating: "16+",
                        slug: "dia-dao-mat-troi-trong-bong-toi"
                    },
                    showtimes: [
                        { id: "st1", startTime: "10:50", endTime: "12:58", format: "2D Phụ đề" },
                        { id: "st2", startTime: "14:00", endTime: "16:08", format: "2D Phụ đề" },
                        { id: "st3", startTime: "15:30", endTime: "17:38", format: "2D Phụ đề" },
                        { id: "st4", startTime: "19:15", endTime: "21:23", format: "2D Phụ đề" },
                        { id: "st5", startTime: "20:00", endTime: "22:08", format: "2D Phụ đề" },
                        { id: "st6", startTime: "21:45", endTime: "23:53", format: "2D Phụ đề" },
                        { id: "st7", startTime: "22:30", endTime: "00:38", format: "2D Phụ đề" },
                    ]
                },
                {
                    movie: {
                        id: "movie2",
                        title: "Một bộ phim Minecraft",
                        posterUrl: "https://i.imgur.com/lWo1yV2.jpg",
                        genres: ["Hài", "Phiêu Lưu", "Gia Đình", "Giả Tưởng"],
                        duration: 121,
                        rating: "P",
                        slug: "mot-bo-phim-minecraft"
                    },
                    showtimes: [
                        { id: "st8", startTime: "18:00", endTime: "20:01", format: "2D Lồng tiếng" },
                    ]
                }
            ];

            // Filter showtimes based on selected cinema or brand
            let filteredShowtimes = [...mockMovieShowtimes];

            if (selectedCinema !== "all") {
                // In a real app, this would be filtered by API
                // For mock data, we'll just return all showtimes
            } else if (selectedBrand !== "all") {
                // In a real app, this would be filtered by API
                // For mock data, we'll just return all showtimes
            }

            setMovieShowtimes(filteredShowtimes);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch showtimes");
            setLoading(false);
            console.error("Error fetching showtimes:", err);
        }
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
    };

    const handleBrandChange = (brandId: string) => {
        setSelectedBrand(brandId);
        // Reset cinema selection when changing brand
        setSelectedCinema("all");
        // No navigation here - we'll handle everything in the component
    };

    const handleCinemaChange = (cinemaId: string) => {
        setSelectedCinema(cinemaId);
    };

    const filterCinemasBySearch = () => {
        let filteredCinemas = cinemas;

        // Filter by brand if one is selected
        if (selectedBrand !== "all") {
            filteredCinemas = filteredCinemas.filter(cinema => cinema.brand === selectedBrand);
        }

        // Filter by search query if provided
        if (searchQuery) {
            filteredCinemas = filteredCinemas.filter(cinema =>
                cinema.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by city
        filteredCinemas = filteredCinemas.filter(cinema => true); // Add actual city filtering logic here

        return filteredCinemas;
    };

    // Get the selected cinema details
    const selectedCinemaDetails = selectedCinema !== "all"
        ? cinemas.find(cinema => cinema.id === selectedCinema)
        : null;

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

                {/* Showtimes Content */}
                <section className="py-12 relative z-10">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl font-bold text-center text-red-500 mb-10">Lịch chiếu phim</h1>

                        {/* Location & Cinema Selection */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-10">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Location Selection */}
                                <div className="w-full md:w-1/3">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Vị trí</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                        >
                                            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                            <option value="Hà Nội">Hà Nội</option>
                                            <option value="Đà Nẵng">Đà Nẵng</option>
                                        </select>
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Search Cinema */}
                                <div className="w-full md:w-1/3">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">&nbsp;</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Tìm theo tên rạp ..."
                                            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cinema Brand Logos */}
                            <div className="mt-6">
                                <h3 className="text-white text-lg mb-3">Hệ thống rạp chiếu phim</h3>
                                <div className="flex flex-wrap gap-3 items-center mb-6">
                                    {/* All cinemas button */}
                                    <button
                                        onClick={() => handleBrandChange("all")}
                                        className={`flex flex-col items-center p-2 rounded-md transition duration-300 ${selectedBrand === "all"
                                            ? "bg-white/20 border-2 border-red-500"
                                            : "bg-white/10 hover:bg-white/15"
                                            }`}
                                    >
                                        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full mb-1">
                                            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                            </svg>
                                        </div>
                                        <span className="text-xs text-center">Tất cả</span>
                                    </button>

                                    {/* Cinema brand buttons */}
                                    {cinemaBrands.map((brand) => (
                                        <button
                                            key={brand.id}
                                            onClick={() => handleBrandChange(brand.id)}
                                            className={`flex flex-col items-center p-2 rounded-md transition duration-300 ${selectedBrand === brand.id
                                                ? "bg-white/20 border-2 border-red-500"
                                                : "bg-white/10 hover:bg-white/15"
                                                }`}
                                        >
                                            <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg mb-1 p-1">
                                                <img
                                                    src={brand.logo}
                                                    alt={brand.name}
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>
                                            <span className="text-xs text-center">{brand.name.split(' ')[0]}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Cinema List - Only show if a brand is selected or we're showing all */}
                        {(selectedBrand !== "all" || searchQuery) && (
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-10">
                                <h3 className="text-white text-lg mb-4">
                                    {selectedBrand !== "all"
                                        ? `Rạp chiếu phim ${cinemaBrands.find(b => b.id === selectedBrand)?.name}`
                                        : "Tất cả các rạp"}
                                </h3>

                                <div className="flex flex-col space-y-2">
                                    {filterCinemasBySearch().slice(0, 7).map((cinema) => (
                                        <button
                                            key={cinema.id}
                                            onClick={() => handleCinemaChange(cinema.id)}
                                            className={`flex items-center p-4 rounded-lg transition duration-300 ${selectedCinema === cinema.id
                                                ? "bg-white/20 border-l-4 border-red-500"
                                                : "hover:bg-white/10"
                                                }`}
                                        >
                                            <div className="w-10 h-10 flex-shrink-0 bg-white rounded-md overflow-hidden mr-4">
                                                <img
                                                    src={cinema.logo}
                                                    alt={cinema.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-white">{cinema.name}</h3>
                                            </div>
                                            <div className="ml-auto">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                </svg>
                                            </div>
                                        </button>
                                    ))}

                                    {filterCinemasBySearch().length > 7 && (
                                        <button className="text-red-500 hover:text-red-400 transition duration-300 py-2 text-center mt-2">
                                            Xem thêm
                                        </button>
                                    )}

                                    {filterCinemasBySearch().length === 0 && (
                                        <div className="text-gray-400 text-center py-4">
                                            Không tìm thấy rạp phù hợp với tìm kiếm của bạn.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Selected Cinema Details and Showtimes */}
                        {selectedCinemaDetails ? (
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-10">
                                <div className="flex items-center mb-6">
                                    <img
                                        src={selectedCinemaDetails.logo}
                                        alt={`${selectedCinemaDetails.name} Logo`}
                                        className="w-12 h-12 object-contain bg-white rounded-md p-1 mr-4"
                                    />
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            Lịch chiếu phim {selectedCinemaDetails.name}
                                        </h2>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {selectedCinemaDetails.address || ""}
                                            {selectedCinemaDetails.address && (
                                                <span className="text-blue-400 ml-2 cursor-pointer">[Bản đồ]</span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Date Selection */}
                                <div className="grid grid-cols-7 gap-2 mb-8">
                                    {dates.map((dateInfo, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleDateChange(dateInfo.date)}
                                            className={`flex flex-col items-center justify-center py-3 rounded-lg transition duration-300 ${selectedDate === dateInfo.date
                                                ? "bg-red-600 text-white"
                                                : "bg-gray-800 hover:bg-gray-700 text-white"
                                                }`}
                                        >
                                            <span className="text-lg font-bold">{dateInfo.day}</span>
                                            <span className="text-xs mt-1">{dateInfo.dayName}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Movies and Showtimes */}
                                {loading ? (
                                    <div className="flex flex-col justify-center items-center h-64">
                                        <div className="flex space-x-2 mb-2">
                                            <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                                        </div>
                                        <div className="text-white">Đang tải lịch chiếu phim...</div>
                                    </div>
                                ) : error ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="text-red-500">{error}</div>
                                    </div>
                                ) : movieShowtimes.length === 0 ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="text-gray-400">Không có lịch chiếu phim nào cho ngày đã chọn</div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {movieShowtimes.map((item, index) => (
                                            <div key={index} className="bg-gray-900/80 rounded-lg p-6">
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    {/* Movie Poster and Info */}
                                                    <div className="flex-shrink-0 w-full md:w-64">
                                                        <div className="relative group cursor-pointer" onClick={() => navigate(`/movies/${item.movie.slug}`)}>
                                                            <div className="aspect-[2/3] overflow-hidden rounded-lg">
                                                                <img
                                                                    src={item.movie.posterUrl}
                                                                    alt={item.movie.title}
                                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                                />
                                                            </div>
                                                            {item.movie.rating && (
                                                                <div className="absolute top-2 right-2 bg-red-600 text-white text-sm font-semibold py-1 px-2 rounded">
                                                                    {item.movie.rating}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Movie Details and Showtimes */}
                                                    <div className="flex-grow">
                                                        <h3 className="text-xl font-bold text-white mb-2">
                                                            {item.movie.title}
                                                        </h3>
                                                        <div className="text-gray-400 mb-4">
                                                            {item.movie.genres.join(', ')}
                                                        </div>

                                                        {/* Show Format */}
                                                        <div className="mb-3 text-white font-medium">
                                                            {item.showtimes[0].format}
                                                        </div>

                                                        {/* Showtimes */}
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                                            {item.showtimes.map((showtime, idx) => (
                                                                <button
                                                                    key={idx}
                                                                    className="bg-gray-800 hover:bg-gray-700 transition duration-300 rounded-lg p-3 text-center"
                                                                    onClick={() => navigate(`/booking/${showtime.id}`)}
                                                                >
                                                                    <div className="text-white font-medium">{showtime.startTime} ~ {showtime.endTime}</div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : selectedBrand !== "all" ? (
                            // Show brand-wide movies and cinemas
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-10">
                                <div className="flex items-center mb-6">
                                    <img
                                        src={`/logos/${selectedBrand}.png`}
                                        alt={`${cinemaBrands.find(b => b.id === selectedBrand)?.name} Logo`}
                                        className="w-12 h-12 object-contain bg-white rounded-md p-1 mr-4"
                                    />
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            Lịch chiếu phim {cinemaBrands.find(b => b.id === selectedBrand)?.name}
                                        </h2>
                                    </div>
                                </div>

                                {/* Date Selection */}
                                <div className="grid grid-cols-7 gap-2 mb-8">
                                    {dates.map((dateInfo, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleDateChange(dateInfo.date)}
                                            className={`flex flex-col items-center justify-center py-3 rounded-lg transition duration-300 ${selectedDate === dateInfo.date
                                                ? "bg-red-600 text-white"
                                                : "bg-gray-800 hover:bg-gray-700 text-white"
                                                }`}
                                        >
                                            <span className="text-lg font-bold">{dateInfo.day}</span>
                                            <span className="text-xs mt-1">{dateInfo.dayName}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Cinemas of this brand */}
                                <div className="mb-8">
                                    <h3 className="text-white text-lg mb-4">Chọn rạp để xem lịch chiếu</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {cinemas
                                            .filter(cinema => cinema.brand === selectedBrand)
                                            .map(cinema => (
                                                <div
                                                    key={cinema.id}
                                                    onClick={() => handleCinemaChange(cinema.id)}
                                                    className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 cursor-pointer transition duration-300"
                                                >
                                                    <h4 className="text-white font-medium">{cinema.name}</h4>
                                                    <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                                                        {cinema.address || "Địa chỉ không có sẵn"}
                                                    </p>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Movies showing at this brand's cinemas */}
                                <div>
                                    <h3 className="text-white text-lg mb-4">Phim đang chiếu tại {cinemaBrands.find(b => b.id === selectedBrand)?.name}</h3>

                                    {loading ? (
                                        <div className="flex justify-center items-center h-40">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                                        </div>
                                    ) : error ? (
                                        <div className="text-red-500 text-center py-8">{error}</div>
                                    ) : movieShowtimes.length === 0 ? (
                                        <div className="text-gray-400 text-center py-8">Không có phim nào đang chiếu</div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {movieShowtimes.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="relative group cursor-pointer"
                                                    onClick={() => navigate(`/movies/${item.movie.slug}`)}
                                                >
                                                    <div className="aspect-[2/3] overflow-hidden rounded-lg">
                                                        <img
                                                            src={item.movie.posterUrl}
                                                            alt={item.movie.title}
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                        />
                                                    </div>
                                                    {item.movie.rating && (
                                                        <div className="absolute top-2 right-2 bg-red-600 text-white text-sm font-semibold py-1 px-2 rounded">
                                                            {item.movie.rating}
                                                        </div>
                                                    )}
                                                    <div className="mt-2">
                                                        <h4 className="text-white font-medium line-clamp-2">{item.movie.title}</h4>
                                                        <p className="text-gray-400 text-xs mt-1">{item.movie.genres.join(', ')}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // Show all movies or other content when no brand or cinema is selected
                            <div className="text-center py-12 text-gray-400">
                                Vui lòng chọn rạp hoặc hệ thống rạp để xem lịch chiếu
                            </div>
                        )}
                    </div>
                </section>
            </div>
            {/* Footer */}
            <Footer />
        </div>
    );
}