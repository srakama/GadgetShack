import { Head, router, usePage } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import ProductCard from '@/Components/ProductCard';

export default function Products({ products, categories, vendors = [], filters, pagination, liked_ids = [] }) {
    const currentUrl = usePage().props?.ziggy?.location || '/products';
    const canonical = typeof currentUrl === 'string' ? currentUrl.split('?')[0] : '/products';

    const onSearchChange = (e) => {
        router.get(
            '/products',
            {
                ...filters,
                search: e.target.value,
                page: 1,
            },
            { preserveState: true, replace: true },
        );
    };

    const onCategoryChange = (e) => {
        const value = e.target.value;
        router.get(
            '/products',
            {
                ...filters,
                category: value || null,
                page: 1,
            },
            { preserveState: true, replace: true },
        );
    };

    const onVendorChange = (e) => {
        const value = e.target.value;
        router.get(
            '/products',
            {
                ...filters,
                vendor: value || null,
                page: 1,
            },
            { preserveState: true, replace: true },
        );
    };

    const onSortChange = (e) => {
        const value = e.target.value;
        router.get(
            '/products',
            {
                ...filters,
                sort: value || 'newest',
                page: 1,
            },
            { preserveState: true, replace: true },
        );
    };

    const goToPage = (page) => {
        router.get(
            '/products',
            {
                ...filters,
                page,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Products">
                <meta
                    name="description"
                    content="Browse refurbished gadgets and tech. Filter by category or vendor, and search by name, SKU, or description."
                />
                <link rel="canonical" href={canonical} />
                <meta property="og:title" content="Products" />
                <meta property="og:description" content="Browse refurbished gadgets and tech. Filter by category or vendor, and search by name, SKU, or description." />
                <meta property="og:url" content={canonical} />
                <meta name="twitter:title" content="Products" />
                <meta name="twitter:description" content="Browse refurbished gadgets and tech. Filter by category or vendor, and search by name, SKU, or description." />
            </Head>
            <StorefrontLayout>
                <section className="mx-auto max-w-6xl px-4 py-10">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">Products</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
                        </p>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 shadow-sm md:grid-cols-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600">Search</label>
                            <input
                                value={filters.search || ''}
                                onChange={onSearchChange}
                                placeholder="Search name, SKU, description..."
                                className="mt-1 w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600">Category</label>
                            <select
                                value={filters.category || ''}
                                onChange={onCategoryChange}
                                className="mt-1 w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900"
                            >
                                <option value="">All categories</option>
                                {(categories || []).map((c) => (
                                    <option key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600">Vendor</label>
                            <select
                                value={filters.vendor || ''}
                                onChange={onVendorChange}
                                className="mt-1 w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900"
                            >
                                <option value="">All vendors</option>
                                {(vendors || []).map((v) => (
                                    <option key={v} value={v}>
                                        {v}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600">Sort</label>
                            <select
                                value={filters.sort || 'newest'}
                                onChange={onSortChange}
                                className="mt-1 w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900"
                            >
                                <option value="newest">Newest</option>
                                <option value="name_asc">Name (A-Z)</option>
                                <option value="price_asc">Price (low-high)</option>
                                <option value="price_desc">Price (high-low)</option>
                            </select>
                        </div>
                    </div>

                    {products.length ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {products.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    liked={liked_ids.includes(p.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                            <div className="text-lg font-semibold">No products found</div>
                            <div className="mt-1 text-sm text-gray-600">
                                Try adjusting your search, category, vendor, or sort options.
                            </div>
                            <button
                                type="button"
                                onClick={() => router.get('/products', {}, { replace: true })}
                                className="mt-5 inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}

                    <div className="mt-8 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => goToPage(Math.max(1, pagination.page - 1))}
                            disabled={pagination.page <= 1}
                            className="rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <div className="text-sm text-gray-600">
                            Page {pagination.page} / {pagination.pages}
                        </div>
                        <button
                            type="button"
                            onClick={() => goToPage(Math.min(pagination.pages, pagination.page + 1))}
                            disabled={pagination.page >= pagination.pages}
                            className="rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </section>
            </StorefrontLayout>
        </>
    );
}
