"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useShopStore from "@/context/cardStore";
import { Bounce, toast } from "react-toastify";

export default function ProductSizeColor({ product, sizes, colors }) {
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const { addToCart } = useShopStore();

    const router = useRouter();

    const handleAddToCart = () => {
        if ((sizes.length && !selectedSize) || (colors.length && !selectedColor)) {
            toast.error("Please select size and color!", {
                position: "bottom-right",
                autoClose: 3000,
                theme: "colored",
                transition: Bounce,
            });
            return;
        }

        const cartItem = {
            ...product, // ✅ full product data
            size: selectedSize || null,
            color: selectedColor || null,
            quantity: 1, // optional (store handle করলেও safe)
        };

        addToCart(cartItem);

        toast.success(`${product.name} added to Cart!`, {
            position: "bottom-right",
            autoClose: 3000,
            theme: "colored",
            transition: Bounce,
        });
    };

    const handleOrderNow = () => {
        if ((sizes.length && !selectedSize) || (colors.length && !selectedColor)) {
            toast.error("Please select size and color!", {
                position: "bottom-right",
                autoClose: 3000,
                theme: "colored",
                transition: Bounce,
            });
            return;
        }

        const cartItem = {
            ...product, // ✅ full product
            size: selectedSize || null,
            color: selectedColor || null,
            quantity: 1,
        };

        addToCart(cartItem);

        toast.success(`${product.name} added to Cart!`, {
            position: "bottom-right",
            autoClose: 3000,
            theme: "colored",
            transition: Bounce,
        });

        router.push("/checkout");
    };

    return (
        <>
            {/* Size */}
            <div className="mb-2">
                <strong>Size:</strong>
                {sizes.map((item, index) => (
                    <span
                        key={index}
                        onClick={() => setSelectedSize(item.size)}
                        className={`ml-2 px-2 py-1 border rounded text-sm cursor-pointer
              ${selectedSize === item.size ? "bg-pink-600 text-white" : ""}`}
                    >
                        {item.size}
                    </span>
                ))}
            </div>

            {/* Color */}
            <div className="mb-2">
                <strong>Color:</strong>
                {colors.length > 0 ? (
                    colors.map((color, index) => (
                        <span
                            key={index}
                            onClick={() => setSelectedColor(color.color)}
                            className={`ml-2 px-2 py-1 border rounded text-sm capitalize cursor-pointer
                ${selectedColor === color.color ? "bg-sky-500 text-white" : ""}`}
                        >
                            {color.color}
                        </span>
                    ))
                ) : (
                    <span className="ml-2 text-gray-400">No Color</span>
                )}
            </div>

            {/* Buttons */}
            <div className="flex-wrap items-center gap-3 mt-4">
                <div className="flex gap-4 mb-2">
                    <button
                        onClick={handleAddToCart}
                        className="bg-pink-600 text-white px-4 lg:px-8 py-2 rounded hover:bg-pink-700 transition"
                    >
                        Add To Cart
                    </button>

                    <button
                        onClick={handleOrderNow}
                        className="bg-sky-500 text-white px-4 lg:px-8 py-2 rounded hover:bg-sky-600 transition"
                    >
                        Order Now
                    </button>
                </div>
            </div>
        </>
    );
}