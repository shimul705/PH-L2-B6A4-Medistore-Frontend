"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, LayoutDashboard, Search, ShoppingCart, Bell } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useAuth } from "@/src/providers/auth-provider";
import { useCart } from "@/src/providers/cart-provider";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [search, setSearch] = useState("");
    const router = useRouter();
    const { user, logout } = useAuth();
    const { count } = useCart();

    const handleLogOut = () => {
        void logout();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/shop${search ? `?search=${encodeURIComponent(search)}` : ""}`);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMobileMenuOpen]);

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4">
                {/* Main Navbar */}
                <div className="flex justify-between items-center h-16">
                    {/* Left Section - Logo and Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="text-primary w-6 h-6" />
                            ) : (
                                <Menu className="text-primary w-6 h-6" />
                            )}
                        </button>

                        <Link href="/" className="shrink-0 flex items-center gap-2">
                            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                <span className="text-xl">💊</span>
                            </div>
                            <h3 className="hidden sm:block text-xl font-bold text-gray-900">
                                MediStore
                            </h3>
                        </Link>
                    </div>

                    {/* Center Section - Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-gray-700 font-medium hover:text-primary transition-colors text-sm"
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className="text-gray-700 font-medium hover:text-primary transition-colors text-sm"
                        >
                            Products
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-700 font-medium hover:text-primary transition-colors text-sm"
                        >
                            About Us
                        </Link>
                    </nav>

                    {/* Right Section - Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Search Bar - Hidden on mobile */}
                        <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search medicines..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-40"
                            />
                        </form>

                        {/* Icons */}
                        <Link href="/cart" className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative md:flex hidden">
                            <ShoppingCart className="w-5 h-5 text-gray-700" />
                            {count > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {count}
                                </span>
                            )}
                        </Link>

                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative md:flex hidden">
                            <Bell className="w-5 h-5 text-gray-700" />
                            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4"></span>
                        </button>

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="rounded-lg hover:bg-gray-100 transition-colors p-1">
                                    <Avatar>
                                        <AvatarFallback className="text-base font-bold bg-linear-to-br from-blue-500 to-blue-600 text-white cursor-pointer">
                                            {(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel className="text-base">{user.name || "My Account"}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer">
                                        <Link href="/dashboard/profile" className="w-full">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">
                                        <Link href="/dashboard/orders" className="w-full">Order Details</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer focus:bg-blue-50">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <Link href="/dashboard" className="w-full">Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600"
                                        onClick={handleLogOut}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login" className="hidden md:block">
                                <Button className="rounded-lg bg-primary hover:bg-blue-700 text-white font-semibold transition-colors">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pb-4 pt-2 border-t border-gray-200">
                        <nav className="flex flex-col space-y-2">
                            <Link
                                href="/"
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/products"
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Products
                            </Link>
                            <Link
                                href="/about"
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About Us
                            </Link>
                            {user ? (
                                <>
                                    <Link href="/cart" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                        Cart ({count})
                                    </Link>
                                    <Link href="/dashboard" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                        Dashboard
                                    </Link>
                                    <Button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            handleLogOut();
                                        }}
                                        className="w-full mt-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full mt-2 rounded-lg bg-primary hover:bg-blue-700 text-white font-semibold">
                                        Login
                                    </Button>
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}