"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import Image from "next/image";

const wishlist = [
    {
        id: 1,
        name: "Premium Leather Backpack",
        price: "$129.99",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        stock: "In Stock",
        rating: 4.5,
    },
    {
        id: 2,
        name: "Wireless Earbuds Pro",
        price: "$199.99",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
        stock: "In Stock",
        rating: 4.8,
    },
];

export default function WishlistPage() {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    My Wishlist
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                    {wishlist.length} items saved for later
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlist.map((item) => (
                    <div
                        key={item.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={200}
                            height={200}
                            className="rounded-md object-cover w-full h-40 mb-3"
                        />
                        <h3 className="font-semibold text-gray-900 mb-1">
                            {item.name}
                        </h3>
                        <div className="text-lg font-bold text-gray-900 mb-2">
                            {item.price}
                        </div>
                        <div className="flex items-center space-x-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(item.rating)
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                            <span className="text-xs text-gray-600 ml-1">
                                {item.rating}
                            </span>
                        </div>
                        <Badge
                            variant={
                                item.stock === "In Stock"
                                    ? "default"
                                    : "secondary"
                            }
                            className="mb-3"
                        >
                            {item.stock}
                        </Badge>
                        <div className="flex space-x-2">
                            <Button
                                size="sm"
                                className="flex-1 bg-primary hover:bg-primary/90"
                            >
                                Add to Cart
                            </Button>
                            <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}