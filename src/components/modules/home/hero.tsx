import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Hero = () => {
    return (

        <section className="bg-linear-to-r from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 py-16 px-4 w-screen">

            {/* Hero with Image and Text */}
            <div className="container mx-auto mb-16 bg-white p-8 md:p-14 rounded-lg shadow-md">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Text Content */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Your Trusted Online Medicine Shop
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6">
                            Quality medicines delivered to your doorstep. Fast, reliable, and affordable healthcare solutions for your family&#39;s health.
                        </p>
                        <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
                            Get access to verified medicines from licensed sellers with doorstep delivery. Your health is our priority.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/shop">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                                    Browse Medicines
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-900 px-8 py-3 text-lg">
                                    Get Started
                                </Button>
                            </Link>
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-8 flex gap-6 flex-wrap">
                            <div>
                                <p className="text-2xl font-bold text-blue-600">50K+</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-600">100K+</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Orders Delivered</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-600">5000+</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">5-Star Reviews</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="flex justify-center items-center">
                        <div className="relative w-full h-80 md:h-96">
                            <Image
                                src="https://i.ibb.co.com/1Yvc8wmW/hero2.jpg"
                                alt="Medicine Shop"
                                fill
                                className="object-contain"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto">
                {/* Features/Benefits */}
                <div className="grid md:grid-cols-3 gap-6 my-12">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
                        <div className="text-4xl mb-4">✓</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Verified Medicines</h3>
                        <p className="text-gray-600 dark:text-gray-400">100% authentic medicines from licensed sellers</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
                        <div className="text-4xl mb-4">🚚</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Fast Delivery</h3>
                        <p className="text-gray-600 dark:text-gray-400">Quick and reliable delivery at your doorstep</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
                        <div className="text-4xl mb-4">💰</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Affordable Prices</h3>
                        <p className="text-gray-600 dark:text-gray-400">Competitive pricing with best deals on medicines</p>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-12 text-gray-600 dark:text-gray-400 text-center">
                    <p className="mb-4 text-sm">Trusted by thousands of customers</p>
                    <div className="flex justify-center gap-8 flex-wrap">
                        <span className="flex items-center gap-2">
                            <span className="text-2xl">⭐</span>
                            <span>5000+ Reviews</span>
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="text-2xl">👥</span>
                            <span>50K+ Customers</span>
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="text-2xl">📦</span>
                            <span>100K+ Orders</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};
