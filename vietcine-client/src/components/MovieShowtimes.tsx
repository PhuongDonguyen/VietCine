import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";

interface Showtime {
    id: string;
    time: string;
    date: string;
    theater: string;
    theaterId: string;
    screen: string;
    price: string;
    seatsAvailable: number;
}

interface Theater {
    id: string;
    name: string;
    address: string;
    city: string;
    showTimes: Showtime[];
}

interface Props {
    movieId: string;
    movieTitle: string;
}

export function MovieShowtimes({ movieId }: Props) {
    const navigate = useNavigate();
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const [selectedDate, setSelectedDate] = useState<string>(formattedToday); // Default to today
    const [selectedTheater, setSelectedTheater] = useState<string>("");

    // Generate dates for the next 7 days
    const dates = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const displayDate = date.toLocaleDateString('vi-VN', {
            weekday: 'short',
            day: 'numeric',
            month: 'numeric'
        });

        dates.push({
            value: dateStr,
            display: displayDate
        });
    }

    // Mock data for theaters and showtimes
    const theaters: Theater[] = [
        {
            id: "cgv-landmark",
            name: "CGV Landmark 81",
            address: "Tầng B1, TTTM Landmark 81, 720A Điện Biên Phủ, P.22, Q.Bình Thạnh",
            city: "TP. Hồ Chí Minh",
            showTimes: [
                { id: "st1", time: "10:30", date: "2025-03-12", theater: "CGV Landmark 81", theaterId: "cgv-landmark", screen: "Screen 1", price: "90,000đ", seatsAvailable: 42 },
                { id: "st2", time: "13:15", date: "2025-03-04", theater: "CGV Landmark 81", theaterId: "cgv-landmark", screen: "Screen 3", price: "90,000đ", seatsAvailable: 65 },
                { id: "st3", time: "16:00", date: "2025-03-04", theater: "CGV Landmark 81", theaterId: "cgv-landmark", screen: "Screen 5", price: "110,000đ", seatsAvailable: 32 },
                { id: "st4", time: "19:30", date: "2025-03-04", theater: "CGV Landmark 81", theaterId: "cgv-landmark", screen: "Screen 7", price: "130,000đ", seatsAvailable: 78 },
                { id: "st5", time: "21:45", date: "2025-03-04", theater: "CGV Landmark 81", theaterId: "cgv-landmark", screen: "Screen 2", price: "130,000đ", seatsAvailable: 54 },
                { id: "st6", time: "10:30", date: "2025-03-05", theater: "CGV Landmark 81", theaterId: "cgv-landmark", screen: "Screen 1", price: "90,000đ", seatsAvailable: 42 },
                { id: "st7", time: "13:15", date: "2025-03-05", theater: "CGV Landmark 81", theaterId: "cgv-landmark", screen: "Screen 3", price: "90,000đ", seatsAvailable: 65 },
            ]
        },
        {
            id: "lotte-cantavil",
            name: "Lotte Cinema Cantavil",
            address: "Tầng 7, Cantavil Premier, Số 1 đường Song Hành, Xa lộ Hà Nội, P.An Phú, Q.2",
            city: "TP. Hồ Chí Minh",
            showTimes: [
                { id: "st8", time: "09:45", date: "2025-03-04", theater: "Lotte Cinema Cantavil", theaterId: "lotte-cantavil", screen: "Cinema 3", price: "85,000đ", seatsAvailable: 32 },
                { id: "st9", time: "12:30", date: "2025-03-04", theater: "Lotte Cinema Cantavil", theaterId: "lotte-cantavil", screen: "Cinema 1", price: "85,000đ", seatsAvailable: 58 },
                { id: "st10", time: "15:15", date: "2025-03-04", theater: "Lotte Cinema Cantavil", theaterId: "lotte-cantavil", screen: "Cinema 2", price: "100,000đ", seatsAvailable: 47 },
                { id: "st11", time: "18:00", date: "2025-03-04", theater: "Lotte Cinema Cantavil", theaterId: "lotte-cantavil", screen: "Cinema 4", price: "120,000đ", seatsAvailable: 39 },
                { id: "st12", time: "20:45", date: "2025-03-04", theater: "Lotte Cinema Cantavil", theaterId: "lotte-cantavil", screen: "Cinema 1", price: "120,000đ", seatsAvailable: 62 },
                { id: "st13", time: "09:45", date: "2025-03-05", theater: "Lotte Cinema Cantavil", theaterId: "lotte-cantavil", screen: "Cinema 3", price: "85,000đ", seatsAvailable: 32 },
            ]
        },
        {
            id: "bhd-phamhung",
            name: "BHD Star Phạm Hùng",
            address: "Tầng B1&B2, Vincom Plaza Phạm Hùng, số 54A đường Phạm Hùng, P.Tân Phong, Q.7",
            city: "TP. Hồ Chí Minh",
            showTimes: [
                { id: "st14", time: "11:00", date: "2025-03-08", theater: "BHD Star Phạm Hùng", theaterId: "bhd-phamhung", screen: "Cinema 1", price: "80,000đ", seatsAvailable: 45 },
                { id: "st15", time: "14:30", date: "2025-03-04", theater: "BHD Star Phạm Hùng", theaterId: "bhd-phamhung", screen: "Cinema 2", price: "80,000đ", seatsAvailable: 52 },
                { id: "st16", time: "17:00", date: "2025-03-08", theater: "BHD Star Phạm Hùng", theaterId: "bhd-phamhung", screen: "Cinema 3", price: "100,000đ", seatsAvailable: 38 },
                { id: "st17", time: "20:15", date: "2025-03-04", theater: "BHD Star Phạm Hùng", theaterId: "bhd-phamhung", screen: "Cinema 2", price: "120,000đ", seatsAvailable: 64 },
                { id: "st18", time: "11:00", date: "2025-03-08", theater: "BHD Star Phạm Hùng", theaterId: "bhd-phamhung", screen: "Cinema 1", price: "80,000đ", seatsAvailable: 45 },
            ]
        }
    ];

    const handleSelectTheater = (theaterId: string) => {
        setSelectedTheater(theaterId === selectedTheater ? "" : theaterId);
    };

    const handleBookTicket = (showtimeId: string) => {
        // Navigate to the seat selection page with query parameters
        navigate(`/seat-selection?movieId=${movieId}&showtimeId=${showtimeId}`);
    };

    // Filter showtimes by selected date
    const filteredTheaters = theaters.map(theater => ({
        ...theater,
        showTimes: theater.showTimes.filter(showtime => showtime.date === selectedDate)
    })).filter(theater => theater.showTimes.length > 0);

    return (
        <div className="space-y-8">
            {/* Date selector */}
            <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-red-600 mr-2" />
                    <h3 className="text-lg font-medium">Chọn ngày</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
                    {dates.map((date, index) => (
                        <button
                            key={index}
                            className={`py-2 px-4 rounded-md text-center transition-colors ${selectedDate === date.value ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                            onClick={() => setSelectedDate(date.value)}
                        >
                            {date.display}
                        </button>
                    ))}
                </div>
            </div>

            {/* Theater listing */}
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
                    filteredTheaters.map(theater => (
                        <div key={theater.id} className="bg-gray-900 rounded-lg overflow-hidden">
                            <div
                                className={`p-4 flex justify-between items-center cursor-pointer ${selectedTheater === theater.id ? 'bg-gray-800' : ''}`}
                                onClick={() => handleSelectTheater(theater.id)}
                            >
                                <div>
                                    <h4 className="font-semibold text-lg">{theater.name}</h4>
                                    <p className="text-gray-400 text-sm">{theater.address}</p>
                                </div>
                                <div className="text-red-600">
                                    <svg className={`w-6 h-6 transition-transform ${selectedTheater === theater.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {selectedTheater === theater.id && (
                                <div className="p-4 border-t border-gray-800">
                                    <h5 className="text-gray-400 mb-3">Suất chiếu:</h5>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {theater.showTimes.map(showtime => (
                                            <button
                                                key={showtime.id}
                                                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md flex flex-col items-center transition duration-300"
                                                onClick={() => handleBookTicket(showtime.id)}
                                            >
                                                <span className="text-lg font-medium">{showtime.time}</span>
                                                <span className="text-sm text-gray-400">{showtime.screen}</span>
                                                <span className="text-xs text-gray-500 mt-1">{showtime.seatsAvailable} ghế trống</span>
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
