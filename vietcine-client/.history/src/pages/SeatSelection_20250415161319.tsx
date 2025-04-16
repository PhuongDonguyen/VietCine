import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SeatMap } from "../components/SeatMap";
import { BookingSummary } from "../components/BookingSummary";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import axios from "axios";

interface Screen {
    id: number;
    screenNumber: string;
    totalSeats: number;
    theater: {
        id: number;
        name: string;
        address: string;
        city: string;
    };
}

interface ShowtimeResponse {
    id: number;
    startTime: string;
    endTime: string;
    screen: Screen;
}

interface Showtime {
    id: number;
    movieId: number;
    movieTitle: string;
    time: string;
    date: string;
    theater: string;
    screen: string;
    price: number;
    formattedPrice: string;
}

export default function SeatSelection() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const movieId = queryParams.get("movieId") || "";
    const showtimeId = queryParams.get("showtimeId") || "";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showtime, setShowtime] = useState<Showtime | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    // Fetch showtime details and movie info
    useEffect(() => {
        const fetchShowtimeDetails = async () => {
            if (!movieId || !showtimeId) {
                setError("Missing movie ID or showtime ID");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Fetch showtime details
                const showtimeResponse = await axios.get(
                    `http://localhost:8081/api/showtimes?showtimeId=${showtimeId}`
                );
                if (!showtimeResponse.data.success) {
                    throw new Error("Could not load showtime details");
                }

                const showtimeData: ShowtimeResponse = showtimeResponse.data.data;

                // Fetch movie title
                const movieResponse = await axios.get(
                    `http://localhost:8081/api/movies/detail/${movieId}`
                );
                if (!movieResponse.data.success) {
                    throw new Error("Could not load movie details");
                }
                const movieTitle = movieResponse.data.data.title;

                // Format showtime data
                const startTime = new Date(showtimeData.startTime);
                const formattedShowtime: Showtime = {
                    id: showtimeData.id,
                    movieId: parseInt(movieId),
                    movieTitle: movieTitle || "Phim không xác định",
                    time: startTime.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Asia/Ho_Chi_Minh",
                    }),
                    date: startTime.toISOString().split("T")[0], // YYYY-MM-DD
                    theater: showtimeData.screen.theater.name,
                    screen: showtimeData.screen.screenNumber,
                    price: 130000, // Default price; update if backend provides it
                    formattedPrice: "130,000đ",
                };

                setShowtime(formattedShowtime);
            } catch (err) {
                setError("Failed to load showtime details. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchShowtimeDetails();
    }, [movieId, showtimeId]);

    const handleSeatToggle = (seatId: string) => {
        setSelectedSeats((prevSeats) => {
            if (prevSeats.includes(seatId)) {
                return prevSeats.filter((seat) => seat !== seatId);
            } else {
                return [...prevSeats, seatId];
            }
        });
    };

    const handleBackToShowtimes = () => {
        navigate(`/movie-detail/${movieId}`);
    };

    const handleProceedToPayment = () => {
        if (selectedSeats.length === 0) {
            alert("Vui lòng chọn ít nhất một ghế để tiếp tục!");
            return;
        }

        // In a real app, send booking request to backend
        // For now, simulate success
        alert(
            `Đặt vé thành công! Bạn đã chọn ${selectedSeats.length} ghế: ${selectedSeats.join(
                ", "
            )}`
        );
        navigate(`/`);
    };

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

    if (error || !showtime) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                <NavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">
                            {error || "Suất chiếu không tồn tại"}
                        </h2>
                        <button
                            onClick={handleBackToShowtimes}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                        >
                            Quay lại lịch chiếu
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const totalAmount = selectedSeats.length * showtime.price;
    const formattedTotalAmount = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    })
        .format(totalAmount)
        .replace("₫", "đ");

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <NavBar />

            <div className="container my-8 mx-auto px-4 py-8 flex-1">
                {/* Header with movie info and back button */}
                <div className="mb-8">
                    <button
                        onClick={handleBackToShowtimes}
                        className="flex items-center text-gray-400 hover:text-white mb-4 transition duration-300"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Quay lại lịch chiếu
                    </button>

                    <h1 className="text-3xl font-bold mb-2">{showtime.movieTitle}</h1>

                    <div className="flex flex-wrap items-center gap-4 text-gray-300">
                        <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-1 text-red-600" />
                            <span>
                                {showtime.time} |{" "}
                                {new Date(showtime.date).toLocaleDateString("vi-VN", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-1 text-red-600" />
                            <span>
                                {showtime.theater} | {showtime.screen}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Seat selection */}
                    <div className="flex-1">
                        <div className="bg-gray-900 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-6">Chọn ghế ngồi</h2>

                            <SeatMap
                                showtimeId={showtime.id.toString()}
                                selectedSeats={selectedSeats}
                                onSeatToggle={handleSeatToggle}
                            />

                            <div className="mt-8">
                                <h3 className="text-lg font-medium mb-4">Chú thích</h3>
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-gray-700 rounded-t-md mr-2"></div>
                                        <span className="text-sm">Ghế trống</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-red-600 rounded-t-md mr-2"></div>
                                        <span className="text-sm">Ghế đã chọn</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-gray-500 rounded-t-md mr-2"></div>
                                        <span className="text-sm">Ghế đã bán</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-yellow-500 rounded-t-md mr-2"></div>
                                        <span className="text-sm">Ghế VIP</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking summary */}
                    <div className="md:w-80">
                        <BookingSummary
                            showtime={showtime}
                            selectedSeats={selectedSeats}
                            totalAmount={formattedTotalAmount}
                            onProceedToPayment={handleProceedToPayment}
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}