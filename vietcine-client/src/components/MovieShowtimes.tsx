import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import axios from "axios";

interface Showtime {
    id: number;
    startTime: string; // e.g., "2025-04-12T14:00:00Z"
    endTime: string;
    screen: {
        screenId: number | null;
        screenNumber: string;
        totalSeats: number;
        theater: {
            theaterId: number | null;
            name: string;
            address: string;
            city: string;
        };
    };
}

interface Theater {
    name: string;
    address: string;
    city: string;
    showTimes: Showtime[];
}

interface Props {
    movieId: number;
    movieTitle: string;
}

export function MovieShowtimes({ movieId, movieTitle }: Props) {
    const navigate = useNavigate();
    const today = new Date();

    // Format today in Vietnam timezone (UTC+7)
    const formattedToday = today.toLocaleDateString("en-CA", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }); // Format: YYYY-MM-DD

    const [selectedDate, setSelectedDate] = useState<string>(formattedToday);
    const [selectedTheater, setSelectedTheater] = useState<string>("");
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Generate dates for the next 7 days in Vietnam timezone
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const dateStr = date.toLocaleDateString("en-CA", {
            timeZone: "Asia/Ho_Chi_Minh",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }); // Format: YYYY-MM-DD

        const displayDate = date.toLocaleDateString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            weekday: "short",
            day: "numeric",
            month: "numeric",
        });

        dates.push({
            value: dateStr,
            display: displayDate,
        });
    }

    // Fetch showtimes from backend
    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`http://localhost:8081/api/showtimes/${movieId}`);
                if (response.data.success) {
                    const showtimes: Showtime[] = response.data.data;

                    // Group showtimes by theater
                    const groupedByTheater = showtimes.reduce((acc, showtime) => {
                        const theaterName = showtime.screen.theater.name;
                        if (!acc[theaterName]) {
                            acc[theaterName] = {
                                name: theaterName,
                                address: showtime.screen.theater.address,
                                city: showtime.screen.theater.city,
                                showTimes: [],
                            };
                        }
                        acc[theaterName].showTimes.push(showtime);
                        return acc;
                    }, {} as Record<string, Theater>);

                    const theaterArray = Object.values(groupedByTheater);
                    setTheaters(theaterArray);

                    // Debug logging
                    console.log("Selected date:", selectedDate);
                    console.log("Fetched showtimes:", showtimes);
                } else {
                    setError("Could not load showtimes");
                }
            } catch (err) {
                setError("Failed to fetch showtimes");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchShowtimes();
    }, [movieId]);

    const handleSelectTheater = (theaterName: string) => {
        setSelectedTheater(theaterName === selectedTheater ? "" : theaterName);
    };

    const handleBookTicket = (showtimeId: number) => {
        navigate(`/seat-selection?movieId=${movieId}&showtimeId=${showtimeId}`);
    };

    // Filter showtimes by selected date
    const filteredTheaters = theaters
        .map((theater) => ({
            ...theater,
            showTimes: theater.showTimes.filter((showtime) => {
                // Create date object from the UTC timestamp
                const showtimeDate = new Date(showtime.startTime);

                // Format the date in Vietnam timezone
                const showtimeDateStr = showtimeDate.toLocaleDateString("en-CA", {
                    timeZone: "Asia/Ho_Chi_Minh",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                });

                // Debug logs
                console.log(`Showtime ${showtime.id} date: ${showtimeDateStr}, Selected: ${selectedDate}, Match: ${showtimeDateStr === selectedDate}`);

                return showtimeDateStr === selectedDate;
            }),
        }))
        .filter((theater) => theater.showTimes.length > 0);

    if (loading) return <div className="text-white">Loading showtimes...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-semibold mb-4">Lịch chiếu: {movieTitle}</h3>

            <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-red-600 mr-2" />
                    <h3 className="text-lg font-medium">Chọn ngày</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
                    {dates.map((date, index) => (
                        <button
                            key={index}
                            className={`py-2 px-4 rounded-md text-center transition-colors ${selectedDate === date.value
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                }`}
                            onClick={() => setSelectedDate(date.value)}
                        >
                            {date.display}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center mb-4">
                    <MapPin className="h-5 w-5 text-red-600 mr-2" />
                    <h3 className="text-lg font-medium">Rạp chiếu phim tại TP. Hồ Chí Minh</h3>
                </div>

                {filteredTheaters.length === 0 ? (
                    <div className="bg-gray-900 rounded-lg p-6 text-center">
                        <p className="text-gray-400">Không có suất chiếu nào cho ngày này</p>
                    </div>
                ) : (
                    filteredTheaters.map((theater) => (
                        <div key={theater.name} className="bg-gray-900 rounded-lg overflow-hidden">
                            <div
                                className={`p-4 flex justify-between items-center cursor-pointer ${selectedTheater === theater.name ? "bg-gray-800" : ""
                                    }`}
                                onClick={() => handleSelectTheater(theater.name)}
                            >
                                <div>
                                    <h4 className="font-semibold text-lg">
                                        {theater.name} - {theater.city}
                                    </h4>
                                    <p className="text-gray-400 text-sm">{theater.address}</p>
                                </div>
                                <div className="text-red-600">
                                    <svg
                                        className={`w-6 h-6 transition-transform ${selectedTheater === theater.name ? "rotate-180" : ""
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {selectedTheater === theater.name && (
                                <div className="p-4 border-t border-gray-800">
                                    <h5 className="text-gray-400 mb-3">Suất chiếu:</h5>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {theater.showTimes.map((showtime) => (
                                            <button
                                                key={showtime.id}
                                                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md flex flex-col items-center transition duration-300"
                                                onClick={() => handleBookTicket(showtime.id)}
                                            >
                                                <span className="text-lg font-medium">
                                                    {new Date(showtime.startTime).toLocaleTimeString("vi-VN", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        timeZone: "Asia/Ho_Chi_Minh",
                                                    })}
                                                </span>
                                                <span className="text-sm text-gray-400">
                                                    {showtime.screen.screenNumber}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-1">
                                                    {showtime.screen.totalSeats} ghế
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}