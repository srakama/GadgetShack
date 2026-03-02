import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

function StatusBadge({ status }) {
    const cls = status === 'active'
        ? 'bg-green-100 text-green-700'
        : status === 'inactive'
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-gray-100 text-gray-500';
    return <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{status}</span>;
}

export default function AdminProductsIndex({ products, categories, markup, filters, pagination }) {
    const [search, setSearch]     = useState(filters.search || '');
    const [status, setStatus]     = useState(filters.status || '');
    const [catId, setCatId]       = useState(filters.catId || '');
    const [deleting, setDeleting] = useState(null);

    const applyFilters = (overrides = {}) => {
        router.get('/admin/products', { search, status, catId, page: 1, ...overrides }, { preserveState: true, replace: true });
    };

    const handleDelete = (p) => {
        if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
        router.delete(`/admin/products/${p.id}`, { preserveScroll: true });
    };

    const toggleFeatured = (p) => {
        router.post(`/admin/products/${p.id}/featured`, {}, { preserveScroll: true });
    };

    const goPage = (pg) => router.get('/admin/products', { ...filters, page: pg }, { preserveState: true, replace: true });

    return (
        <>
            <Head title="Admin — Products" />
            <AdminLayout title="Products">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div>
                        <p className="text-sm text-gray-500">{pagination.total} products · markup <strong>{markup}%</strong></p>
                    </div>
                    <Link href="/admin/products/create"
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                        + New Product
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-4 grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 shadow-sm sm:grid-cols-3">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search: e.target.value })}
                        placeholder="Search name, SKU, vendor…"
                        className="rounded-md border-gray-300 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900"
                    />
                    <select value={status} onChange={(e) => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
                        className="rounded-md border-gray-300 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900">
                        <option value="">All statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                    </select>
                    <select value={catId} onChange={(e) => { setCatId(e.target.value); applyFilters({ catId: e.target.value }); }}
                        className="rounded-md border-gray-300 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900">
                        <option value="">All categories</option>
                        {categories.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-100 text-sm">
                        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            <tr>
                                <th className="px-3 py-3 text-left">Product</th>
                                <th className="px-3 py-3 text-left">Category</th>
                                <th className="px-3 py-3 text-right">Cost</th>
                                <th className="px-3 py-3 text-right">Sale +{markup}%</th>
                                <th className="px-3 py-3 text-center">Stock</th>
                                <th className="px-3 py-3 text-center">Status</th>
                                <th className="px-3 py-3 text-center">⭐</th>
                                <th className="px-3 py-3 text-left">Source</th>
                                <th className="px-3 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((p) => {
                                const salePrice = (Number(p.price) * (1 + markup / 100)).toFixed(2);
                                return (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        {/* Image + Name + SKU */}
                                        <td className="px-3 py-3">
                                            <div className="flex items-center gap-3 min-w-[200px] max-w-[280px]">
                                                {p.images?.[0] ? (
                                                    <img src={p.images[0]} alt={p.name}
                                                        className="h-12 w-12 flex-shrink-0 rounded-lg border object-cover" />
                                                ) : (
                                                    <div className="h-12 w-12 flex-shrink-0 rounded-lg border bg-gray-100 flex items-center justify-center text-gray-300 text-xs">—</div>
                                                )}
                                                <div className="min-w-0">
                                                    <div className="font-medium text-gray-900 line-clamp-2 leading-snug">{p.name}</div>
                                                    <div className="text-[11px] text-gray-400 mt-0.5">SKU: {p.sku}</div>
                                                    {p.vendor && <div className="text-[11px] text-gray-400">Vendor: {p.vendor}</div>}
                                                    {p.grade  && <div className="text-[11px] text-gray-400">Grade: {p.grade}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{p.category_name || '—'}</td>
                                        {/* Base cost */}
                                        <td className="px-3 py-3 text-right text-gray-600 whitespace-nowrap">
                                            R {Number(p.price).toFixed(2)}
                                        </td>
                                        {/* Sale price with markup */}
                                        <td className="px-3 py-3 text-right whitespace-nowrap">
                                            <span className="font-semibold text-gray-900">R {salePrice}</span>
                                            <span className="block text-[10px] text-green-600">+R {(Number(p.price) * markup / 100).toFixed(2)}</span>
                                        </td>
                                        {/* Stock */}
                                        <td className="px-3 py-3 text-center">
                                            <span className={`font-semibold ${p.stock_quantity === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                                                {p.stock_quantity}
                                            </span>
                                        </td>
                                        {/* Status */}
                                        <td className="px-3 py-3 text-center"><StatusBadge status={p.status} /></td>
                                        {/* Featured toggle */}
                                        <td className="px-3 py-3 text-center">
                                            <button onClick={() => toggleFeatured(p)}
                                                className={`text-lg transition ${p.featured ? 'opacity-100' : 'opacity-25 hover:opacity-60'}`}
                                                title={p.featured ? 'Remove from featured' : 'Mark as featured'}>
                                                ⭐
                                            </button>
                                        </td>
                                        {/* Source URL */}
                                        <td className="px-3 py-3">
                                            {p.source_url ? (
                                                <a href={p.source_url} target="_blank" rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium text-blue-600 hover:bg-blue-50 whitespace-nowrap"
                                                    title={p.source_url}>
                                                    🔗 TechMarkIt ↗
                                                </a>
                                            ) : <span className="text-gray-300 text-xs">—</span>}
                                        </td>
                                        {/* Actions */}
                                        <td className="px-3 py-3">
                                            <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                                                <a href={`/products/${p.id}`} target="_blank"
                                                    className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100" title="View on store">👁</a>
                                                <Link href={`/admin/products/${p.id}/edit`}
                                                    className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50">Edit</Link>
                                                <button onClick={() => handleDelete(p)}
                                                    className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {products.length === 0 && (
                        <div className="py-16 text-center text-gray-400">No products found.</div>
                    )}
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between text-sm">
                    <button disabled={pagination.page <= 1}
                        onClick={() => goPage(pagination.page - 1)}
                        className="rounded-md border bg-white px-4 py-2 font-medium text-gray-700 disabled:opacity-40">← Prev</button>
                    <span className="text-gray-500">Page {pagination.page} / {pagination.pages} ({pagination.total} total)</span>
                    <button disabled={pagination.page >= pagination.pages}
                        onClick={() => goPage(pagination.page + 1)}
                        className="rounded-md border bg-white px-4 py-2 font-medium text-gray-700 disabled:opacity-40">Next →</button>
                </div>
            </AdminLayout>
        </>
    );
}

