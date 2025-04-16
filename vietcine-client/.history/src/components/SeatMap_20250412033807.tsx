import React from "react";

interface Props {
    totalSeats: number; // Total number of seats in the screen
    bookedSeats: string[]; // Seats that are already booked
    selectedSeats: string[]; // Seats selected by the user
    onSeatToggle: (seatId: string) => void; // Callback to toggle seat selection
}

interface Seat {
    id: string;
    row: string;
    number: number;
    status: "available" | "occupied" | "vip";
}

export function SeatMap({ totalSeats, bookedSeats, selectedSeats, onSeatToggle }: Props) {
    // Generate a cinema seat map dynamically based on totalSeats
    const generateSeats = (): Seat[] => {
        const seats: Seat[] = [];
        const seatsPerRow = 12; // Define seats per row (adjustable)
        const rowsCount = Math.ceil(totalSeats / seatsPerRow); // Calculate number of rows
        const rows = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").slice(0, rowsCount); // Generate row labels (A, B, C, ...)

        for (const row of rows) {
            const seatsInThisRow = Math.min(
                seatsPerRow,
                totalSeats - (rows.indexOf(row) * seatsPerRow)
            ); // Calculate seats in this row
            for (let num = 1; num <= seatsInThisRow; num++) {
                const seatId = `${row}${num}`;
                let status: "available" | "occupied" | "vip" = "available";

                // Check if the seat is booked
                if (bookedSeats.includes(seatId)) {
                    status = "occupied";
                }
                // Define VIP seats (e.g., rows D, E, F, G)
                else if (["D", "E", "F", "G"].includes(row)) {
                    status = "vip";
                }

                seats.push({
                    id: seatId,
                    row,
                    number: num,
                    status,
                });
            }
        }

        return seats;
    };

    const seats = generateSeats();
    const rows = Array.from(new Set(seats.map((seat) => seat.row)));

    const getSeatsByRow = (row: string) => {
        return seats.filter((seat) => seat.row === row);
    };

    return (
        <div className="overflow-x-auto">
            {/* Screen */}
            <div className="relative mb-10 mx-auto">
                <div className="w-[80%] h-8 bg-gray-800 mx-auto rounded-t-full"></div>
                <div className="text-center text-gray-400 text-sm mt-2">Màn hình</div>
            </div>

            {/* Seat rows */}
            <div className="grid gap-2 mb-6 max-w-3xl mx-auto">
                {rows.map((row) => (
                    <div key={row} className="flex items-center">
                        <div className="w-6 flex-shrink-0 font-medium">{row}</div>
                        <div className="flex justify-center flex-grow gap-1">
                            {getSeatsByRow(row).map((seat) => {
                                const isSelected = selectedSeats.includes(seat.id);
                                const isOccupied = seat.status === "occupied";
                                const isVip = seat.status === "vip";

                                return (
                                    <button
                                        key={seat.id}
                                        disabled={isOccupied}
                                        className={`w-6 h-6 flex items-center justify-center text-xs rounded-t-md transition-colors ${isOccupied
                                                ? "bg-gray-500 cursor-not-allowed"
                                                : isSelected
                                                    ? "bg-red-600 text-white"
                                                    : isVip
                                                        ? "bg-yellow-500 text-black hover:bg-yellow-600"
                                                        : "bg-gray-700 hover:bg-gray-600"
                                            }`}
                                        onClick={() => !isOccupied && onSeatToggle(seat.id)}
                                    >
                                        {seat.number}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="w-6 flex-shrink-0 font-medium">{row}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}