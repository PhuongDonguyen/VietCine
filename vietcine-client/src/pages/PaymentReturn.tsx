import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";

// Interfaces from your original code
interface PaymentResult {
    status: string;
    transactionId?: string;
    amount?: string;
    orderInfo?: string;
    bookingId?: number; // Added to store booking ID for API update
}

interface BookingDetails {
    showtime: {
        id: number;
        movieId: number;
        movieTitle: string;
        time: string;
        date: string;
        theater: string;
        screen: string;
        screenId: number;
        theaterBrandId: number;
    };
    selectedSeats: Array<{
        SeatId: number;
        SeatNumber: string;
        seatTypeId: number;
        price: number;
    }>;
    selectedFoods: Array<{
        id: number;
        foodName: string;
        description: string;
        price: number;
        quantity: number;
    }>;
    totalAmount: number;
}

interface BookingResponse {
    id: number;
    userId: number;
    showtimeId: number;
    bookingDate: string;
    total: number;
    status: string;
    discount: number;
    paymentId: number;
    isActive: boolean;
    vnpTxnRef: string | null;
    voucherUserId: number | null;
}

// Confetti component for success animation
const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none z-10">
        {[...Array(50)].map((_, i) => (
            <div
                key={i}
                className="absolute animate-confetti"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `-20px`,
                    backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                    width: `${Math.random() * 10 + 5}px`,
                    height: `${Math.random() * 10 + 5}px`,
                    borderRadius: `${Math.random() > 0.5 ? '50%' : '0'}`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${Math.random() * 3 + 2}s`
                }}
            />
        ))}
    </div>
);

export default function PaymentReturn() {
    const navigate = useNavigate();
    const location = useLocation();
    const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    // Function to update booking status
    const updateBookingStatus = async (bookingId: number, vnpTxnRef: string, status: 'Success' | 'Failed') => {
        try {
            await axios.patch(`http://localhost:8081/api/bookings/${bookingId}`, {
                vnpTxnRef: vnpTxnRef,
                status: status === 'Success' ? 'Success' : 'Cancelled'
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(`Booking ${bookingId} status updated to ${status}`);
        } catch (error) {
            console.error('Failed to update booking status:', error);
            // Note: We don't throw this error to avoid breaking the user experience
            // The payment status is already determined by VNPAY response
        }
    };

    // Helper function to get booking ID from localStorage
    const getBookingIdFromStorage = (): number | null => {
        const bookingInfo = localStorage.getItem('pendingBooking');
        return bookingInfo ? JSON.parse(bookingInfo).id : null;
    };

    useEffect(() => {
        const confirmBooking = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get query parameters from VNPAY redirect
                const queryParams = new URLSearchParams(location.search);
                const vnpTxnRef = queryParams.get('vnp_TxnRef');

                // Call the backend's vnpay_return endpoint with the same query parameters
                const response = await axios.get("http://localhost:8081/api/vnpay-payment/vnpay_return", {
                    params: queryParams,
                });

                const result: PaymentResult = response.data;
                setPaymentResult(result);

                // Get booking ID from localStorage
                const bookingId = getBookingIdFromStorage();

                console.log({ bookingId, vnpTxnRef });

                // Update booking status if we have the required information
                if (bookingId && vnpTxnRef) {
                    const bookingStatus = result.status === "Success" ? "Success" : "Failed";
                    await updateBookingStatus(bookingId, vnpTxnRef, bookingStatus);
                } else {
                    console.warn('Missing booking ID or transaction reference for status update');
                }

                // Show confetti animation on successful payment
                if (result.status === "Success") {
                    setShowConfetti(true);
                }

            } catch (err) {
                setError("Đã có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.");
                console.error(err);

                // Even if payment verification fails, try to update booking as failed if we have required info
                const queryParams = new URLSearchParams(location.search);
                const vnpTxnRef = queryParams.get('vnp_TxnRef');
                const bookingId = getBookingIdFromStorage();

                if (bookingId && vnpTxnRef) {
                    await updateBookingStatus(bookingId, vnpTxnRef, "Failed");
                }
            } finally {
                setLoading(false);
            }
        };

        confirmBooking();
    }, [location.search]);

    const handleReturnToHome = () => {
        localStorage.removeItem('pendingBooking');
        navigate("/");
    };

    const handleTryAgain = () => {
        navigate("/checkout");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col">
            <NavBar />

            {/* Show confetti when payment is successful */}
            {showConfetti && <Confetti />}

            <div className="flex-1 flex items-center justify-center p-4 pt-20 pb-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mb-4"></div>
                        <p className="text-lg text-gray-300">Đang xử lý thanh toán...</p>
                    </div>
                ) : error ? (
                    <div className="text-center p-8 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-xl w-full max-w-md shadow-2xl border border-gray-700">
                        <div className="animate-shake">
                            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100 text-red-500 mb-6">
                                <XCircle className="h-12 w-12" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Thanh toán thất bại</h2>
                        <p className="text-gray-300 mb-6">{error}</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleReturnToHome}
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-300 shadow-lg transform hover:scale-105 active:scale-95"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                ) : paymentResult?.status === "Success" ? (
                    <div className="text-center p-8 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-xl w-full max-w-md shadow-2xl border border-gray-700">
                        <div className="animate-bounce-once">
                            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 text-green-500 mb-6">
                                <CheckCircle className="h-12 w-12" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold mb-6 text-green-400">Thanh toán thành công</h2>
                        <div className="bg-gray-900 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400">Mã giao dịch:</span>
                                <span className="font-semibold">{paymentResult.transactionId}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400">Số tiền:</span>
                                <span className="font-semibold text-green-400">
                                    {(parseInt(paymentResult.amount || "0") / 100).toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND"
                                    }).replace("₫", "đ")}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Thông tin:</span>
                                <span className="font-semibold">{paymentResult.orderInfo}</span>
                            </div>
                        </div>
                        <p className="text-gray-300 mb-6 animate-fade-in">
                            Vé của bạn đã được xác nhận và gửi vào email đã đăng ký.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleReturnToHome}
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-300 shadow-lg transform hover:scale-105 active:scale-95"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-8 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-xl w-full max-w-md shadow-2xl border border-gray-700 ">
                        <div className="animate-shake">
                            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100 text-red-500 mb-6">
                                <XCircle className="h-12 w-12" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Thanh toán thất bại</h2>
                        <p className="text-gray-300 mb-6">
                            {paymentResult?.status === "Failed"
                                ? "Giao dịch không thành công. Vui lòng thử lại."
                                : "Xác minh giao dịch không hợp lệ."}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleReturnToHome}
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-300 shadow-lg transform hover:scale-105 active:scale-95"
                            >
                                Về trang chủ
                            </button>
                            <button
                                onClick={handleTryAgain}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300 shadow-lg transform hover:scale-105 active:scale-95"
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* CSS Animations */}
            <style jsx>{`
        .animate-bounce-once {
          animation: bounce 1s ease;
        }
        
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        
        .animate-confetti {
          position: absolute;
          animation: confetti-fall linear forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease forwards;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>

            <Footer />
        </div>
    );
}