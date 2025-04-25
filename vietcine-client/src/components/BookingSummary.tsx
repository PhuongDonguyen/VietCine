import { CreditCard, Ticket } from "lucide-react";

interface Showtime {
    id: number;
    movieId: number;
    movieTitle: string;
    time: string;
    date: string;
    theater: string;
    screen: string;
}

interface SeatType {
    seatTypeId: number;
    typeName: string;
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

interface Props {
    showtime: Showtime;
    selectedSeats: SelectedSeat[];
    totalAmount: string;
    onProceedToPayment: () => void;
    seatTypes: SeatType[];
}

export function BookingSummary({ showtime, selectedSeats, totalAmount, onProceedToPayment, seatTypes }: Props) {
    // Group seats by their type
    const seatsByType: { [typeId: number]: { count: number, price: number, typeName: string } } = {};

    selectedSeats.forEach(seat => {
        if (!seatsByType[seat.seatTypeId]) {
            const seatType = seatTypes.find(type => type.seatTypeId === seat.seatTypeId);
            seatsByType[seat.seatTypeId] = {
                count: 0,
                price: seat.price,
                typeName: seatType ? seatType.typeName : "Unknown"
            };
        }
        seatsByType[seat.seatTypeId].count++;
    });

    // Format price in VND
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price).replace("₫", "đ");
    };

    return (
        <div className="bg-gray-900 rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Ticket className="h-5 w-5 mr-2 text-red-600" />
                Chi tiết đặt vé
            </h2>

            <div className="space-y-4 border-b border-gray-800 pb-4 mb-4">
                <div>
                    <h3 className="text-gray-400 text-sm mb-1">Phim</h3>
                    <p className="font-medium">{showtime.movieTitle}</p>
                </div>

                <div>
                    <h3 className="text-gray-400 text-sm mb-1">Rạp chiếu</h3>
                    <p className="font-medium">{showtime.theater}</p>
                    <p className="text-sm text-gray-400">{showtime.screen}</p>
                </div>

                <div>
                    <h3 className="text-gray-400 text-sm mb-1">Suất chiếu</h3>
                    <p className="font-medium">
                        {new Date(showtime.date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })} | {showtime.time}
                    </p>
                </div>

                <div>
                    <h3 className="text-gray-400 text-sm mb-1">Ghế</h3>
                    {selectedSeats.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {selectedSeats.map(seat => (
                                <span key={seat.SeatId} className="bg-gray-800 px-2 py-1 rounded text-sm">
                                    {seat.SeatNumber}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Chưa chọn ghế</p>
                    )}
                </div>
            </div>

            <div className="space-y-4 mb-6">
                {/* Display each seat type separately */}
                {Object.values(seatsByType).map((typeInfo, index) => (
                    <div key={index} className="flex justify-between">
                        <h3 className="text-gray-400">{typeInfo.typeName} ({typeInfo.count} ghế)</h3>
                        <p className="font-medium">{formatPrice(typeInfo.price)} × {typeInfo.count}</p>
                    </div>
                ))}

                <div className="flex justify-between">
                    <h3 className="text-gray-400">Phí dịch vụ</h3>
                    <p className="font-medium">Miễn phí</p>
                </div>

                <div className="flex justify-between text-lg font-semibold">
                    <h3>Tổng cộng</h3>
                    <p className="text-red-600">{totalAmount}</p>
                </div>
            </div>

            <button
                className={`w-full py-3 rounded-md flex items-center justify-center gap-2 transition duration-300 ${selectedSeats.length > 0 ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                disabled={selectedSeats.length === 0}
                onClick={selectedSeats.length > 0 ? onProceedToPayment : undefined}
            >
                <CreditCard className="h-5 w-5" />
                Thanh toán
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
                Bằng cách nhấn vào "Thanh toán", bạn đồng ý với các Điều khoản và Điều kiện của chúng tôi.
            </p>
        </div>
    );
}