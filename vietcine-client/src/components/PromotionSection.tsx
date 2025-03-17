import { useNavigate } from "react-router-dom";

interface PromotionProps {
    title: string;
    description: string;
    image: string;
    linkText: string;
}

function PromotionCard({ title, description, image, linkText }: PromotionProps) {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-900 rounded-lg overflow-hidden group">
            <div className="aspect-[16/9] overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400 mb-4">{description}</p>
                <button
                    onClick={() => navigate("/promotions")}
                    className="text-red-600 font-medium hover:text-red-500 transition duration-300"
                >
                    {linkText} &rarr;
                </button>
            </div>
        </div>
    );
}

export function PromotionSection() {
    const promotions = [
        {
            title: "Ưu đãi thành viên mới",
            description: "Đăng ký thành viên mới và nhận ngay 1 vé xem phim miễn phí cùng combo bắp nước.",
            image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2059&q=80",
            linkText: "Xem chi tiết"
        },
        {
            title: "Thứ 4 vui vẻ",
            description: "Giảm 50% giá vé xem phim vào mọi suất chiếu ngày thứ 4 hàng tuần.",
            image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            linkText: "Xem chi tiết"
        },
        {
            title: "Ưu đãi sinh nhật",
            description: "Nhận 2 vé xem phim miễn phí trong tháng sinh nhật của bạn.",
            image: "https://images.unsplash.com/photo-1627413837304-731afeac0d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
            linkText: "Xem chi tiết"
        }
    ];

    return (
        <section className="py-16 bg-black">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-white mb-3 text-center">
                    <span className="border-b-2 border-red-600 pb-1">Ưu Đãi Đặc Biệt</span>
                </h2>
                <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
                    Khám phá những ưu đãi hấp dẫn chỉ có tại CineViet
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {promotions.map((promo, index) => (
                        <PromotionCard
                            key={index}
                            title={promo.title}
                            description={promo.description}
                            image={promo.image}
                            linkText={promo.linkText}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
