"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Home,
    Package,
    MapPin,
    Heart,
    LogOut,
    Menu,
    X,
} from "lucide-react";

const menuItems = [
    { id: "account", href: "/profile", icon: Home, label: "Account Information" },
    { id: "orders", href: "/profile/orders", icon: Package, label: "Order Details" },
    { id: "addresses", href: "/profile/address", icon: MapPin, label: "Delivery Address" },
    { id: "wishlist", href: "/profile/wishlist", icon: Heart, label: "Wishlist" },
    { id: "logout", href: "/profile/logout", icon: LogOut, label: "Logout" },
];

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/profile") {
            return pathname === "/profile";
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } md:relative md:translate-x-0 md:w-64 pt-20 md:pt-0`}
            >
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">💊 MediStore</h2>
                    <p className="text-sm text-gray-600 mt-1">Dashboard</p>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                                    ? "bg-primary text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

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
                    {children}
                </div>
            </div>
        </div>
    );
}