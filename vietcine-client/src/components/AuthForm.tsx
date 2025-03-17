import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
    isLogin: boolean;
    onToggleForm: () => void;
}

export function AuthForm({ isLogin, onToggleForm }: AuthFormProps) {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here we would handle actual form submission with API calls
        console.log("Form submitted:", formData);

        // Navigate to home page for demo purposes
        navigate("/");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="w-full max-w-md p-8 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
                {isLogin ? "Đăng nhập" : "Đăng ký tài khoản"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                    <div className="relative">
                        <label htmlFor="name" className="sr-only">Họ và tên</label>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="pl-10 block w-full rounded-md bg-gray-800 border-gray-700 text-white focus:ring-red-600 focus:border-red-600"
                            placeholder="Họ và tên"
                            required
                        />
                    </div>
                )}

                <div className="relative">
                    <label htmlFor="email" className="sr-only">Email</label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 block w-full rounded-md bg-gray-800 border-gray-700 text-white focus:ring-red-600 focus:border-red-600"
                        placeholder="Email"
                        required
                    />
                </div>

                <div className="relative">
                    <label htmlFor="password" className="sr-only">Mật khẩu</label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 block w-full rounded-md bg-gray-800 border-gray-700 text-white focus:ring-red-600 focus:border-red-600"
                        placeholder="Mật khẩu"
                        required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="text-gray-400 hover:text-white focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {isLogin && (
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-700 text-red-600 focus:ring-red-600 bg-gray-800"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-gray-400">
                                Ghi nhớ đăng nhập
                            </label>
                        </div>
                        <div>
                            <a href="#" className="text-red-600 hover:text-red-500">
                                Quên mật khẩu?
                            </a>
                        </div>
                    </div>
                )}

                <div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-white font-medium transition duration-300"
                    >
                        {isLogin ? "Đăng nhập" : "Đăng ký"}
                    </button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-900 text-gray-400">
                            Hoặc tiếp tục với
                        </span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <a
                        href="#"
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition duration-300"
                    >
                        <span className="sr-only">Đăng nhập với Google</span>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.545 12.151L12.545 12.151L12.545 12.151C12.545 9.401 9.401 9.401 9.401 9.401H5.441V14.719H9.401C9.401 14.719 12.545 14.719 12.545 12.151Z" fill="#2196F3"></path>
                            <path d="M9.401 15.912H5.441V21.229H9.401C9.401 21.229 14.331 21.229 14.331 18.571C14.331 15.912 12.605 15.912 9.401 15.912Z" fill="#0D47A1"></path>
                            <path d="M20.274 10.983C21.492 10.165 21.492 8.233 20.274 7.415L15.99 4.743C14.773 3.925 13.237 4.841 13.237 6.289L13.237 12.109C13.237 13.557 14.773 14.473 15.99 13.655L20.274 10.983Z" fill="#4CAF50"></path>
                            <path d="M5.441 7.873H9.401C12.605 7.873 14.331 5.214 14.331 2.556C14.331 -0.102 9.401 -0.102 9.401 -0.102H5.441V7.873Z" fill="#F44336"></path>
                        </svg>
                    </a>
                    <a
                        href="#"
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition duration-300"
                    >
                        <span className="sr-only">Đăng nhập với Facebook</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                    </a>
                </div>
            </div>

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-400">
                    {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
                </span>
                <button
                    onClick={onToggleForm}
                    className="ml-1 text-red-600 hover:text-red-500 font-medium"
                >
                    {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
                </button>
            </div>
        </div>
    );
}
