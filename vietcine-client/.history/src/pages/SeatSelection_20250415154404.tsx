import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SeatMap } from "../components/SeatMap";
import { BookingSummary } from "../components/BookingSummary";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import axios from "axios";

interface Showtime {
    id: number;
    movieId: number;
    movieTitle: string;
    time: string;
    date: string;
    theater: string;
    screen: string;
    screenId: number | null; // Allow null as per API
}

interface SelectedSeat {
    id: number;
    type: string;
    price: number;
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
    const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

    // Fetch showtime details and movie title
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

                const showtimeData = showtimeResponse.data.data;

                // Fetch movie title (showtime response lacks it)
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
                    date: startTime.toISOString().split("T")[0],
                    theater: showtimeData.screen.theater.name,
                    screen: showtimeData.screen.screenNumber,
                    screenId: showtimeData.screen.screenId, // May be null
                };

                setShowtime(formattedShowtime);

                // Check for null screenId
                if (!showtimeData.screen.id) {
                    setError("Screen ID is missing. Cannot load seat map.");
                }
            } catch (err) {
                setError("Failed to load showtime details. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchShowtimeDetails();
    }, [movieId, showtimeId]);

    const handleSeatToggle = (seatId: number, seatType: string, price: number) => {
        setSelectedSeats((prevSeats) => {
            const seatExists = prevSeats.find((seat) => seat.id === seatId);
            if (seatExists) {
                return prevSeats.filter((seat) => seat.id !== seatId);
            } else {
                return [...prevSeats, { id: seatId, type: seatType, price }];
            }
        });
    };

    const handleBackToShowtimes = () => {
        navigate(`/movie-detail/${}`);
    };

    const handleProceedToPayment = () => {
        if (selectedSeats.length === 0) {
            alert("Vui lòng chọn ít nhất một ghế để tiếp tục!");
            return;
        }

        // Simulate booking success (replace with actual API call)
        alert(
            `Đặt vé thành công! Bạn đã chọn ${selectedSeats.length} ghế: ${selectedSeats
                .map((seat) => `${seat.type} (ID: ${seat.id})`)
                .join(", ")}`
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
                <NavBar transparent={false} fixedTop={false} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">{error || "Suất chiếu không tồn tại"}</h2>
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

    const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const formattedTotalAmount = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    })
        .format(totalAmount)
        .replace("₫", "đ");

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <NavBar />

            <div className="container my-6 mx-auto px-4 py-8 flex-1">
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

                            {showtime.screenId ? (
                                <SeatMap
                                    screenId={showtime.screenId}
                                    showtimeId={showtime.id}
                                    selectedSeats={selectedSeats.map((seat) => seat.id)}
                                    onSeatToggle={(seatId, seatType, price) =>
                                        handleSeatToggle(seatId, seatType, price)
                                    }
                                />
                            ) : (
                                <p className="text-red-500">Cannot load seat map: Screen ID is missing.</p>
                            )}
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