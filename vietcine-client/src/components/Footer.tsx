import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-red-600 mb-4">CineViet</h2>
                        <p className="mb-4">Trải nghiệm điện ảnh đẳng cấp Việt Nam với hệ thống rạp chiếu trên toàn quốc.</p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Liên Kết</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="hover:text-white transition duration-300">Trang chủ</a></li>
                            <li><a href="/movies" className="hover:text-white transition duration-300">Phim đang chiếu</a></li>
                            <li><a href="/movies" className="hover:text-white transition duration-300">Phim sắp chiếu</a></li>
                            <li><a href="/theaters" className="hover:text-white transition duration-300">Rạp chiếu phim</a></li>
                            <li><a href="/promotions" className="hover:text-white transition duration-300">Ưu đãi</a></li>
                            <li><a href="/news" className="hover:text-white transition duration-300">Tin tức</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Trợ Giúp</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition duration-300">Câu hỏi thường gặp</a></li>
                            <li><a href="#" className="hover:text-white transition duration-300">Hướng dẫn đặt vé</a></li>
                            <li><a href="#" className="hover:text-white transition duration-300">Chính sách bảo mật</a></li>
                            <li><a href="#" className="hover:text-white transition duration-300">Điều khoản sử dụng</a></li>
                            <li><a href="#" className="hover:text-white transition duration-300">Liên hệ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Liên Hệ</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0" />
                                <span>Số 123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={20} className="mr-2 flex-shrink-0" />
                                <span>0123 456 789</span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={20} className="mr-2 flex-shrink-0" />
                                <span>info@cineviet.vn</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p>© 2025 CineViet. Tất cả quyền được bảo lưu.</p>
                    <div className="mt-4 md:mt-0">
                        <img
                            src="https://dummyimage.com/200x30/666/fff&text=Phương+thức+thanh+toán"
                            alt="Phương thức thanh toán"
                            className="h-8"
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
}
