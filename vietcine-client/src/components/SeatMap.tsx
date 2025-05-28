import React, { useState, useEffect } from "react";
import axios from "axios";

interface SelectedSeat {
    SeatId: number;
    SeatNumber: string;
    seatTypeId?: number;
    price?: number;
}

interface Props {
    showtimeId: string;
    selectedSeats: SelectedSeat[];
    onSeatToggle: (seatId: number, seatNumber: string, seatTypeId: number) => void;
}

interface Seat {
    seatId: number;
    row: string;
    column: number;
    bookingId: number | null;
    showtimeId: number;
    seatTypeId: number;
    screenId: number;
    available: boolean;
}

interface SeatType {
    seatTypeId: number;
    typeName: string;
    price: number;
    priceIncrease: number;
    totalPrice: number;
}

interface SeatRow {
    row: string;
    seats: Seat[];
}

export function SeatMap({ showtimeId, selectedSeats, onSeatToggle }: Props) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
    const [seatRows, setSeatRows] = useState<SeatRow[]>([]);
    const [maxColumns, setMaxColumns] = useState(0);
    const [minColumn, setMinColumn] = useState(1);

    // Fetch seat data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch seats for this showtime
                const seatsResponse = await axios.get(
                    `http://localhost:8081/api/seats/showtime/${showtimeId}`
                );

                if (!seatsResponse.data.success) {
                    throw new Error("Could not load seats");
                }

                const seatsData = seatsResponse.data.data;
                setSeats(seatsData);

                // Find the minimum and maximum column numbers
                const minCol = Math.min(...seatsData.map((seat: Seat) => seat.column));
                const maxCol = Math.max(...seatsData.map((seat: Seat) => seat.column));
                setMinColumn(minCol);
                setMaxColumns(maxCol);

                // Group seats by row
                const rows = organizeSeatsIntoRows(seatsData);
                setSeatRows(rows);

                // Get screenId from the first seat to fetch seat types
                if (seatsData.length > 0) {
                    const screenId = seatsData[0].screenId;

                    // Fetch seat types for this screen
                    const seatTypesResponse = await axios.get(
                        `http://localhost:8081/api/seattypes?screenId=${screenId}`
                    );

                    if (!seatTypesResponse.data.success) {
                        throw new Error("Could not load seat types");
                    }

                    const seatTypesData = seatTypesResponse.data.data;
                    console.log("Fetched seat types:", seatTypesData); // Debug log
                    setSeatTypes(seatTypesData);
                }
            } catch (err) {
                console.error("Error fetching seat data:", err);
                setError("Failed to load seat data");
            } finally {
                setLoading(false);
            }
        };

        if (showtimeId) {
            fetchData();
        }
    }, [showtimeId]);

    // Organize seats into rows
    const organizeSeatsIntoRows = (seats: Seat[]): SeatRow[] => {
        const rowMap: { [key: string]: Seat[] } = {};

        // Group seats by row
        seats.forEach(seat => {
            if (!rowMap[seat.row]) {
                rowMap[seat.row] = [];
            }
            rowMap[seat.row].push(seat);
        });

        // Sort rows alphabetically
        const sortedRows = Object.keys(rowMap).sort();

        // Create row objects with sorted seats
        return sortedRows.map(row => ({
            row,
            seats: rowMap[row].sort((a, b) => a.column - b.column)
        }));
    };

    // Check if a seat is selected
    const isSeatSelected = (seatId: number): boolean => {
        return selectedSeats.some(seat => seat.SeatId === seatId);
    };

    // Handle seat click - Pass seat type ID to the parent component
    const handleSeatClick = (seat: Seat) => {
        if (seat.available) {
            onSeatToggle(seat.seatId, seat.row + seat.column.toString(), seat.seatTypeId);
        }
    };

    // Format price in VND
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price).replace("₫", "đ");
    };

    // Get seat type information
    const getSeatTypeName = (seatTypeId: number): string => {
        const seatType = seatTypes.find(type => type.seatTypeId === seatTypeId);
        if (!seatType) {
            console.warn(`No seat type found for seatTypeId: ${seatTypeId}`);
            return "Unknown Seat Type";
        }
        return seatType.typeName;
    };

    // Get seat type color
    const getSeatTypeColor = (seatTypeId: number): string => {
        switch (seatTypeId) {
            case 1: // Regular seat
                return "bg-purple-700 hover:bg-purple-800";
            case 2: // VIP seat
                return "bg-red-600 hover:bg-red-700";
            case 3: // Double seat
                return "bg-pink-600 hover:bg-pink-700";
            default:
                return "bg-gray-500";
        }
    };

    // Get seat class based on its state
    const getSeatClass = (seat: Seat): string => {
        if (!seat.available) {
            return "bg-gray-400 cursor-not-allowed pointer-events-none";
        }

        if (isSeatSelected(seat.seatId)) {
            return "bg-blue-900 hover:bg-blue-950 border border-gray-300";
        }

        return getSeatTypeColor(seat.seatTypeId);
    };

    if (loading) {
        return <div className="text-center py-6">Loading seat map...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-6">{error}</div>;
    }

    // Calculate seat positions
    const calculateSeatPositions = () => {
        const maxCol = Math.max(...seats.map(seat => seat.seatTypeId === 3 ? seat.column + 1 : seat.column));
        const seatUnitWidth = 46; // Width of one seat unit in pixels

        return {
            maxCol,
            seatUnitWidth
        };
    };

    const { maxCol, seatUnitWidth } = calculateSeatPositions();

    return (
        <div className="overflow-x-auto bg-gray-900 p-4">
            {/* Screen */}
            <div className="relative mb-10 mx-auto">
                <div className="w-4/5 h-8 bg-gray-800 mx-auto rounded-t-full"></div>
                <div className="text-center text-gray-400 text-sm mt-2">Màn hình</div>
            </div>

            {/* Seat container */}
            <div className="flex flex-col items-center mb-6">
                {/* Render each row */}
                {seatRows.map(row => (
                    <div key={row.row} className="flex items-center mb-1 relative w-full justify-center">
                        <div className="w-6 font-bold text-center mr-4 text-white">{row.row}</div>

                        {/* Container for all seats in this row with absolute positioning */}
                        <div className="relative flex h-10" style={{ width: `${maxCol * seatUnitWidth}px` }}>
                            {row.seats.map(seat => {
                                const isDoubleSeat = seat.seatTypeId === 3;
                                const seatWidth = isDoubleSeat ? "w-20" : "w-8";

                                // Updated label format for double seats: "J3 - J4" instead of "J3-4"
                                const displayLabel = isDoubleSeat
                                    ? `${seat.row}${seat.column} - ${seat.row}${seat.column + 1}`
                                    : `${seat.row}${seat.column}`;

                                // Calculate left position based on column number (0-indexed)
                                const leftPosition = (seat.column - 1) * seatUnitWidth;

                                return (
                                    <div
                                        key={`seat-${seat.row}${seat.column}`}
                                        className={`absolute ${seatWidth} h-8 rounded ${getSeatClass(seat)} text-white text-center flex items-center justify-center ${seat.available ? "cursor-pointer" : "cursor-not-allowed pointer-events-none"
                                            }`}
                                        style={{ left: `${leftPosition}px` }}
                                        onClick={seat.available ? () => handleSeatClick(seat) : undefined}
                                        title={`${displayLabel} - ${getSeatTypeName(seat.seatTypeId)}`}
                                    >
                                        {displayLabel}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Price information */}
            <div className="mt-6 text-center text-sm flex justify-center gap-4">
                {seatTypes.map(type => (
                    <div key={type.seatTypeId} className="text-white">
                        <span className="font-semibold">{type.typeName}:</span> {formatPrice(type.totalPrice)}
                    </div>
                ))}
            </div>
        </div>
    );
}