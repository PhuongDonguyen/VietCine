import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Calendar } from "lucide-react";

// Mock ticket data interface
interface Ticket {
    id: string;
    movieTitle: string;
    theater: string;
    date: string;
    time: string;
    seats: string[];
    hall: string;
    status: "upcoming" | "past" | "cancelled";
    totalPrice: number;
    paymentMethod?: string;
    bookingDate: string;
    qrCode?: string;
}

export default function MyTickets() {
    // Mock data for user tickets
    const mockTickets: Ticket[] = [
        {
            id: "TIX-001",
            movieTitle: "Lập trình 7: Truy tìm kho báu",
            theater: "CGV Landmark 81",
            date: "15/03/2025",
            time: "19:30",
            seats: ["F7", "F8"],
            hall: "Rạp 3",
            status: "upcoming",
            totalPrice: 220000,
            paymentMethod: "Visa **** 4565",
            bookingDate: "01/03/2025",
            qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TIX-001"
        },
        {
            id: "TIX-002",
            movieTitle: "Mai",
            theater: "Lotte Cinema Cantavil",
            date: "05/03/2025",
            time: "14:15",
            seats: ["H10", "H11"],
            hall: "Rạp 5",
            status: "past",
            totalPrice: 180000,
            paymentMethod: "MoMo",
            bookingDate: "01/03/2025"
        },
        {
            id: "TIX-003",
            movieTitle: "Nữ Quý Đầu",
            theater: "Galaxy Cinema Nguyễn Du",
            date: "20/02/2025",
            time: "20:30",
            seats: ["D5", "D6", "D7"],
            hall: "Rạp 1",
            status: "past",
            totalPrice: 270000,
            paymentMethod: "Tiền mặt",
            bookingDate: "18/02/2025"
        },
        {
            id: "TIX-004",
            movieTitle: "Quý Cô Nhan 4",
            theater: "BHD Star Vincom Lê Văn Việt",
            date: "28/03/2025",
            time: "18:00",
            seats: ["J12"],
            hall: "Rạp 2",
            status: "upcoming",
            totalPrice: 110000,
            paymentMethod: "ZaloPay",
            bookingDate: "05/03/2025",
            qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TIX-004"
        },
        {
            id: "TIX-005",
            movieTitle: "Biệt Đội Đánh Thuê",
            theater: "CGV Liberty Citypoint",
            date: "10/01/2025",
            time: "15:45",
            seats: ["E8", "E9"],
            hall: "Rạp 7",
            status: "cancelled",
            totalPrice: 200000,
            bookingDate: "05/01/2025"
        },
        {
            id: "TIX-006",
            movieTitle: "Bất Công Bữa Trưa",
            theater: "CGV Sư Vạn Hạnh",
            date: "25/03/2025",
            time: "21:15",
            seats: ["G14", "G15"],
            hall: "Rạp 4",
            status: "upcoming",
            totalPrice: 200000,
            paymentMethod: "Visa **** 7890",
            bookingDate: "10/03/2025",
            qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TIX-006"
        }
    ];

    // Filter tickets based on status
    const upcomingTickets = mockTickets.filter(ticket => ticket.status === "upcoming");
    const pastTickets = mockTickets.filter(ticket => ticket.status === "past" || ticket.status === "cancelled");

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'upcoming':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">Sắp diễn ra</span>;
            case 'past':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">Đã xem</span>;
            case 'cancelled':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-300">Đã hủy</span>;
            default:
                return null;
        }
    };

    // Render a ticket card
    const renderTicketCard = (ticket: Ticket) => {
        return (
            <div key={ticket.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6 border border-gray-800">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-semibold text-white">{ticket.movieTitle}</h3>
                            <p className="text-gray-400">{ticket.theater} • {ticket.hall}</p>
                        </div>
                        <div>
                            {getStatusBadge(ticket.status)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Ngày giờ</p>
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-red-500" />
                                <p className="text-white">{ticket.date} • {ticket.time}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm mb-1">Số ghế</p>
                            <p className="text-white">{ticket.seats.join(", ")}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm mb-1">Tổng tiền</p>
                            <p className="text-white font-medium">{formatPrice(ticket.totalPrice)}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-4 mt-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Đặt vé ngày: {ticket.bookingDate}</p>
                                {ticket.paymentMethod && (
                                    <p className="text-gray-500 text-sm">Thanh toán: {ticket.paymentMethod}</p>
                                )}
                            </div>

                            {ticket.status === "upcoming" && (
                                <div className="flex space-x-3 mt-4 md:mt-0">
                                    {ticket.qrCode && (
                                        <button
                                            className="px-4 py-1.5 bg-transparent text-white border border-white rounded hover:bg-white hover:text-black transition duration-300 text-sm flex items-center space-x-1"
                                            onClick={() => window.open(ticket.qrCode, '_blank')}
                                        >
                                            <span>Mã QR</span>
                                        </button>
                                    )}
                                    <button
                                        className="px-4 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300 text-sm flex items-center space-x-1"
                                        onClick={() => alert("Chi tiết vé sẽ được hiển thị sau")}
                                    >
                                        <span>Chi tiết</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {ticket.status === "past" && (
                                <button
                                    className="px-4 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-600 transition duration-300 text-sm mt-4 md:mt-0 flex items-center space-x-1"
                                    onClick={() => alert("Tính năng đánh giá sẽ được cập nhật sau")}
                                >
                                    <span>Đánh giá phim</span>
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-950 pt-20 pb-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-white mb-8">Vé của tôi</h1>

                <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="bg-gray-900 mb-6">
                        <TabsTrigger
                            value="upcoming"
                            className="data-[state=active]:bg-red-600"
                        >
                            <span className="flex items-center">
                                Sắp diễn ra
                                <span className="ml-2 px-2 py-0.5 bg-red-700 text-white rounded-full text-xs">
                                    {upcomingTickets.length}
                                </span>
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="past"
                            className="data-[state=active]:bg-red-600"
                        >
                            <span className="flex items-center">
                                Đã xem
                                <span className="ml-2 px-2 py-0.5 bg-red-700 text-white rounded-full text-xs">
                                    {pastTickets.length}
                                </span>
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="mt-0">
                        {upcomingTickets.length > 0 ? (
                            <div>
                                {upcomingTickets.map(ticket => renderTicketCard(ticket))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-900 rounded-lg">
                                <p className="text-gray-400 mb-4">Bạn chưa có vé nào sắp diễn ra</p>
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
                                    onClick={() => window.location.href = "/movies"}
                                >
                                    Mua vé ngay
                                </button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="past" className="mt-0">
                        {pastTickets.length > 0 ? (
                            <div>
                                {pastTickets.map(ticket => renderTicketCard(ticket))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-900 rounded-lg">
                                <p className="text-gray-400">Bạn chưa có lịch sử đặt vé</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}