import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="bg-slate-900 text-gray-300 py-12 px-4">
            <div className="container mx-auto">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                            💊 MediStore
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Your trusted online medicine shop providing quality medicines at affordable prices with fast delivery.
                        </p>
                        <div className="flex gap-4 text-lg">
                            <a href="#" className="hover:text-blue-400 transition">f</a>
                            <a href="#" className="hover:text-blue-400 transition">t</a>
                            <a href="#" className="hover:text-blue-400 transition">in</a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-blue-400 transition">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop" className="text-gray-400 hover:text-blue-400 transition">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-blue-400 transition">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-blue-400 transition">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Customer Service</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-blue-400 transition">
                                    Track Orders
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-blue-400 transition">
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-blue-400 transition">
                                    Returns
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-blue-400 transition">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Seller & Admin */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">For Sellers</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/register" className="text-gray-400 hover:text-blue-400 transition">
                                    Become a Seller
                                </Link>
                            </li>
                            <li>
                                <Link href="/seller/dashboard" className="text-gray-400 hover:text-blue-400 transition">
                                    Seller Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-blue-400 transition">
                                    Seller Guidelines
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-blue-400 transition">
                                    Partner with Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 pt-8 mt-8">
                    {/* Info Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📞</span>
                            <div>
                                <p className="text-sm text-gray-400">24/7 Customer Support</p>
                                <p className="text-white font-semibold">+1-800-MEDICINE</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📧</span>
                            <div>
                                <p className="text-sm text-gray-400">Email Us</p>
                                <p className="text-white font-semibold">support@medistore.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📍</span>
                            <div>
                                <p className="text-sm text-gray-400">Headquarters</p>
                                <p className="text-white font-semibold">123 Medical St, Healthcare City</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-700">
                        <div className="text-sm text-gray-400">
                            &copy; 2026 MediStore. All rights reserved.
                        </div>
                        <div className="flex gap-6 text-sm">
                            <Link href="#" className="text-gray-400 hover:text-blue-400 transition">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-blue-400 transition">
                                Terms of Service
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-blue-400 transition">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
