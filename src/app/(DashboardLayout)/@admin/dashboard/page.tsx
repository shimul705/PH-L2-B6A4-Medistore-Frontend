import Link from "next/link";
import {
    Users,
    ShoppingBag,
    Package,
    AlertTriangle,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    Truck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type OrderStatus = "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const stats = [
    {
        label: "Total Users",
        value: 1248,
        icon: Users,
        helper: "Customers + Sellers",
    },
    {
        label: "Total Orders",
        value: 386,
        icon: ShoppingBag,
        helper: "Last 7 days",
    },
    {
        label: "Total Products",
        value: 742,
        icon: Package,
        helper: "Active listings",
    },
    {
        label: "Low Stock",
        value: 23,
        icon: AlertTriangle,
        helper: "Needs attention",
    },
] as const;

const recentOrders: Array<{
    id: string;
    date: string;
    customer: string;
    items: number;
    total: number;
    status: OrderStatus;
}> = [
        { id: "ORD-1021", date: "2026-01-27", customer: "Rahim", items: 3, total: 860, status: "PROCESSING" },
        { id: "ORD-1020", date: "2026-01-26", customer: "Karim", items: 1, total: 320, status: "PLACED" },
        { id: "ORD-1019", date: "2026-01-25", customer: "Sumi", items: 2, total: 540, status: "SHIPPED" },
        { id: "ORD-1018", date: "2026-01-24", customer: "Nadia", items: 5, total: 1200, status: "DELIVERED" },
        { id: "ORD-1017", date: "2026-01-23", customer: "Siam", items: 2, total: 410, status: "CANCELLED" },
    ];

function statusBadge(status: OrderStatus) {
    switch (status) {
        case "PLACED":
            return <Badge variant="outline" className="border-muted-foreground/30">Placed</Badge>;
        case "PROCESSING":
            return <Badge variant="secondary" className="gap-1"><Clock className="h-3.5 w-3.5" />Processing</Badge>;
        case "SHIPPED":
            return <Badge variant="secondary" className="gap-1"><Truck className="h-3.5 w-3.5" />Shipped</Badge>;
        case "DELIVERED":
            return <Badge className="gap-1"><CheckCircle2 className="h-3.5 w-3.5" />Delivered</Badge>;
        case "CANCELLED":
            return <Badge variant="destructive">Cancelled</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Overview of users, orders, and product listings.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href="/dashboard/orders">
                            View Orders <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard/add-product">
                            Add Product <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => (
                    <Card key={s.label} className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">{s.label}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between gap-3">
                            <div>
                                <div className="text-2xl font-bold">{s.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">{s.helper}</p>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                                <s.icon className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main grid */}
            <div className="grid gap-4 lg:grid-cols-3">
                {/* Recent Orders */}
                <Card className="lg:col-span-2 shadow-sm">
                    <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-base">Recent Orders</CardTitle>
                        <Button asChild variant="ghost" className="justify-start sm:justify-center">
                            <Link href="/dashboard/orders" className="flex items-center">
                                View all <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-left text-muted-foreground">
                                    <tr className="border-b">
                                        <th className="py-2 pr-3">Order</th>
                                        <th className="py-2 pr-3">Date</th>
                                        <th className="py-2 pr-3">Customer</th>
                                        <th className="py-2 pr-3">Items</th>
                                        <th className="py-2 pr-3">Status</th>
                                        <th className="py-2 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((o) => (
                                        <tr key={o.id} className="border-b last:border-0">
                                            <td className="py-2 pr-3 font-medium">{o.id}</td>
                                            <td className="py-2 pr-3">{o.date}</td>
                                            <td className="py-2 pr-3">{o.customer}</td>
                                            <td className="py-2 pr-3">{o.items}</td>
                                            <td className="py-2 pr-3">{statusBadge(o.status)}</td>
                                            <td className="py-2 text-right font-medium">৳ {o.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <Link
                            href="/dashboard/users"
                            className="block rounded-lg border p-3 hover:bg-muted transition"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="font-medium">Manage Users</div>
                                    <div className="text-xs text-muted-foreground">
                                        Ban/unban customers & sellers
                                    </div>
                                </div>
                                <ArrowUpRight className="h-4 w-4 mt-1" />
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/update-product"
                            className="block rounded-lg border p-3 hover:bg-muted transition"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="font-medium">Update Products</div>
                                    <div className="text-xs text-muted-foreground">
                                        Edit price, stock, details
                                    </div>
                                </div>
                                <ArrowUpRight className="h-4 w-4 mt-1" />
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/add-product"
                            className="block rounded-lg border p-3 hover:bg-muted transition"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="font-medium">Add New Product</div>
                                    <div className="text-xs text-muted-foreground">
                                        Create a new medicine listing
                                    </div>
                                </div>
                                <ArrowUpRight className="h-4 w-4 mt-1" />
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/orders"
                            className="block rounded-lg border p-3 hover:bg-muted transition"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="font-medium">Track Orders</div>
                                    <div className="text-xs text-muted-foreground">
                                        PLACED → PROCESSING → SHIPPED → DELIVERED
                                    </div>
                                </div>
                                <ArrowUpRight className="h-4 w-4 mt-1" />
                            </div>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
