"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useShopStore from "@/context/cardStore";
import { Bounce, toast } from "react-toastify";

export default function ProductSizeColor({ product, sizes = [], colors = [] }) {
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const { addToCart } = useShopStore();
    const router = useRouter();

    const validateSelection = () => {
        if ((sizes.length && !selectedSize) || (colors.length && !selectedColor)) {
            toast.error("Please select size and color!", {
                position: "bottom-right",
                autoClose: 3000,
                theme: "colored",
                transition: Bounce,
            });
            return false;
        }

        return true;
    };

    const getCartItem = () => ({
        ...product,
        size: selectedSize || null,
        color: selectedColor || null,
        quantity: 1,
    });

    const handleAddToCart = () => {
        if (!validateSelection()) return;

        addToCart(getCartItem());

        toast.success(`${product.name} added to Cart!`, {
            position: "bottom-right",
            autoClose: 3000,
            theme: "colored",
            transition: Bounce,
        });
    };

    const handleOrderNow = () => {
        if (!validateSelection()) return;

        addToCart(getCartItem());

        toast.success(`${product.name} added to Cart!`, {
            position: "bottom-right",
            autoClose: 3000,
            theme: "colored",
            transition: Bounce,
        });

        router.push("/checkout");
    };

    return (
        <div className="space-y-5">
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">Size</span>
                    {selectedSize && <span className="text-sm font-semibold text-gray-900">{selectedSize}</span>}
                </div>

                {sizes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((item, index) => (
                            <button
                                key={item.id ?? item.size ?? index}
                                type="button"
                                onClick={() => setSelectedSize(item.size)}
                                className={`min-w-11 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                                    selectedSize === item.size
                                        ? "border-black bg-black text-white"
                                        : "border-gray-300 bg-white text-gray-900 hover:border-black"
                                }`}
                            >
                                {item.size}
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                        No size option
                    </p>
                )}
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">Color</span>
                    {selectedColor && <span className="text-sm font-semibold capitalize text-gray-900">{selectedColor}</span>}
                </div>

                {colors.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {colors.map((item, index) => (
                            <button
                                key={item.id ?? item.color ?? index}
                                type="button"
                                onClick={() => setSelectedColor(item.color)}
                                className={`rounded-lg border px-4 py-2 text-sm font-semibold capitalize transition ${
                                    selectedColor === item.color
                                        ? "border-black bg-black text-white"
                                        : "border-gray-300 bg-white text-gray-900 hover:border-black"
                                }`}
                            >
                                {item.color}
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                        No color option
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={handleAddToCart}
                    className="rounded-xl border border-black bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-black transition hover:bg-black hover:text-white"
                >
                    Add To Cart
                </button>

                <button
                    type="button"
                    onClick={handleOrderNow}
                    className="rounded-xl border border-black bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-black transition hover:bg-black hover:text-white"
                >
                    Order Now
                </button>
            </div>
        </div>
    );
}
