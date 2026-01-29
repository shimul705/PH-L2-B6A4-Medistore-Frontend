"use client";

import { Calendar, Search } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const orders = [
    {
        id: "#ORD-2024-001",
        date: "2024-01-20",
        status: "Delivered",
        total: "$249.99",
        items: 3,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        products: ["Wireless Headphones", "Phone Case", "USB Cable"],
    },
    // ...add more orders
];

const getStatusColor = (status: string) => {
    switch (status) {
        case "Delivered":
            return "bg-green-100 text-green-800";
        case "Processing":
            return "bg-blue-100 text-blue-800";
        case "Shipped":
            return "bg-yellow-100 text-yellow-800";
        case "Cancelled":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export default function OrderDetailsPage() {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Order Details
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                    View and track all your orders
                </p>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Search orders..."
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                            <div className="flex items-start space-x-4 flex-1">
                                <Image
                                    src={order.image}
                                    alt="Product"
                                    width={80}
                                    height={80}
                                    className="rounded-md object-cover"
                                />
                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                        <h3 className="font-semibold text-gray-900">
                                            {order.id}
                                        </h3>
                                        <Badge className={getStatusColor(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {order.date}
                                        </div>
                                        <span>{order.items} items</span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        {order.products.join(", ")}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-semibold text-gray-900">
                                    {order.total}
                                </div>
                                <Button variant="outline" size="sm" className="mt-2">
                                    View Details
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}