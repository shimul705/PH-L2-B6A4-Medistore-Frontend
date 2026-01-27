import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export const Navbar = () => {
    return (
        <nav className="bg-white shadow dark:bg-gray-800">
            <div className="container mx-auto p-4 flex items-center justify-between">
                <Link href="/" className="text-2xl font-semibold">
                    Medistore
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-lg">
                        Login
                    </Link>
                    <Link href="/signup" className="text-lg">
                        Sign Up
                    </Link>
                    <Button variant="outline" size="sm">
                        Sell Medicine
                    </Button>
                </div>
            </div>
        </nav>
    );
};
