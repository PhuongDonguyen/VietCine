import React from "react";

interface Seat {
    id: number;
    row: number;
    column: number;
    seatType: string;
    price: number;
    isAvailable: boolean;
}

interface Props {
    screenId: number;
    showtimeId: number;
    selectedSeats: number[];
    onSeatToggle: (seatId: number) => void;
}

export function SeatMap({ screenId, showtimeId, selectedSeats, onSeatToggle }: Props) {
    const [seatGrid, setSeatGrid] = React.useState<Seat[][]>([]);
    const [maxRow, setMaxRow] = React.useState(0);
    const [maxColumn, setMaxColumn] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchSeats = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch seat data for the screen and showtime
                const response = await fetch(
                    `http://localhost:8081/api/screens/${screenId}/seats?showtimeId=${showtimeId}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch seat data");
                }
                const data = await response.json();

                // Transform flat seat list into a grid
                const grid = Array.from({ length: data.maxRow }, () => Array(data.maxColumn).fill(null));
                data.seats.forEach((seat: Seat) => {
                    grid[seat.row - 1][seat.column - 1] = {
                        id: seat.id,
                        seatType: seat.seatType,
                        price: seat.price,
                        isAvailable: seat.isAvailable,
                    };
                });

                setSeatGrid(grid);
                setMaxRow(data.maxRow);
                setMaxColumn(data.maxColumn);
            } catch (err) {
                setError("Failed to load seats. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSeats();
    }, [screenId, showtimeId]);

    const handleSeatClick = (seat: Seat) => {
        if (seat && seat.isAvailable) {
            onSeatToggle(seat.id);
        }
    };

    if (loading) {
        return <div className="text-center text-gray-400">Loading seats...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="overflow-x-auto">
            {/* Screen */}
            <div className="relative mb-10 mx-auto">
                <div className="w-[80%] h-8 bg-gray-800 mx-auto rounded-t-full"></div>
                <div className="text-center text-gray-400 text-sm mt-2">Màn hình</div>
            </div>

            {/* Seat grid */}
            <div className="grid gap-2 mb-6 max-w-3xl mx-auto">
                {seatGrid.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center">
                        <div className="w-6 flex-shrink-0 font-medium">
                            {String.fromCharCode(65 + rowIndex)}
                        </div>
                        <div className="flex justify-center flex-grow gap-1">
                            {row.map((seat, colIndex) => {
                                const isSelected = seat && selectedSeats.includes(seat.id);
                                const isOccupied = seat && !seat.isAvailable;
                                const isCouple = seat && seat.seatType === "Couple";

                                return (
                                    <button
                                        key={seat ? seat.id : `${rowIndex}-${colIndex}`}
                                        disabled={!seat || isOccupied}
                                        className={`flex items-center justify-center text-xs rounded-t-md transition-colors
                      ${!seat ? "bg-transparent cursor-default" : ""}
                      ${isOccupied ? "bg-gray-500 cursor-not-allowed" : ""}
                      ${isSelected ? "bg-red-600 text-white" : ""}
                      ${seat && !isSelected && !isOccupied && seat.seatType === "Normal" ? "bg-gray-700 hover:bg-gray-600" : ""}
                      ${seat && !isSelected && !isOccupied && seat.seatType === "VIP" ? "bg-yellow-500 text-black hover:bg-yellow-600" : ""}
                      ${seat && !isSelected && !isOccupied && isCouple ? "bg-pink-500 text-white hover:bg-pink-600 w-12" : ""}
                      ${!isCouple ? "w-6 h-6" : "w-12 h-6"}`}
                                        onClick={() => handleSeatClick(seat)}
                                    >
                                        {seat ? `${colIndex + 1}` : ""}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="w-6 flex-shrink-0 font-medium">
                            {String.fromCharCode(65 + rowIndex)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Chú thích</h3>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-700 rounded-t-md mr-2"></div>
                        <span className="text-sm">Ghế thường</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-yellow-500 rounded-t-md mr-2"></div>
                        <span className="text-sm">Ghế VIP</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-12 h-6 bg-pink-500 rounded-t-md mr-2"></div>
                        <span className="text-sm">Ghế đôi</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-red-600 rounded-t-md mr-2"></div>
                        <span className="text-sm">Ghế đã chọn</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-500 rounded-t-md mr-2"></div>
                        <span className="text-sm">Ghế đã bán</span>
                    </div>
                </div>
            </div>
        </div>
    );
}