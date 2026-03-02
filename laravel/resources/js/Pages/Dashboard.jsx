import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role === 'admin';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    {/* Welcome card */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <p className="text-lg font-medium">👋 Welcome back, {user?.name}!</p>
                            <p className="mt-1 text-sm text-gray-500">
                                {isAdmin ? 'You have admin access. Manage your store below.' : 'Browse products, track orders, and manage your profile.'}
                            </p>
                        </div>
                    </div>

                    {/* Admin shortcuts */}
                    {isAdmin && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b px-6 py-4">
                                <h3 className="font-semibold text-gray-800">⚙️ Admin Panel</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Quick access to store management</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
                                <Link href="/admin"
                                    className="flex flex-col items-center gap-2 rounded-xl border bg-gray-50 p-4 text-center hover:bg-gray-100 transition">
                                    <span className="text-2xl">🏠</span>
                                    <span className="text-sm font-medium text-gray-700">Admin Dashboard</span>
                                </Link>
                                <Link href="/admin/products"
                                    className="flex flex-col items-center gap-2 rounded-xl border bg-gray-50 p-4 text-center hover:bg-gray-100 transition">
                                    <span className="text-2xl">📦</span>
                                    <span className="text-sm font-medium text-gray-700">All Products</span>
                                </Link>
                                <Link href="/admin/products/create"
                                    className="flex flex-col items-center gap-2 rounded-xl border bg-gray-50 p-4 text-center hover:bg-gray-100 transition">
                                    <span className="text-2xl">➕</span>
                                    <span className="text-sm font-medium text-gray-700">New Product</span>
                                </Link>
                                <Link href="/admin/orders"
                                    className="flex flex-col items-center gap-2 rounded-xl border bg-gray-50 p-4 text-center hover:bg-gray-100 transition">
                                    <span className="text-2xl">🧾</span>
                                    <span className="text-sm font-medium text-gray-700">Orders</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Customer shortcuts */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b px-6 py-4">
                            <h3 className="font-semibold text-gray-800">🛍️ My Store</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
                            <Link href="/products"
                                className="flex flex-col items-center gap-2 rounded-xl border bg-gray-50 p-4 text-center hover:bg-gray-100 transition">
                                <span className="text-2xl">🔍</span>
                                <span className="text-sm font-medium text-gray-700">Browse Products</span>
                            </Link>
                            <Link href="/cart"
                                className="flex flex-col items-center gap-2 rounded-xl border bg-gray-50 p-4 text-center hover:bg-gray-100 transition">
                                <span className="text-2xl">🛒</span>
                                <span className="text-sm font-medium text-gray-700">My Cart</span>
                            </Link>
                            <Link href="/orders"
                                className="flex flex-col items-center gap-2 rounded-xl border bg-gray-50 p-4 text-center hover:bg-gray-100 transition">
                                <span className="text-2xl">📋</span>
                                <span className="text-sm font-medium text-gray-700">My Orders</span>
                            </Link>
                            <Link href={route('profile.edit')}
                                className="flex flex-col items-center gap-2 rounded-xl border bg-gray-50 p-4 text-center hover:bg-gray-100 transition">
                                <span className="text-2xl">👤</span>
                                <span className="text-sm font-medium text-gray-700">My Profile</span>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
