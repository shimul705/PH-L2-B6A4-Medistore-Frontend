"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const router = useRouter();

    const handleLogout = () => {
        // Add your logout logic here
        // logout();
        router.push("/");
    };

    return (
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
                    onClick={handleLogout}
                >
                    Confirm Logout
                </Button>
                <Button
                    variant="outline"
                    onClick={() => router.push("/profile")}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}