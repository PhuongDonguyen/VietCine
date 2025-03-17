import React from "react";

interface Props {
    selectedSeats: string[];
    onSeatToggle: (seatId: string) => void;
}

interface Seat {
    id: string;
    row: string;
    number: number;
    status: "available" | "occupied" | "vip";
}

export function SeatMap({ selectedSeats, onSeatToggle }: Props) {
    // Generate a cinema seat map
    const generateSeats = (): Seat[] => {
        const seats: Seat[] = [];
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'];
        const occupiedSeats = [
            'A3', 'A4', 'A5', 'B5', 'B6', 'C2', 'C3', 'D7', 'D8', 'D9',
            'E1', 'E2', 'F4', 'F5', 'F6', 'G8', 'G9', 'H1', 'H2', 'J5', 'J6'
        ];
        const vipSeats = [
            'D3', 'D4', 'D5', 'D6', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8',
            'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'G3', 'G4', 'G5', 'G6', 'G7'
        ];

        for (const row of rows) {
            for (let num = 1; num <= 12; num++) {
                const seatId = `${row}${num}`;
                let status: "available" | "occupied" | "vip" = "available";

                if (occupiedSeats.includes(seatId)) {
                    status = "occupied";
                } else if (vipSeats.includes(seatId)) {
                    status = "vip";
                }

                seats.push({
                    id: seatId,
                    row,
                    number: num,
                    status
                });
            }
        }

        return seats;
    };

    const seats = generateSeats();
    const rows = Array.from(new Set(seats.map(seat => seat.row)));

    const getSeatsByRow = (row: string) => {
        return seats.filter(seat => seat.row === row);
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
                {rows.map(row => (
                    <div key={row} className="flex items-center">
                        <div className="w-6 flex-shrink-0 font-medium">{row}</div>
                        <div className="flex justify-center flex-grow gap-1">
                            {getSeatsByRow(row).map(seat => {
                                const isSelected = selectedSeats.includes(seat.id);
                                const isOccupied = seat.status === "occupied";
                                const isVip = seat.status === "vip";

                                return (
                                    <button
                                        key={seat.id}
                                        disabled={isOccupied}
                                        className={`w-6 h-6 flex items-center justify-center text-xs rounded-t-md cursor-pointer transition-colors ${isOccupied ? 'bg-gray-500 cursor-not-allowed' : isSelected ? 'bg-red-600 text-white' : isVip ? 'bg-yellow-500 text-black' : 'bg-gray-700 hover:bg-gray-600'}`}
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
