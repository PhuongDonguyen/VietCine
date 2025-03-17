import React, { useState, useEffect } from "react";
import { User, Camera } from "lucide-react";
import { NavBar } from "../components/Navbar";
import axios from "axios";

interface UserProfile {
    UserId: number;
    Username: string;
    Email: string;
    PasswordHash: string;
    FullName: string;
    Phone: string;
    CreatedAt: string;
    Address: string;
    Avatar?: string;
}

export default function Profile() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserProfile | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Constants for validation
    const VALID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/users/1');
            setUser(response.data.data);
            setFormData(response.data.data);
        } catch (error) {
            setErrorMessage("Không thể tải thông tin người dùng");
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        if (user) {
            setFormData(user);
            setPreviewAvatar(user.Avatar || null);
        }
    }, [user, isEditing]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file type
            if (!VALID_IMAGE_TYPES.includes(file.type)) {
                setErrorMessage("Chỉ hỗ trợ định dạng ảnh JPG, PNG hoặc GIF");
                return;
            }

            // Validate file size
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
        const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/; // Allows letters and Vietnamese characters
        return nameRegex.test(name);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (!formData) return;

        // Custom validation for empty fields
        if (!formData.FullName || !formData.Email || !formData.Phone || !formData.Username) {
            setErrorMessage("Tất cả các trường bắt buộc phải được điền");
            return;
        }

        // Email validation
        if (!validateEmail(formData.Email)) {
            setErrorMessage("Email không hợp lệ");
            return;
        }

        // Name validation
        if (!validateName(formData.FullName)) {
            setErrorMessage("Tên không được chứa ký tự đặc biệt hoặc số");
            return;
        }

        setIsUpdating(true);
        try {
            const updateData = new FormData();
            updateData.append('FullName', formData.FullName);
            updateData.append('Email', formData.Email);
            updateData.append('Phone', formData.Phone);
            updateData.append('Username', formData.Username);
            if (formData.Address) updateData.append('Address', formData.Address);
            if (avatarFile) updateData.append('avatar', avatarFile);

            const response = await axios.put('http://localhost:3001/users/1', updateData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setUser(response.data.data);
            setIsEditing(false);
            setSuccessMessage("Thông tin tài khoản đã được cập nhật thành công");
            setErrorMessage("");
            setAvatarFile(null);

            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            setErrorMessage("Có lỗi xảy ra khi cập nhật thông tin");
            console.error('Error updating user:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    if (!user || !formData) {
        return <div data-testid="loading-initial" className="min-h-screen bg-gray-950 text-white">Đang tải...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-950 pt-20 pb-12">
            <NavBar transparent={true} />
            <div className="container mx-auto px-4">
                <h1 data-testid="profile-title" className="text-3xl font-bold text-white mb-8">Tài khoản của tôi</h1>

                {successMessage && (
                    <div data-testid="success-message" className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded mb-6 flex items-center">
                        <span className="mr-2">✓</span>
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div data-testid="error-message" className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6 flex items-center">
                        <span className="mr-2">✗</span>
                        {errorMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                            <div className="p-6 text-center">
                                <div className="relative inline-block mb-4">
                                    <div data-testid="avatar-container" className="w-32 h-32 rounded-full overflow-hidden border-4 border-red-600 mx-auto">
                                        {previewAvatar || user.Avatar ? (
                                            <img
                                                data-testid="avatar-image"
                                                src={previewAvatar ? previewAvatar : user.Avatar}
                                                alt={user.FullName}
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
                                            className={`absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors cursor-pointer ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            data-testid="avatar-upload-label"
                                        >
                                            <Camera className="h-4 w-4" />
                                        </label>
                                    )}
                                </div>
                                <h2 data-testid="user-fullname" className="text-xl font-semibold text-white mb-1">{user.FullName}</h2>
                                <p data-testid="user-email" className="text-gray-400 mb-4">{user.Email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 data-testid="info-title" className="text-xl font-semibold text-white">
                                        {isEditing ? "Chỉnh sửa thông tin" : "Thông tin cá nhân"}
                                    </h3>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                            data-testid="edit-button"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            <span>Chỉnh sửa</span>
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit} data-testid="profile-form">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="FullName" className="block text-sm font-medium text-gray-400 mb-2">
                                                    Họ và tên
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        id="FullName"
                                                        name="FullName"
                                                        value={formData.FullName}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        disabled={isUpdating}
                                                        data-testid="fullname-input"
                                                    />
                                                ) : (
                                                    <p className="text-white" data-testid="fullname-display">{user.FullName}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="Email" className="block text-sm font-medium text-gray-400 mb-2">
                                                    Email
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="email"
                                                        id="Email"
                                                        name="Email"
                                                        value={formData.Email}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        disabled={isUpdating}
                                                        data-testid="email-input"
                                                    />
                                                ) : (
                                                    <p className="text-white" data-testid="email-display">{user.Email}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="Phone" className="block text-sm font-medium text-gray-400 mb-2">
                                                Số điện thoại
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    id="Phone"
                                                    name="Phone"
                                                    value={formData.Phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    disabled={isUpdating}
                                                    data-testid="phone-input"
                                                />
                                            ) : (
                                                <p className="text-white" data-testid="phone-display">{user.Phone}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="Address" className="block text-sm font-medium text-gray-400 mb-2">
                                                Địa chỉ
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    id="Address"
                                                    name="Address"
                                                    value={formData.Address}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    disabled={isUpdating}
                                                    data-testid="address-input"
                                                />
                                            ) : (
                                                <p className="text-white" data-testid="address-display">{user.Address}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="Username" className="block text-sm font-medium text-gray-400 mb-2">
                                                Tên đăng nhập
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    id="Username"
                                                    name="Username"
                                                    value={formData.Username}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    disabled={isUpdating}
                                                    data-testid="username-input"
                                                />
                                            ) : (
                                                <p className="text-white" data-testid="username-display">{user.Username}</p>
                                            )}
                                        </div>

                                        {isEditing && (
                                            <div className="pt-4 flex space-x-3">
                                                <button
                                                    type="submit"
                                                    className={`flex items-center space-x-1 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            <span>Đang lưu...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <span>Lưu thay đổi</span>
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setPreviewAvatar(user.Avatar || null);
                                                        setAvatarFile(null);
                                                        setErrorMessage("");
                                                    }}
                                                    className="flex items-center space-x-1 px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                                                    data-testid="cancel-button"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    <span>Hủy</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg mt-6">
                            <div className="p-6">
                                <h3 data-testid="recent-tickets-title" className="text-xl font-semibold text-white mb-4">Vé gần đây</h3>
                                <div data-testid="no-tickets-message" className="block text-sm text-gray-400">Không có lịch sử đặt vé nào</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}