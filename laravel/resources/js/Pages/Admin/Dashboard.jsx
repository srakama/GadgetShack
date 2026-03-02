import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function StatCard({ label, value, sub, color = 'gray', href }) {
    const colors = {
        gray:   'bg-white border-gray-200',
        blue:   'bg-blue-50 border-blue-200',
        green:  'bg-green-50 border-green-200',
        yellow: 'bg-yellow-50 border-yellow-200',
        red:    'bg-red-50 border-red-200',
        purple: 'bg-purple-50 border-purple-200',
    };
    const inner = (
        <div className={`rounded-xl border p-5 shadow-sm ${colors[color]}`}>
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
            <div className="mt-1 text-3xl font-bold text-gray-900">{value}</div>
            {sub && <div className="mt-1 text-xs text-gray-500">{sub}</div>}
        </div>
    );
    return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function AdminDashboard({ stats, recent, markup }) {
    return (
        <>
            <Head title="Admin Dashboard" />
            <AdminLayout title="Dashboard">
                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    <StatCard label="Total Products" value={stats.total_products} color="blue" href="/admin/products" />
                    <StatCard label="Active" value={stats.active_products} color="green" href="/admin/products?status=active" />
                    <StatCard label="Inactive" value={stats.inactive_products} color="yellow" href="/admin/products?status=inactive" />
                    <StatCard label="Featured" value={stats.featured_products} color="purple" href="/admin/products?featured=1" />
                    <StatCard label="Out of Stock" value={stats.out_of_stock} color="red" />
                    <StatCard label="Total Orders" value={stats.total_orders} color="blue" href="/admin/orders" />
                    <StatCard label="Revenue (paid)" value={`R ${Number(stats.total_revenue || 0).toFixed(2)}`} color="green" />
                    <StatCard label="Customers" value={stats.total_users} color="gray" />
                    <StatCard label="Categories" value={stats.total_categories} color="gray" />
                    <StatCard label="Markup" value={`${markup}%`} sub="env MARKUP_PERCENT" color="purple" />
                </div>

                {/* Quick actions */}
                <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/admin/products/create"
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                        + New Product
                    </Link>
                    <Link href="/admin/products"
                        className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        All Products
                    </Link>
                    <Link href="/admin/orders"
                        className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        All Orders
                    </Link>
                    <Link href="/products" target="_blank"
                        className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        🛍️ View Store
                    </Link>
                </div>

                {/* Recent products */}
                <div className="mt-8">
                    <h2 className="mb-3 text-base font-semibold text-gray-800">Recently Added Products</h2>
                    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3 text-left">Product</th>
                                    <th className="px-4 py-3 text-left">Category</th>
                                    <th className="px-4 py-3 text-right">Cost</th>
                                    <th className="px-4 py-3 text-right">Sale ({markup}%)</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recent.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {p.images?.[0] ? (
                                                    <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover border" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-lg bg-gray-100 border flex items-center justify-center text-gray-300 text-xs">—</div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900 line-clamp-1">{p.name}</div>
                                                    <div className="text-xs text-gray-400">{p.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{p.category_name || '—'}</td>
                                        <td className="px-4 py-3 text-right text-gray-700">R {Number(p.price).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                            R {(Number(p.price) * (1 + markup / 100)).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold
                                                ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link href={`/admin/products/${p.id}/edit`}
                                                className="text-xs font-medium text-blue-600 hover:underline">Edit</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}

