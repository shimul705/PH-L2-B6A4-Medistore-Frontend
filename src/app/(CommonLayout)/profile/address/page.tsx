"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";

const addresses = [
    {
        id: 1,
        type: "Home",
        name: "John Doe",
        address: "123 Main Street",
        city: "Dhaka",
        state: "Dhaka",
        zip: "1207",
        phone: "+880 123 456 7890",
        isDefault: true,
    },
    {
        id: 2,
        type: "Office",
        name: "John Doe",
        address: "456 Business Ave",
        city: "Dhaka",
        state: "Dhaka",
        zip: "1212",
        phone: "+880 987 654 3210",
        isDefault: false,
    },
];

export default function AddressPage() {
    return (
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
                            <Button variant="outline" size="sm">
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
                                <Button variant="outline" size="sm">
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}