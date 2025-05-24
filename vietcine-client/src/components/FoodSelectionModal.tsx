import { useState, useEffect } from "react";
import { X, CupSoda, Plus, Minus } from "lucide-react";
import axios from "axios";

interface Food {
    id: number;
    foodName: string;
    description: string;
    price: number;
}

interface FoodItem extends Food {
    quantity: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selectedFoods: FoodItem[]) => void;
    theaterBrandId: number; // Added theaterBrandId prop
}

export function FoodSelectionModal({ isOpen, onClose, onConfirm, theaterBrandId }: Props) {
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8081/api/food?theaterBrandId=${theaterBrandId}`);

                if (response.data.success) {
                    // Convert the API food items to FoodItems with quantity
                    const foodItems: FoodItem[] = response.data.data.map((food: Food) => ({
                        ...food,
                        quantity: 0
                    }));
                    setFoods(foodItems);
                } else {
                    setError("Failed to load food items");
                }
            } catch (err) {
                setError("Failed to load food items. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchFoods();
        }
    }, [isOpen, theaterBrandId]);

    const handleQuantityChange = (id: number, change: number) => {
        const updatedFoods = foods.map(food => {
            if (food.id === id) {
                // Limit quantity to a maximum of 8 items per food
                const newQuantity = Math.min(8, Math.max(0, food.quantity + change));
                return { ...food, quantity: newQuantity };
            }
            return food;
        });

        setFoods(updatedFoods);

        // Update selected foods
        const newSelectedFoods = updatedFoods.filter(food => food.quantity > 0);
        setSelectedFoods(newSelectedFoods);
    };

    const getTotalAmount = (): number => {
        return foods.reduce((total, food) => total + (food.price * food.quantity), 0);
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price).replace("₫", "đ");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <h2 className="text-xl font-semibold flex items-center">
                        <CupSoda className="h-5 w-5 mr-2 text-red-600" />
                        Combo - Bắp nước
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : foods.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-400 text-lg">Hiện tại rạp chưa bổ sung bắp nước, quý khách vui lòng tiếp tục nhé!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {foods.map((food) => (
                                <div key={food.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
                                    <div className="flex-1">
                                        <h3 className="font-medium">{food.foodName}</h3>
                                        <p className="text-sm text-gray-400">{food.description}</p>
                                        <p className="text-red-600 mt-1">{formatPrice(food.price)}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => handleQuantityChange(food.id, -1)}
                                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50"
                                            disabled={food.quantity <= 0}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-8 text-center">{food.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(food.id, 1)}
                                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50"
                                            disabled={food.quantity >= 8}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-800">
                    <div className="flex justify-between mb-4 text-lg font-semibold">
                        <h3>Tạm tính</h3>
                        <p className="text-red-600">{formatPrice(getTotalAmount())}</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => onConfirm(selectedFoods)}
                            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-300"
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}