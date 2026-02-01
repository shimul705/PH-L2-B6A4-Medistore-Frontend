import Link from 'next/link';
import { Package, Clock, CheckCircle, ShoppingBag } from 'lucide-react';

// 1. Mock Data (Replace with API calls later)
// Based on Customer Features: Track order status, Order history
const mockStats = [
    { label: 'Total Orders', value: 12, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending', value: 2, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Delivered', value: 10, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
];

const recentOrders = [
    { id: 'ORD-001', date: '2023-10-25', total: '$45.00', status: 'Processing' },
    { id: 'ORD-002', date: '2023-10-20', total: '$12.50', status: 'Delivered' },
    { id: 'ORD-003', date: '2023-10-15', total: '$120.00', status: 'Delivered' },
    { id: 'ORD-004', date: '2023-10-01', total: '$30.00', status: 'Cancelled' },
];

export default function UserDashboard() {
    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
                    <p className="text-gray-500">Welcome back! Here is your medicine order summary.</p>
                </div>
                <Link
                    href="/shop"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                    <ShoppingBag size={18} />
                    Browse Medicines
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockStats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                    <Link href="/orders" className="text-blue-600 text-sm hover:underline">
                        View All
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 font-medium">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Total Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{order.id}</td>
                                    <td className="p-4">{order.date}</td>
                                    <td className="p-4">{order.total}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'}`
                                        }>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link href={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}