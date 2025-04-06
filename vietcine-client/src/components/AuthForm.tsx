import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa"; // Import Google and Facebook icons
import useGoogleAuth from "../hook/useGoogleAuth";

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
    const { signInWithGoogle } = useGoogleAuth();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        navigate("/"); // For demo purposes
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleGoogleLogin = () => {
        console.log("Google login clicked!");
        signInWithGoogle();
    };

    const handleFacebookLogin = () => {
        // Handle Facebook login here
        console.log("Facebook login clicked!");
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
                    {/* Google Login Button */}
                    <a
                        href="#"
                        onClick={handleGoogleLogin}
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition duration-300"
                    >
                        <span className="sr-only">Đăng nhập với Google</span>
                        <FaGoogle className="w-5 h-5" />
                    </a>

                    {/* Facebook Login Button */}
                    <a
                        href="#"
                        onClick={handleFacebookLogin}
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition duration-300"
                    >
                        <span className="sr-only">Đăng nhập với Facebook</span>
                        <FaFacebook className="w-5 h-5" />
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
