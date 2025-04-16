import { useNavigate } from "react-router-dom";

export function HeroSection() {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2970&q=80"
                    alt="Cinema Theater"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20"></div>
            </div>

            {/* Hero Content */}
            <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    <span className="block">Trải Nghiệm Điện Ảnh</span>
                    <span className="block text-red-600">Đẳng Cấp Việt Nam</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mb-8">
                    Khám phá những bộ phim hấp dẫn nhất tại các rạp chiếu tại thành phố Hồ Chí Minh. Đặt vé trực tuyến nhanh chóng và thuận tiện.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={() => navigate("/movies")}
                        className="px-8 py-3 bg-red-600 text-white text-lg font-semibold rounded-md hover:bg-red-700 transition duration-300">
                        Khám Phá Phim
                    </button>
                    <button
                        onClick={() => navigate("/tickets")}
                        className="px-8 py-3 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-md hover:bg-white/10 transition duration-300">
                        Đặt Vé Ngay
                    </button>
                </div>
            </div>
        </div>
    );
}
