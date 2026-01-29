"use client";
import { useState } from "react";
import Image from "next/image";
import {
    Home,
    Package,
    MapPin,
    Heart,
    LogOut,
    Search,
    Calendar,
    Trash2,
    Plus,
    Edit,
    Menu,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function Page() {
    const [activeTab, setActiveTab] = useState("account");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Order Details Data
    const orders = [
        {
            id: "#ORD-2024-001",
            date: "2024-01-20",
            status: "Delivered",
            total: "$249.99",
            items: 3,
            image:
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            products: ["Wireless Headphones", "Phone Case", "USB Cable"],
        },
        {
            id: "#ORD-2024-002",
            date: "2024-01-18",
            status: "Processing",
            total: "$89.50",
            items: 1,
            image:
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
            products: ["Smart Watch"],
        },
        {
            id: "#ORD-2024-003",
            date: "2024-01-15",
            status: "Shipped",
            total: "$159.99",
            items: 2,
            image:
                "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
            products: ["Sunglasses", "Wallet"],
        },
        {
            id: "#ORD-2024-004",
            date: "2024-01-10",
            status: "Cancelled",
            total: "$45.00",
            items: 1,
            image:
                "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400",
            products: ["Book"],
        },
    ];

    // Wishlist Data
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
            image:
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
            stock: "In Stock",
            rating: 4.8,
        },
        {
            id: 3,
            name: "Minimalist Watch",
            price: "$299.99",
            image:
                "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400",
            stock: "Out of Stock",
            rating: 4.6,
        },
        {
            id: 4,
            name: "Designer Sneakers",
            price: "$159.99",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
            stock: "In Stock",
            rating: 4.7,
        },
    ]

    // Delivery Addresses Data
    const addresses = [
        {
            id: 1,
            type: "Home",
            name: "John Doe",
            address: "123 Main Street, Apt 4B",
            city: "Dhaka",
            state: "Dhaka Division",
            zip: "1000",
            phone: "+880 1234 567 890",
            isDefault: true,
        },
        {
            id: 2,
            type: "Office",
            name: "John Doe",
            address: "456 Business Avenue, Floor 5",
            city: "Dhaka",
            state: "Dhaka Division",
            zip: "1212",
            phone: "+880 1234 567 891",
            isDefault: false,
        },
        {
            id: 3,
            type: "Other",
            name: "Jane Doe",
            address: "789 Park Road, House 12",
            city: "Chittagong",
            state: "Chittagong Division",
            zip: "4000",
            phone: "+880 1234 567 892",
            isDefault: false,
        }]


    const getStatusColor = (status: string) => {
        switch (status) {
            case "Delivered":
                return "bg-green-100 text-green-800";
            case "Processing":
                return "bg-blue-100 text-blue-800";
            case "Shipped":
                return "bg-purple-100 text-purple-800";
            case "Cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const menuItems = [
        { id: "account", icon: Home, label: "Account Information" },
        { id: "orders", icon: Package, label: "Order Details" },
        { id: "addresses", icon: MapPin, label: "Delivery Address" },
        { id: "wishlist", icon: Heart, label: "Wishlist" },
        { id: "logout", icon: LogOut, label: "Logout" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}




            {/* Main Content */}
            <div className="flex-1 w-full">
                {/* Top Bar */}
                <div className="bg-white border-b sticky top-0 z-20 md:hidden">
                    <div className="flex items-center justify-between px-4 py-4">
                        <h1 className="text-lg font-semibold text-gray-900">MediStore</h1>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            {sidebarOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-6 md:p-8">
                    {/* Account Information Tab */}
                    {activeTab === "account" && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Account Information
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Update your photo and personal information here
                                    </p>
                                </div>
                                <Button className="bg-primary hover:bg-primary/90 text-white">
                                    Save Changes
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                    <Label
                                        htmlFor="firstName"
                                        className="text-sm font-medium text-gray-900"
                                    >
                                        First Name
                                    </Label>
                                    <div className="sm:col-span-2">
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            placeholder="Your first name"
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                    <Label
                                        htmlFor="lastName"
                                        className="text-sm font-medium text-gray-900"
                                    >
                                        Last Name
                                    </Label>
                                    <div className="sm:col-span-2">
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            placeholder="Your last name"
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium text-gray-900"
                                    >
                                        Email
                                    </Label>
                                    <div className="sm:col-span-2">
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Your email"
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                    <Label
                                        htmlFor="phone"
                                        className="text-sm font-medium text-gray-900"
                                    >
                                        Phone Number
                                    </Label>
                                    <div className="sm:col-span-2">
                                        <div className="flex">
                                            <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                                                <div className="w-6 h-4 bg-red-500 rounded-sm mr-2"></div>
                                                <span className="text-sm text-gray-700">BD</span>
                                                <svg
                                                    className="w-4 h-4 ml-1 text-gray-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="+880"
                                                className="rounded-l-none flex-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-6 border-t">
                                    <Label className="text-sm font-medium text-gray-900">
                                        Password
                                    </Label>
                                    <div className="sm:col-span-2 flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            Updated 28 minutes ago
                                        </span>
                                        <Button
                                            variant="link"
                                            className="text-sm underline p-0 h-auto"
                                        >
                                            Update
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order Details Tab */}
                    {activeTab === "orders" && (
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
                    )}

                    {/* Wishlist Tab */}
                    {activeTab === "wishlist" && (
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
                                            <Button
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Delivery Address Tab */}
                    {activeTab === "addresses" && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Delivery Addresses
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Manage your saved addresses
                                    </p>
                                </div>
                                <Button className="bg-primary hover:bg-primary/90 text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.map((address) => (
                                    <div
                                        key={address.id}
                                        className="border rounded-lg p-5 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Badge variant="outline">{address.type}</Badge>
                                                    {address.isDefault && (
                                                        <Badge className="bg-green-100 text-green-800">
                                                            Default
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {address.name}
                                                </h3>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            {address.address}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {address.city}, {address.state} {address.zip}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {address.phone}
                                        </p>
                                        {!address.isDefault && (
                                            <div className="mt-3 flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs flex-1"
                                                >
                                                    Set Default
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Logout Tab */}
                    {activeTab === "logout" && (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md mx-auto">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LogOut className="w-8 h-8 text-red-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Logout
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to logout from your account?
                            </p>
                            <div className="flex flex-col space-y-2">
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Confirm Logout
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setActiveTab("account")}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}