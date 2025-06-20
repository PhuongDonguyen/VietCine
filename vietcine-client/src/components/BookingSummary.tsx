import { CreditCard, Ticket, Tag, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface Showtime {
  id: number;
  movieId: number;
  movieTitle: string;
  time: string;
  date: string;
  theater: string;
  screen: string;
  screenId?: number;
  theaterBrandId: number; // Make this required for voucher fetching
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

interface Props {
  showtime: Showtime;
  selectedSeats: SelectedSeat[];
  totalAmount: string;
  onProceedToPayment: () => void;
  seatTypes: SeatType[];
  userId: number; // Add userId prop
  onVoucherSelect?: (voucher: Voucher | null) => void; // Add callback for voucher selection
}

export function BookingSummary({
  showtime,
  selectedSeats,
  totalAmount,
  onProceedToPayment,
  seatTypes,
  userId,
  onVoucherSelect,
}: Props) {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isVoucherDropdownOpen, setIsVoucherDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calculate subtotal (before discount)
  const subtotal = selectedSeats.reduce((total, seat) => total + seat.price, 0);

  // Group seats by their type
  const seatsByType: {
    [typeId: number]: { count: number; price: number; typeName: string };
  } = {};

  selectedSeats.forEach((seat) => {
    if (!seatsByType[seat.seatTypeId]) {
      const seatType = seatTypes.find(
        (type) => type.seatTypeId === seat.seatTypeId
      );
      seatsByType[seat.seatTypeId] = {
        count: 0,
        price: seat.price,
        typeName: seatType ? seatType.typeName : "Unknown",
      };
    }
    seatsByType[seat.seatTypeId].count++;
  });

  // Fetch vouchers when seats are selected
  useEffect(() => {
    const fetchVouchers = async () => {
      if (selectedSeats.length === 0) {
        setVouchers([]);
        setSelectedVoucher(null);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8081/api/vouchers/active?userId=${userId}&theaterBrandId=${showtime.theaterBrandId}`
        );

        if (response.data.success) {
          // Filter vouchers that can be applied (minBillPrice <= subtotal)
          const applicableVouchers = response.data.data.filter(
            (voucher: Voucher) =>
              voucher.minBillPrice <= subtotal && !voucher.isUsed
          );
          setVouchers(applicableVouchers);
        } else {
          setVouchers([]);
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
        setVouchers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [selectedSeats, subtotal, userId, showtime.theaterBrandId]);

  // Handle voucher selection
  const handleVoucherSelect = (voucher: Voucher | null) => {
    setSelectedVoucher(voucher);
    setIsVoucherDropdownOpen(false);
    onVoucherSelect?.(voucher);
  };

  // Calculate final total with discount
  const discount = selectedVoucher ? selectedVoucher.discount : 0;
  const finalTotal = subtotal - discount;

  // Format price in VND
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("₫", "đ");
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
            {new Date(showtime.date).toLocaleDateString("vi-VN", {
              weekday: "short",
              day: "numeric",
              month: "numeric",
            })}{" "}
            | {showtime.time}
          </p>
        </div>

        <div>
          <h3 className="text-gray-400 text-sm mb-1">Ghế</h3>
          {selectedSeats.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedSeats.map((seat) => (
                <span
                  key={seat.SeatId}
                  className="bg-gray-800 px-2 py-1 rounded text-sm"
                >
                  {seat.SeatNumber}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Chưa chọn ghế</p>
          )}
        </div>
      </div>

      {/* Voucher Selection Section */}
      {selectedSeats.length > 0 && (
        <div className="mb-4 border-b border-gray-800 pb-4">
          <h3 className="text-gray-400 text-sm mb-2 flex items-center">
            <Tag className="h-4 w-4 mr-1" />
            Voucher giảm giá
          </h3>

          <div className="relative">
            <button
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-left flex justify-between items-center hover:bg-gray-750 transition-colors"
              onClick={() => setIsVoucherDropdownOpen(!isVoucherDropdownOpen)}
              disabled={loading || vouchers.length === 0}
            >
              <span
                className={selectedVoucher ? "text-white" : "text-gray-400"}
              >
                {loading
                  ? "Đang tải..."
                  : selectedVoucher
                  ? selectedVoucher.description
                  : vouchers.length === 0
                  ? "Không có voucher khả dụng"
                  : "Chọn voucher"}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isVoucherDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isVoucherDropdownOpen && vouchers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto">
                <button
                  className="w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors border-b border-gray-700"
                  onClick={() => handleVoucherSelect(null)}
                >
                  <span className="text-gray-400">Không sử dụng voucher</span>
                </button>
                {vouchers.map((voucher) => (
                  <button
                    key={voucher.voucherId}
                    className="w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors"
                    onClick={() => handleVoucherSelect(voucher)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">
                          {voucher.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          Giảm {formatPrice(voucher.discount)} • Tối thiểu{" "}
                          {formatPrice(voucher.minBillPrice)}
                        </p>
                      </div>
                      {selectedVoucher?.voucherId === voucher.voucherId && (
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6">
        {/* Display each seat type separately */}
        {Object.values(seatsByType).map((typeInfo, index) => (
          <div key={index} className="flex justify-between">
            <h3 className="text-gray-400">
              {typeInfo.typeName} ({typeInfo.count} ghế)
            </h3>
            <p className="font-medium">
              {formatPrice(typeInfo.price)} × {typeInfo.count}
            </p>
          </div>
        ))}

        {/* Subtotal */}
        <div className="flex justify-between">
          <h3 className="text-gray-400">Tạm tính</h3>
          <p className="font-medium">{formatPrice(subtotal)}</p>
        </div>

        {/* Discount */}
        {selectedVoucher && (
          <div className="flex justify-between text-green-500">
            <h3>Giảm giá ({selectedVoucher.description})</h3>
            <p>-{formatPrice(discount)}</p>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between text-lg font-semibold border-t border-gray-800 pt-4">
          <h3>Tổng cộng</h3>
          <p className="text-red-600">{formatPrice(finalTotal)}</p>
        </div>
      </div>

      <button
        data-testid="proceed-to-payment-btn"
        className={`w-full py-3 rounded-md flex items-center justify-center gap-2 transition duration-300 ${
          selectedSeats.length > 0
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }`}
        disabled={selectedSeats.length === 0}
        onClick={selectedSeats.length > 0 ? onProceedToPayment : undefined}
      >
        <CreditCard className="h-5 w-5" />
        Mua vé
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Bằng cách nhấn vào "Thanh toán", bạn đồng ý với các Điều khoản và Điều
        kiện của chúng tôi.
      </p>
    </div>
  );
}
