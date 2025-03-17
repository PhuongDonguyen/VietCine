import React from "react";
import { Film, TicketCheck, Sofa, CreditCard } from "lucide-react";

interface FeatureProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function FeatureCard({ icon, title, description }: FeatureProps) {
    return (
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-red-600 transition duration-300">
            <div className="flex items-center justify-center mb-4">
                <div className="text-red-600 p-3 rounded-full">
                    {icon}
                </div>
            </div>
            <h3 className="text-xl text-center font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-center">{description}</p>
        </div>
    );
}

export function WhyChooseUs() {
    const features = [
        {
            icon: <Film size={36} />,
            title: "Phim Đa Dạng",
            description: "Thư viện phim phong phú với các tác phẩm Việt Nam và quốc tế"
        },
        {
            icon: <TicketCheck size={36} />,
            title: "Đặt Vé Dễ Dàng",
            description: "Đặt vé nhanh chóng chỉ với vài bước đơn giản"
        },
        {
            icon: <Sofa size={36} />,
            title: "Chọn Ghế Trực Quan",
            description: "Giao diện chọn ghế thân thiện, dễ sử dụng"
        },
        {
            icon: <CreditCard size={36} />,
            title: "Thanh Toán An Toàn",
            description: "Hỗ trợ nhiều phương thức thanh toán phổ biến tại Việt Nam"
        }
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-black to-gray-900">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-white mb-3">
                    Tại Sao Chọn CineViet?
                </h2>
                <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
                    Chúng tôi mang đến trải nghiệm đặt vé xem phim thuận tiện nhất tại Việt Nam
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
