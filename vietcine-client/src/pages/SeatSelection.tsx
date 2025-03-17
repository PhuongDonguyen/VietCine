import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SeatMap } from "../components/SeatMap";
import { BookingSummary } from "../components/BookingSummary";
import { ArrowLeft, Clock, MapPin } from "lucide-react";

interface Showtime {
    id: string;
    movieId: string;
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
    const movieId = queryParams.get('movieId') || "";
    const showtimeId = queryParams.get('showtimeId') || "";

    const [loading, setLoading] = useState(true);
    const [showtime, setShowtime] = useState<Showtime | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    // This would come from an API in a real application
    useEffect(() => {
        // Simulate API call delay
        const timer = setTimeout(() => {
            // Get showtime details based on showtimeId
            const showtimeData: Showtime = {
                id: showtimeId,
                movieId: movieId,
                movieTitle: getMovieTitleById(movieId),
                time: "19:30",
                date: "2025-03-04",
                theater: "CGV Landmark 81",
                screen: "Screen 7",
                price: 130000, // in VND
                formattedPrice: "130,000đ"
            };

            setShowtime(showtimeData);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [movieId, showtimeId]);

    // Helper function to get movie title
    const getMovieTitleById = (id: string) => {
        const movies = {
            "1": "Lật Mặt 7: Một Điều Ước",
            "2": "Mai",
            "3": "Gặp Lại Chị Bầu",
            "4": "Quỷ Cẩu"
        };
        return movies[id as keyof typeof movies] || "Phim không xác định";
    };

    const handleSeatToggle = (seatId: string) => {
        setSelectedSeats(prevSeats => {
            if (prevSeats.includes(seatId)) {
                return prevSeats.filter(seat => seat !== seatId);
            } else {
                return [...prevSeats, seatId];
            }
        });
    };

    const handleBackToShowtimes = () => {
        navigate(`/movie-detail?id=${movieId}`);
    };

    const handleProceedToPayment = () => {
        // In a real app, we would navigate to a payment page
        // or handle the booking process
        // For now, we'll just alert the user
        alert(`Đặt vé thành công! Bạn đã chọn ${selectedSeats.length} ghế: ${selectedSeats.join(", ")}`);
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

    if (!showtime) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                <NavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Suất chiếu không tồn tại</h2>
                        <button
                            onClick={() => navigate(`/movie-detail?id=${movieId}`)}
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
    const formattedTotalAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
        .format(totalAmount)
        .replace('₫', 'đ');

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <NavBar />

            <div className="container mx-auto px-4 py-8 flex-1">
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
                            <span>{showtime.time} | {new Date(showtime.date).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-1 text-red-600" />
                            <span>{showtime.theater} | {showtime.screen}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Seat selection */}
                    <div className="flex-1">
                        <div className="bg-gray-900 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-6">Chọn ghế ngồi</h2>

                            <SeatMap
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
