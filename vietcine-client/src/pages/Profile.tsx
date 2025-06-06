import React, { useState, useEffect, useContext } from "react";
import { User, Camera, Calendar, CheckCircle, XCircle } from "lucide-react";
import { NavBar } from "../components/Navbar";
import axios from "axios";
import { AuthContext } from "../context/authContext";

interface UserProfile {
    id: number;
    email: string;
    passwordHash: string;
    fullName: string;
    phone: string;
    createdAt: string;
    address: string;
    avatar?: string;
    role: string | null;
}

interface BookingSeat {
    id: number;
    bookingId: number;
    row: string;
    column: number;
}

interface BookingFood {
    id: number;
    bookingId: number;
    foodName: string;
    quantity: number;
    total: number;
}

interface Voucher {
    id: number;
    discount: number;
    validFrom: string;
    validUntil: string;
    minBillPrice: number;
    description: string;
    theaterBrandId: number;
    isActive: boolean;
}

interface Booking {
    id: number;
    userId: number;
    showtimeId: number;
    bookingDate: string;
    total: number;
    status: string;
    discount: number;
    paymentId: number;
    isActive: boolean;
    vnpTxnRef: string;
    voucherUserId: number | null;
    bookingSeats: BookingSeat[];
    bookingFoods: BookingFood[];
    voucher: Voucher | null;
}

export default function Profile() {
    const { user: userContext, dispatch } = useContext(AuthContext);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserProfile | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [avatarInputKey, setAvatarInputKey] = useState(0);

    const VALID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    useEffect(() => {
        if (userContext?.id) {
            fetchUserData();
            fetchBookingHistory();
        }
    }, [userContext]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/users/${userContext?.id}`);
            if (response.data.success) {
                setUser(response.data.data);
                setFormData(response.data.data);
                setPreviewAvatar(response.data.data.avatar || null);
            } else {
                setErrorMessage("Không thể tải thông tin người dùng");
            }
        } catch (error) {
            setErrorMessage("Không thể tải thông tin người dùng");
            console.error("Error fetching user:", error);
        }
    };

    const fetchBookingHistory = async () => {
        setIsLoadingBookings(true);
        try {
            const response = await axios.get(`http://localhost:8081/api/bookings/user/${userContext?.id}`);
            if (response.data.success) {
                setBookings(response.data.data);
            } else {
                console.error("Failed to fetch booking history");
            }
        } catch (error) {
            console.error("Error fetching booking history:", error);
        } finally {
            setIsLoadingBookings(false);
        }
    };

    useEffect(() => {
        if (user && !isEditing) {
            setFormData(user);
            setPreviewAvatar(user.avatar || null);
            setAvatarFile(null);
            setAvatarInputKey((prev) => prev + 1);
        }
    }, [user, isEditing]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (!VALID_IMAGE_TYPES.includes(file.type)) {
                setErrorMessage("Chỉ hỗ trợ định dạng ảnh JPG, PNG hoặc GIF");
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                setErrorMessage("Kích thước ảnh không được vượt quá 5MB");
                return;
            }

            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setPreviewAvatar(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateName = (name: string) => {
        const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
        return nameRegex.test(name);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        if (!formData.fullName || !formData.email || !formData.phone) {
            setErrorMessage("Tất cả các trường bắt buộc phải được điền");
            return;
        }

        if (!validateEmail(formData.email)) {
            setErrorMessage("Email không hợp lệ");
            return;
        }

        if (!validateName(formData.fullName)) {
            setErrorMessage("Tên không được chứa ký tự đặc biệt hoặc số");
            return;
        }

        setIsUpdating(true);
        try {
            const updateData = new FormData();
            updateData.append("fullName", formData.fullName);
            updateData.append("email", formData.email);
            updateData.append("phone", formData.phone);
            if (formData.address) updateData.append("address", formData.address);
            if (avatarFile) updateData.append("avatar", avatarFile);

            const response = await axios.put(
                `http://localhost:8081/api/users/${userContext?.id}`,
                updateData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.data.success) {
                setUser(response.data.data);
                setIsEditing(false);
                setSuccessMessage("Thông tin tài khoản đã được cập nhật thành công");
                setErrorMessage("");
                setAvatarFile(null);
                setAvatarInputKey((prev) => prev + 1);

                setTimeout(() => setSuccessMessage(""), 2000);

                dispatch({
                    type: "UPDATE",
                    payload: {
                        id: response.data.data.id.toString(),
                        fullName: response.data.data.fullName,
                        email: response.data.data.email,
                        avatar: response.data.data.avatar || null,
                    },
                });
            } else {
                setErrorMessage("Cập nhật thông tin thất bại: " + response.data.message);
            }
        } catch (error) {
            setErrorMessage("Có lỗi xảy ra khi cập nhật thông tin");
            console.error("Error updating user:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setPreviewAvatar(user?.avatar || null);
        setAvatarFile(null);
        setAvatarInputKey((prev) => prev + 1);
        setErrorMessage("");
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!user || !formData) {
        return (
            <div
                data-testid="loading-initial"
                className="min-h-screen bg-gray-950 text-white"
            >
                Đang tải...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 pt-20 pb-12">
            <NavBar transparent={true} />
            <div className="container mx-auto px-4">
                <h1
                    data-testid="profile-title"
                    className="text-3xl font-bold text-white mb-8"
                >
                    Tài khoản của tôi
                </h1>

                {successMessage && (
                    <div
                        data-testid="success-message"
                        className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded mb-6 flex items-center"
                    >
                        <span className="mr-2">✓</span>
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div
                        data-testid="error-message"
                        className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6 flex items-center"
                    >
                        <span className="mr-2">✗</span>
                        {errorMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                            <div className="p-6 text-center">
                                <div className="relative inline-block mb-4">
                                    <div
                                        data-testid="avatar-container"
                                        className="w-32 h-32 rounded-full overflow-hidden border-4 border-red-600 mx-auto"
                                    >
                                        {previewAvatar || user.avatar ? (
                                            <img
                                                data-testid="avatar-image"
                                                src={previewAvatar || user.avatar}
                                                alt={user.fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                                <User className="text-white h-12 w-12" />
                                            </div>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <input
                                            key={avatarInputKey}
                                            type="file"
                                            accept="image/jpeg,image/png,image/gif"
                                            onChange={handleAvatarChange}
                                            className="absolute bottom-0 right-0 opacity-0 w-10 h-10 cursor-pointer"
                                            id="avatar-upload"
                                            data-testid="avatar-input"
                                            disabled={isUpdating}
                                        />
                                    )}
                                    {isEditing && (
                                        <label
                                            htmlFor="avatar-upload"
                                            className={`absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors ${isUpdating ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                            data-testid="avatar-upload-label"
                                        >
                                            <Camera className="h-4 w-4" />
                                        </label>
                                    )}
                                </div>
                                <h2
                                    data-testid="user-fullname"
                                    className="text-xl font-semibold text-white mb-1"
                                >
                                    {user.fullName}
                                </h2>
                                <p
                                    data-testid="user-email"
                                    className="text-gray-400 mb-4"
                                >
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3
                                        data-testid="info-title"
                                        className="text-xl font-semibold text-white"
                                    >
                                        {isEditing ? "Chỉnh sửa thông tin" : "Thông tin cá nhân"}
                                    </h3>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                            data-testid="edit-button"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                            <span>Chỉnh sửa</span>
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit} data-testid="profile-form">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label
                                                    htmlFor="fullName"
                                                    className="block text-sm font-medium text-gray-400 mb-2"
                                                >
                                                    Họ và tên
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        id="fullName"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        disabled={isUpdating}
                                                        data-testid="fullname-input"
                                                    />
                                                ) : (
                                                    <p
                                                        className="text-white"
                                                        data-testid="fullname-display"
                                                    >
                                                        {user.fullName}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="email"
                                                    className="block text-sm font-medium text-gray-400 mb-2"
                                                >
                                                    Email
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        id="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        disabled={isUpdating}
                                                        data-testid="email-input"
                                                    />
                                                ) : (
                                                    <p
                                                        className="text-white"
                                                        data-testid="email-display"
                                                    >
                                                        {user.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="phone"
                                                className="block text-sm font-medium text-gray-400 mb-2"
                                            >
                                                Số điện thoại
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    disabled={isUpdating}
                                                    data-testid="phone-input"
                                                />
                                            ) : (
                                                <p
                                                    className="text-white"
                                                    data-testid="phone-display"
                                                >
                                                    {user.phone}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="address"
                                                className="block text-sm font-medium text-gray-400 mb-2"
                                            >
                                                Địa chỉ
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    id="address"
                                                    name="address"
                                                    value={formData.address || ""}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    disabled={isUpdating}
                                                    data-testid="address-input"
                                                />
                                            ) : (
                                                <p
                                                    className="text-white"
                                                    data-testid="address-display"
                                                >
                                                    {user.address || "Chưa cung cấp"}
                                                </p>
                                            )}
                                        </div>

                                        {isEditing && (
                                            <div className="pt-4 flex space-x-3">
                                                <button
                                                    type="submit"
                                                    className={`flex items-center space-x-1 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${isUpdating ? "opacity-50 cursor-not-allowed" : ""
                                                        }`}
                                                    disabled={isUpdating}
                                                    data-testid="submit-button"
                                                >
                                                    {isUpdating ? (
                                                        <>
                                                            <svg
                                                                className="animate-spin h-4 w-4 mr-2"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                data-testid="loading-spinner"
                                                            >
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                ></circle>
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                ></path>
                                                            </svg>
                                                            <span>Đang lưu...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                            <span>Lưu thay đổi</span>
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleCancel}
                                                    className="flex items-center space-x-1 px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                                                    data-testid="cancel-button"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                    <span>Hủy</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Booking History Section */}
                        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mt-6">
                            <div className="p-6">
                                <h3
                                    data-testid="recent-tickets-title"
                                    className="text-xl font-semibold text-white mb-4"
                                >
                                    Lịch sử đặt vé
                                </h3>

                                {isLoadingBookings ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                                        <p className="text-gray-400 mt-2">Đang tải lịch sử đặt vé...</p>
                                    </div>
                                ) : bookings.length === 0 ? (
                                    <div
                                        data-testid="no-tickets-message"
                                        className="text-gray-400 text-center py-8"
                                    >
                                        Không có lịch sử đặt vé nào
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {bookings.map((booking) => (
                                            <div
                                                key={booking.id}
                                                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <span className="text-white font-medium">
                                                                Mã đặt vé: #{booking.id}
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'Success'
                                                                ? 'bg-green-900/50 text-green-300 border border-green-600'
                                                                : 'bg-red-900/50 text-red-300 border border-red-600'
                                                                }`}>
                                                                {booking.status === 'Success' ? (
                                                                    <div className="flex items-center space-x-1">
                                                                        <CheckCircle className="h-3 w-3" />
                                                                        <span>Thành công</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center space-x-1">
                                                                        <XCircle className="h-3 w-3" />
                                                                        <span>Thất bại</span>
                                                                    </div>
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-1 text-gray-400 text-sm">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{formatDate(booking.bookingDate)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-white font-bold text-lg">
                                                            {formatCurrency(booking.total)}
                                                        </div>
                                                        {booking.discount > 0 && (
                                                            <div className="text-green-400 text-sm">
                                                                Giảm {formatCurrency(booking.discount)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <div className="text-gray-400 mb-2">Chi tiết ghế:</div>
                                                        {booking.bookingSeats.length > 0 ? (
                                                            <div className="text-white">
                                                                {booking.bookingSeats.map((seat) => (
                                                                    <span key={seat.id} className="mr-2">
                                                                        {seat.row}{seat.column}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-gray-500">Không có ghế</div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <div className="text-gray-400 mb-2">Đồ ăn & nước uống:</div>
                                                        {booking.bookingFoods.length > 0 ? (
                                                            <div className="space-y-1">
                                                                {booking.bookingFoods.map((food) => (
                                                                    <div key={food.id} className="text-white text-xs">
                                                                        {food.quantity}x {food.foodName}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-gray-500">Không có</div>
                                                        )}
                                                    </div>
                                                </div>

                                                {booking.voucher && (
                                                    <div className="mt-3 p-2 bg-green-900/20 border border-green-600/30 rounded">
                                                        <div className="text-green-400 text-sm font-medium">
                                                            Voucher đã sử dụng:
                                                        </div>
                                                        <div className="text-green-300 text-xs">
                                                            {booking.voucher.description}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="mt-3 pt-3 border-t border-gray-700">
                                                    <div className="text-gray-400 text-xs">
                                                        Mã giao dịch: {booking.vnpTxnRef}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}