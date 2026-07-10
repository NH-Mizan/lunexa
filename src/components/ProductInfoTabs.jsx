"use client";

import { useState } from "react";

export default function ProductInfoTabs({ description, review, video }) {
    const [active, setActive] = useState("description");
    const tabs = ["description", "review", "video"];

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-5">
            <div className="mb-4 flex gap-2 overflow-x-auto border-b border-gray-200 pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        className={`shrink-0 rounded-md px-4 py-2 text-sm font-bold uppercase transition ${
                            active === tab
                                ? "bg-pink-50 text-pink-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                        }`}
                        onClick={() => setActive(tab)}
                    >
                        {tab.replace(/([A-Z])/g, ' $1')}
                    </button>
                ))}
            </div>

            <div className="min-w-0 overflow-hidden">
                {active === "description" && (
                    <div
                        className="product-description text-base leading-7 text-gray-700"
                        dangerouslySetInnerHTML={{ __html: description || "No description available." }}
                    />
                )}
                {active === "review" && (
                    <p className="text-base leading-7 text-gray-700">{review || "No reviews yet."}</p>
                )}
                {active === "video" && (
                    <p className="break-words text-base leading-7 text-gray-700">{video || "No video available."}</p>
                )}
            </div>

            <style jsx>{`
                .product-description :global(img),
                .product-description :global(video),
                .product-description :global(iframe) {
                    max-width: 100%;
                    height: auto;
                }

                .product-description :global(table) {
                    display: block;
                    max-width: 100%;
                    overflow-x: auto;
                }
            `}</style>
        </div>
    );
}
