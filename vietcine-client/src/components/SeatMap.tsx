import React, { useState, useEffect } from "react";
import axios from "axios";

interface Props {
    showtimeId: string;
    selectedSeats: string[];
    onSeatToggle: (seatId: string) => void;
}

interface Seat {
    seatId: string;
    column: number;
    row: string;
    typeName: string;
    price: number;
    status: "available" | "occupied";
}

interface SeatType {
    seatTypeId: number;
    typeName: string;
}

interface Screen {
    screenId: number;
    screenNumber: string;
    name: string;
}

interface SeatRow {
    row: string;
    seats: Seat[];
}

export function SeatMap({ showtimeId, selectedSeats, onSeatToggle }: Props) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [screen, setScreen] = useState<Screen | null>(null);
    const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);

    // Fetch seat data from the database
    useEffect(() => {
        const fetchSeatData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch screen details for the showtime
                const screenResponse = await axios.get(
                    `http://localhost:8081/api/showtimes/${showtimeId}/screen`
                );

                if (!screenResponse.data.success) {
                    throw new Error("Could not load screen details");
                }

                setScreen(screenResponse.data.data);

                // Fetch all seats for this screen with their types
                const seatsResponse = await axios.get(
                    `http://localhost:8081/api/screens/${screenResponse.data.data.screenId}/seats`
                );

                if (!seatsResponse.data.success) {
                    throw new Error("Could not load seats");
                }

                // Fetch booked seats for this showtime
                const bookedSeatsResponse = await axios.get(
                    `http://localhost:8081/api/showtimes/${showtimeId}/booked-seats`
                );

                if (!bookedSeatsResponse.data.success) {
                    throw new Error("Could not load booked seats");
                }

                const bookedSeatIds = bookedSeatsResponse.data.data || [];

                // Fetch seat types
                const seatTypesResponse = await axios.get(
                    `http://localhost:8081/api/seat-types`
                );

                if (!seatTypesResponse.data.success) {
                    throw new Error("Could not load seat types");
                }

                setSeatTypes(seatTypesResponse.data.data);

                // Fetch seat prices with adjustments for current date
                const pricesResponse = await axios.get(
                    `http://localhost:8081/api/showtimes/${showtimeId}/seat-prices`
                );

                if (!pricesResponse.data.success) {
                    throw new Error("Could not load seat prices");
                }

                const seatPrices = pricesResponse.data.data || {};

                // Process seats with status and price information
                const processedSeats = seatsResponse.data.data.map((seat: any) => {
                    const seatId = seat.seatId.toString();

                    return {
                        seatId,
                        column: seat.column,
                        row: getRowLetter(seat.column), // Convert numerical row to letter
                        typeName: seat.typeName,
                        price: seatPrices[seat.seatTypeId] || 0,
                        status: bookedSeatIds.includes(seatId) ? "occupied" : "available"
                    };
                });

                setSeats(processedSeats);
            } catch (err) {
                console.error("Error fetching seat data:", err);
                setError("Failed to load seat data");
            } finally {
                setLoading(false);
            }
        };

        if (showtimeId) {
            fetchSeatData();
        }
    }, [showtimeId]);

    // Function to convert numeric row to letter (1 -> A, 2 -> B, etc.)
    const getRowLetter = (rowNumber: number): string => {
        // Calculate the row letter based on the column value
        // This assumes your seats are stored with a numeric column that represents position
        // You may need to adjust this based on your actual database structure
        const rowIndex = Math.floor((rowNumber - 1) / 12); // Assuming 12 seats per row
        return String.fromCharCode(65 + rowIndex); // 65 is ASCII for 'A'
    };

    // Group seats by row for display
    const groupSeatsByRow = (): SeatRow[] => {
        const rowMap = new Map<string, Seat[]>();

        seats.forEach(seat => {
            if (!rowMap.has(seat.row)) {
                rowMap.set(seat.row, []);
            }
            rowMap.get(seat.row)?.push(seat);
        });

        // Sort seats within each row by column
        rowMap.forEach((rowSeats, row) => {
            rowMap.set(row, rowSeats.sort((a, b) => a.column - b.column));
        });

        // Convert map to array and sort by row
        return Array.from(rowMap.entries())
            .map(([row, seats]) => ({ row, seats }))
            .sort((a, b) => a.row.localeCompare(b.row));
    };

    const seatRows = groupSeatsByRow();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <p className="mt-2">Vui lòng thử lại sau</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            {/* Screen */}
            <div className="relative mb-10 mx-auto">
                <div className="w-4/5 h-8 bg-gray-800 mx-auto rounded-t-full"></div>
                <div className="text-center text-gray-400 text-sm mt-2">Màn hình</div>
                {screen && (
                    <div className="text-center text-sm mt-1">
                        {screen.name} - Phòng {screen.screenNumber}
                    </div>
                )}
            </div>

            {/* Seat type legend */}
            <div className="flex justify-center gap-6 mb-6">
                {seatTypes.map(type => (
                    <div key={type.seatTypeId} className="flex items-center">
                        <div className={`w-4 h-4 rounded mr-2 ${getSeatTypeColor(type.typeName)}`}></div>
                        <span className="text-sm">{type.typeName}</span>
                    </div>
                ))}
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded mr-2 bg-gray-500"></div>
                    <span className="text-sm">Đã đặt</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded mr-2 bg-red-600"></div>
                    <span className="text-sm">Đang chọn</span>
                </div>
            </div>

            {/* Seat rows */}
            <div className="grid gap-2 mb-6 max-w-3xl mx-auto">
                {seatRows.map((row) => (
                    <div key={row.row} className="flex items-center">
                        <div className="w-6 flex-shrink-0 font-medium">{row.row}</div>
                        <div className="flex justify-center flex-grow gap-1">
                            {row.seats.map((seat) => {
                                const isSelected = selectedSeats.includes(seat.seatId);
                                const isOccupied = seat.status === "occupied";

                                return (
                                    <button
                                        key={seat.seatId}
                                        disabled={isOccupied}
                                        className={`w-6 h-6 flex items-center justify-center text-xs rounded-t-md transition-colors ${isOccupied
                                                ? "bg-gray-500 cursor-not-allowed"
                                                : isSelected
                                                    ? "bg-red-600 text-white"
                                                    : `${getSeatTypeColor(seat.typeName)} hover:opacity-80`
                                            }`}
                                        onClick={() => !isOccupied && onSeatToggle(seat.seatId)}
                                        title={`${seat.typeName}: ${formatPrice(seat.price)}`}
                                    >
                                        {seat.column % 12 || 12}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="w-6 flex-shrink-0 font-medium">{row.row}</div>
                    </div>
                ))}
            </div>

            {/* Price information */}
            <div className="mt-6 text-center text-sm">
                {seatTypes.map(type => (
                    <div key={type.seatTypeId} className="inline-block mx-2">
                        <span className="font-semibold">{type.typeName}:</span> Từ {formatPrice(getMinPriceForType(type.typeName))}
                    </div>
                ))}
            </div>
        </div>
    );

    // Helper function to get CSS color class based on seat type
    function getSeatTypeColor(typeName: string): string {
        switch (typeName.toLowerCase()) {
            case "vip":
                return "bg-yellow-500 text-black";
            case "couple":
                return "bg-pink-500 text-white";
            case "premium":
                return "bg-purple-500 text-white";
            case "standard":
            default:
                return "bg-blue-500 text-white";
        }
    }

    // Helper function to format price in VND
    function formatPrice(price: number): string {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    // Helper function to get minimum price for a seat type
    function getMinPriceForType(typeName: string): number {
        const typePrices = seats
            .filter(seat => seat.typeName === typeName)
            .map(seat => seat.price);

        return typePrices.length > 0 ? Math.min(...typePrices) : 0;
    }
}