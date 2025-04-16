import { useEffect } from "react";
import { AuthForm } from "../components/AuthForm";
import { Film, Ticket } from "lucide-react";
import { TypeAnimation } from "react-type-animation";

export default function Signup() {
    // Set dark theme by default
    useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);

    const navigateToLogin = () => {
        // Navigate to login page - you'd use React Router here
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-black text-white relative flex flex-col">
            {/* Content - Side by Side Layout */}
            <div className="flex-1 flex relative z-10">
                {/* Left Side - Visual Content */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    {/* Background image */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
                    <img
                        className="absolute inset-0 h-full w-full object-cover opacity-70"
                        src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                        alt="Cinema Experience"
                    />

                    {/* Left side content */}
                    <div className="absolute inset-0 flex flex-col justify-center items-start p-12 z-20">
                        <div className="flex items-center mb-8">
                            <Film className="h-12 w-12 text-red-600 mr-4" />
                            <a href="/" className="text-5xl font-bold text-white">CineViet</a>
                        </div>

                        <TypeAnimation
                            sequence={[
                                'Tham gia cùng CineViet',
                                2000,
                                '', // this clears the text
                                500
                            ]}
                            speed={50}
                            repeat={Infinity}
                            wrapper="h2"
                            className="text-3xl font-bold text-white mb-6"
                        />

                        <p className="text-xl text-gray-300 mb-8 max-w-md">
                            Khám phá thế giới điện ảnh đẳng cấp cùng những bộ phim đặc sắc nhất tại các rạp chiếu hàng đầu Việt Nam.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <Ticket className="h-6 w-6 text-red-500 mr-3" />
                                <span className="text-lg text-gray-200">Đặt vé online dễ dàng</span>
                            </div>
                            <div className="flex items-center">
                                <Ticket className="h-6 w-6 text-red-500 mr-3" />
                                <span className="text-lg text-gray-200">Ưu đãi hấp dẫn cho thành viên</span>
                            </div>
                            <div className="flex items-center">
                                <Ticket className="h-6 w-6 text-red-500 mr-3" />
                                <span className="text-lg text-gray-200">Phòng chiếu hiện đại</span>
                            </div>
                        </div>
                    </div>

                    {/* Film strip effect at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-black opacity-80 flex">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="h-full w-12 border-l border-r border-gray-700"></div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-900">
                    <div className="w-full max-w-md space-y-8">
                        {/* Logo/Brand (visible on mobile only) */}
                        <div className="text-center lg:hidden">
                            <h1 className="text-4xl font-bold text-red-600 mb-2">CineViet</h1>
                            <p className="text-gray-400 text-lg">
                                Tham gia cùng CineViet để trải nghiệm điện ảnh đẳng cấp
                            </p>
                        </div>

                        {/* Authentication Form */}
                        <AuthForm isLogin={false} onToggleForm={navigateToLogin} />
                    </div>
                </div>
            </div>
        </div>
    );
}