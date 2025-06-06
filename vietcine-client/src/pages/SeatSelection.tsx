import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SeatMap } from "../components/SeatMap";
import { BookingSummary } from "../components/BookingSummary";
import { FoodSelectionModal } from "../components/FoodSelectionModal";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

interface Screen {
    id: number;
    screenNumber: string;
    totalSeats: number;
    theater: {
        id: number;
        name: string;
        address: string;
        city: string;
        theaterBrand: TheaterBrand;
    };
}

interface TheaterBrand {
    id: number;
    theaterBrandName: string;
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
    screenId: number;
    theaterBrandId: number;
}

interface SeatType {
    seatTypeId: number;
    typeName: string;
    price: number;
    priceIncrease: number;
    totalPrice: number;
}

interface SeatPrice {
    seatTypeId: number;
    seatTypeName: string;
    price: number;
    priceIncrease: number;
    totalPrice: number;
}

interface SelectedSeat {
    SeatId: number;
    SeatNumber: string;
    seatTypeId: number;
    price: number;
}

interface FoodItem {
    id: number;
    foodName: string;
    description: string;
    price: number;
    quantity: number;
}

interface BookingResponse {
    bookingId: number;
    userId: number;
    showtimeId: number;
    bookingDate: string;
    total: number;
    status: string;
    discount: number | null;
    paymentId: number;
    isActive: boolean;
    vnpTxnRef: string;
    voucherUserId: number | null;
    seatIds: number[];
    foodItems: { foodId: number; quantity: number; total: number }[];
}

interface Voucher {
    voucherId: number;
    discount: number;
    validFrom: string;
    validUntil: string;
    minBillPrice: number;
    description: string;
    theaterBrandId: number;
    voucherUserId: number;
    isUsed: boolean;
}

export default function SeatSelection() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const movieId = queryParams.get("movieId") || "";
    const showtimeId = queryParams.get("showtimeId") || "";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showtime, setShowtime] = useState<Showtime | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
    const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
    const [seatPrices, setSeatPrices] = useState<SeatPrice[]>([]);
    const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);

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

                const showtimeResponse = await axios.get(
                    `http://localhost:8081/api/showtimes?showtimeId=${showtimeId}`
                );
                if (!showtimeResponse.data.success) {
                    throw new Error("Could not load showtime details");
                }

                const showtimeData: ShowtimeResponse = showtimeResponse.data.data;
                const screenId = showtimeData.screen.id;
                const theaterBrandId = showtimeData.screen.theater.theaterBrand.id;

                const movieResponse = await axios.get(
                    `http://localhost:8081/api/movies/detail/${movieId}`
                );
                if (!movieResponse.data.success) {
                    throw new Error("Could not load movie details");
                }
                const movieTitle = movieResponse.data.data.title;

                const seatTypesResponse = await axios.get(
                    `http://localhost:8081/api/seattypes?screenId=${screenId}`
                );
                if (!seatTypesResponse.data.success) {
                    throw new Error("Could not load seat types");
                }
                setSeatTypes(seatTypesResponse.data.data);

                const seatPricesResponse = await axios.get(
                    `http://localhost:8081/api/seatprices?screenId=${screenId}`
                );
                if (!seatPricesResponse.data.success) {
                    throw new Error("Could not load seat prices");
                }
                setSeatPrices(seatPricesResponse.data.data);

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
                    screenId: screenId,
                    theaterBrandId: theaterBrandId,
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

    const getSeatPrice = (seatTypeId: number): number => {
        const seatPrice = seatPrices.find(price => price.seatTypeId === seatTypeId);
        if (seatPrice) {
            return seatPrice.totalPrice;
        }

        const seatType = seatTypes.find(type => type.seatTypeId === seatTypeId);
        return seatType ? seatType.totalPrice : 0;
    };

    const handleSeatToggle = (seatId: number, seatNumber: string, seatTypeId: number) => {
        const seatIndex = selectedSeats.findIndex(seat => seat.SeatId === seatId);
        if (seatIndex > -1) {
            setSelectedSeats(prevSeats => prevSeats.filter(seat => seat.SeatId !== seatId));
        } else {
            const price = getSeatPrice(seatTypeId);
            setSelectedSeats(prevSeats => [...prevSeats, {
                SeatId: seatId,
                SeatNumber: seatNumber,
                seatTypeId,
                price
            }]);
        }
    };

    const handleBackToShowtimes = () => {
        navigate(`/movie-detail/${movieId}`);
    };

    const handleOpenFoodModal = () => {
        if (selectedSeats.length === 0) {
            alert("Vui lòng chọn ít nhất một ghế để tiếp tục!");
            return;
        }
        setIsFoodModalOpen(true);
    };

    const handleFoodModalClose = () => {
        setIsFoodModalOpen(false);
    };

    const calculateTotalAmount = (seats: SelectedSeat[], foods: FoodItem[] | null, voucher: Voucher | null = null): number => {
        const seatsTotal = seats.reduce((total, seat) => total + seat.price, 0);
        let foodTotal = 0;
        if (foods != null) {
            foodTotal = foods.reduce((total, food) => total + (food.price * food.quantity), 0);
        }
        const subtotal = seatsTotal + foodTotal;
        const discount = voucher ? voucher.discount : 0;
        return subtotal - discount;
    };

    const handleVoucherSelect = (voucher: Voucher | null) => {
        setSelectedVoucher(voucher);
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        })
            .format(price)
            .replace("₫", "đ");
    };

    const initiateVNPayPayment = async (foods: FoodItem[]) => {
        try {
            const totalAmount = calculateTotalAmount(selectedSeats, foods, selectedVoucher);
            const seatNumbersList = selectedSeats.map(seat => seat.SeatNumber).join(", ");


            // Prepare data for VNPAY payment
            const paymentData = {
                amount: totalAmount,
                orderInfo: `Thanh toan ve xem phim: ${showtime?.movieTitle} - Ghe: ${seatNumbersList}`,
                bankCode: "", // Optional, can be set if you want to specify a bank
            };

            // Call VNPAY payment creation endpoint
            const paymentResponse = await axios.post("http://localhost:8081/api/vnpay-payment/create", paymentData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Redirect to the VNPAY payment URL
            const paymentUrl = paymentResponse.data;
            if (paymentUrl) {
                const bookingRequest = {
                    user: user.id,
                    showtime: showtime?.id,
                    total: totalAmount,
                    status: "Pending",
                    discount: selectedVoucher ? selectedVoucher.discount : 0,
                    payment: 1,
                    voucherUserId: selectedVoucher ? selectedVoucher.voucherUserId : null,
                    seats: selectedSeats.map(seat => ({
                        seat: seat.SeatId
                    })),
                    foods: foods.map(food => ({
                        foodId: food.id,
                        quantity: food.quantity,
                        total: food.price * food.quantity
                    }))
                };

                const bookingResponse = await axios.post("http://localhost:8081/api/bookings", bookingRequest, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!bookingResponse.data.success) {
                    throw new Error(bookingResponse.data.message || "Không thể tạo booking");
                }

                const bookingData: BookingResponse = bookingResponse.data.data;

                // Store booking details in localStorage to use after payment
                localStorage.setItem("pendingBooking", JSON.stringify(bookingData));

                console.log("Booking created successfully:", bookingData);
                window.location.href = paymentUrl;
            } else {
                throw new Error("Không nhận được URL thanh toán từ server");
            }
        } catch (err: any) {
            console.error("Error initiating VNPAY payment:", err);
            alert(err.message || "Đã có lỗi xảy ra khi khởi tạo thanh toán VNPAY. Vui lòng thử lại!");
        }
    };

    const handleFoodSelection = async (foods: FoodItem[]) => {
        setIsFoodModalOpen(false);
        await initiateVNPayPayment(foods);
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

    const totalAmount = calculateTotalAmount(selectedSeats, null);
    const formattedTotalAmount = formatPrice(totalAmount);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <NavBar />

            <div className="container my-14 mx-auto px-4 py-8 flex-1">
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
                    <div className="flex-1">
                        <div className="bg-gray-900 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-6">Chọn ghế ngồi</h2>

                            <div className="max-w-[1000px] overflow-x-auto">
                                <SeatMap
                                    showtimeId={showtime.id.toString()}
                                    selectedSeats={selectedSeats}
                                    onSeatToggle={handleSeatToggle}
                                />
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium mb-4">Chú thích</h3>
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-purple-700 rounded-t-md mr-2"></div>
                                        <span className="text-sm">Ghế thường</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-red-600 rounded-t-md mr-2"></div>
                                        <span className="text-sm">Ghế VIP</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-pink-600 rounded-t-md mr-2"></div>
                                        <span className="text-sm">Ghế đôi</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-blue-900 rounded-t-md mr-2"></div>
                                        <span className="text-sm">Ghế bạn chọn</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-gray-500 rounded-t-md mr-2"></div>
                                        <span className="text-sm">Đã đặt</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-80">
                        <BookingSummary
                            showtime={showtime}
                            selectedSeats={selectedSeats}
                            totalAmount={formattedTotalAmount}
                            onProceedToPayment={handleOpenFoodModal}
                            seatTypes={seatPrices.length > 0 ? seatPrices.map(price => ({
                                seatTypeId: price.seatTypeId,
                                typeName: price.seatTypeName,
                                price: price.price,
                                priceIncrease: price.priceIncrease,
                                totalPrice: price.totalPrice
                            })) : seatTypes}
                            userId={user.id} // Add this prop
                            onVoucherSelect={handleVoucherSelect} // Add this prop
                        />
                    </div>
                </div>
            </div>

            <Footer />

            <FoodSelectionModal
                isOpen={isFoodModalOpen}
                onClose={handleFoodModalClose}
                onConfirm={handleFoodSelection}
                theaterBrandId={showtime?.theaterBrandId || 1}
            />
        </div>
    );
} 