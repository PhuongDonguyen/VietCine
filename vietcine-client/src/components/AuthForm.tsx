import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import useGoogleAuth from "../hook/useGoogleAuth";
import useFacebookAuth from "../hook/useFacebookAuth";
import axios from "axios";
import { AuthContext } from "../context/authContext";

interface AuthFormProps {
  isLogin: boolean;
  onToggleForm: () => void;
}

export function AuthForm({ isLogin, onToggleForm }: AuthFormProps) {
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthForm must be used within an AuthProvider");
  }
  const { dispatch } = context;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "", // Added confirmPassword field
    role: "USER",
    phone: "",
    address: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signInWithGoogle, isLoading: googleAuthIsLoading } = useGoogleAuth();
  const { signInWithFacebook, isLoading: facebookIsLoading } =
    useFacebookAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    // Validate password match for signup
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setFormError("Mật khẩu xác nhận không khớp");
      setIsSubmitting(false);
      return;
    }

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      const response = await axios.post(
        import.meta.env.VITE_SERVER_API_URL + endpoint,
        // Only send relevant fields (exclude confirmPassword for API)
        isLogin
          ? { email: formData.email, password: formData.password }
          : {
              fullName: formData.fullName,
              email: formData.email,
              password: formData.password,
              role: formData.role,
              phone: formData.phone,
              address: formData.address,
            }
      );

      if (response.data.success) {
        const user = response.data.data.user;
        dispatch({
          type: "LOGIN",
          payload: {
            user: {
              id: user.id,
              fullName: user.fullName,
              email: user.email,
              avatar: user?.avatar,
            },
            token: response.data.data.token,
            role: response.data.data.role,
          },
        });
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("role", response.data.data.role);
        navigate("/");
      } else {
        setFormError(
          response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại."
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.";
        setFormError(errorMessage);
      } else {
        setFormError("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
      }
      console.error("Authentication error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      setFormError((error as Error).message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithFacebook();
    } catch (error) {
      setFormError((error as Error).message);
    }
  };

  const isAnyLoading = googleAuthIsLoading || facebookIsLoading || isSubmitting;

  return (
    <div className={isLogin ? "" : "w-full"}>
      <h2
        className={`text-2xl font-bold text-white mb-6 ${
          isLogin ? "text-center" : "text-left"
        }`}
      >
        {isLogin ? "Đăng nhập" : "Đăng ký tài khoản"}
      </h2>

      {formError && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-md text-red-300 text-sm">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div className="relative">
            <label htmlFor="fullName" className="sr-only">
              Họ và tên
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="pl-10 block w-full rounded-md bg-gray-800 border-gray-700 text-white focus:ring-red-600 focus:border-red-600"
              placeholder="Họ và tên"
              required
              disabled={isAnyLoading}
            />
          </div>
        )}

        <div className="relative">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
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
            disabled={isAnyLoading}
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="sr-only">
            Mật khẩu
          </label>
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
            disabled={isAnyLoading}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-white focus:outline-none"
              disabled={isAnyLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {!isLogin && (
          <div className="relative">
            <label htmlFor="confirmPassword" className="sr-only">
              Xác nhận mật khẩu
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="pl-10 pr-10 block w-full rounded-md bg-gray-800 border-gray-700 text-white focus:ring-red-600 focus:border-red-600"
              placeholder="Xác nhận mật khẩu"
              required
              disabled={isAnyLoading}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="text-gray-400 hover:text-white focus:outline-none"
                disabled={isAnyLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        )}

        {!isLogin && (
          <>
            <div className="relative">
              <label htmlFor="phone" className="sr-only">
                Số điện thoại
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-md bg-gray-800 border-gray-700 text-white focus:ring-red-600 focus:border-red-600"
                placeholder="Số điện thoại"
                required
                disabled={isAnyLoading}
                data-testid="signup-phone-input"
              />
            </div>
            <div className="relative">
              <label htmlFor="address" className="sr-only">
                Địa chỉ
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-md bg-gray-800 border-gray-700 text-white focus:ring-red-600 focus:border-red-600"
                placeholder="Địa chỉ"
                required
                disabled={isAnyLoading}
                data-testid="signup-address-input"
              />
            </div>
          </>
        )}

        {isLogin && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-700 text-red-600 focus:ring-red-600 bg-gray-800"
                disabled={isAnyLoading}
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
            className={`w-full py-3 px-4 rounded-md font-medium text-white transition duration-300 ${
              isAnyLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            }`}
            disabled={isAnyLoading}
          >
            {isSubmitting ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
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
          <button
            onClick={handleGoogleLogin}
            disabled={googleAuthIsLoading}
            className={`w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm transition duration-300 ${
              googleAuthIsLoading
                ? "bg-gray-700 cursor-not-allowed text-gray-400"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <span className="sr-only">Đăng nhập với Google</span>
            <FaGoogle className="w-5 h-5" />
            {googleAuthIsLoading && <span className="ml-2">Đang tải...</span>}
          </button>

          <button
            onClick={handleFacebookLogin}
            disabled={facebookIsLoading}
            className={`w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm transition duration-300 ${
              facebookIsLoading
                ? "bg-gray-700 cursor-not-allowed text-gray-400"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <span className="sr-only">Đăng nhập với Facebook</span>
            <FaFacebook className="w-5 h-5" />
            {facebookIsLoading && <span className="ml-2">Đang tải...</span>}
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-400">
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
        </span>
        <button
          onClick={onToggleForm}
          className="ml-1 text-red-600 hover:text-red-500 font-medium"
          disabled={isAnyLoading}
        >
          {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
        </button>
      </div>
    </div>
  );
}
