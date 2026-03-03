import { Head, Link, router } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import ProductCard from '@/Components/ProductCard';

export default function Home({ products, categories = [], new_arrivals = [], liked_ids = [] }) {
    const submitHeroSearch = (e) => {
        e.preventDefault();
        const q = e.currentTarget?.elements?.search?.value?.trim();
        if (q) router.get('/products', { search: q });
    };

    return (
        <>
            <Head title="GadgetVilla">
                <meta
                    name="description"
                    content="Shop refurbished tech and gadgets at great prices. Browse smartphones, laptops, tablets and accessories."
                />
                <link rel="canonical" href="/" />
                <meta property="og:title" content="GadgetVilla" />
                <meta property="og:description" content="Shop refurbished tech and gadgets at great prices. Browse smartphones, laptops, tablets and accessories." />
                <meta property="og:url" content="/" />
                <meta name="twitter:title" content="GadgetVilla" />
                <meta name="twitter:description" content="Shop refurbished tech and gadgets at great prices. Browse smartphones, laptops, tablets and accessories." />
            </Head>
            <StorefrontLayout>
                <section className="border-b bg-white">
                    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 lg:grid-cols-2 lg:py-16">
                        <div>
                            <div className="inline-flex items-center rounded-full border bg-gray-50 px-3 py-1 text-xs text-gray-700">
                                Refurbished tech. Great prices.
                            </div>
                            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                Find your next gadget at GadgetVilla
                            </h1>
                            <p className="mt-4 text-base leading-relaxed text-gray-600">
                                Browse a curated catalog of smartphones, laptops, tablets and accessories.
                                New stock lands often.
                            </p>

                            <form onSubmit={submitHeroSearch} className="mt-6">
                                <label className="block text-xs font-medium text-gray-600">Search the catalog</label>
                                <div className="mt-2 flex gap-2">
                                    <input
                                        name="search"
                                        placeholder="Try “iPhone”, “Lenovo”, “headphones”…"
                                        className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900"
                                    />
                                    <button
                                        type="submit"
                                        className="inline-flex flex-shrink-0 items-center justify-center rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
                                    >
                                        Search
                                    </button>
                                </div>
                                {categories?.length ? (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {categories.slice(0, 8).map((c) => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => router.get('/products', { category: String(c.id) })}
                                                className="rounded-full border bg-gray-50 px-3 py-1 text-xs text-gray-800 hover:bg-gray-100"
                                            >
                                                {c.name}
                                            </button>
                                        ))}
                                    </div>
                                ) : null}
                            </form>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/products"
                                    className="inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
                                >
                                    Browse products
                                </Link>
                                <Link
                                    href="#featured"
                                    className="inline-flex items-center justify-center rounded-md border bg-white px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                                >
                                    View featured
                                </Link>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-gray-900 to-gray-700 p-8 text-white">
                            <div className="text-sm text-white/80">Today’s picks</div>
                            <div className="mt-2 text-2xl font-semibold">
                                {products?.[0]?.name || 'Fresh deals available'}
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-lg bg-white/10 p-3">
                                    <div className="text-white/70">Total products</div>
                                    <div className="mt-1 text-lg font-semibold">588+</div>
                                </div>
                                <div className="rounded-lg bg-white/10 p-3">
                                    <div className="text-white/70">Markup</div>
                                    <div className="mt-1 text-lg font-semibold">Env-driven</div>
                                </div>
                            </div>
                            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                            <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
                        </div>
                    </div>
                </section>

                {categories?.length ? (
                    <section className="mx-auto max-w-6xl px-4 py-10">
                        <div className="mb-6 flex items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold">Shop by category</h2>
                                <p className="mt-1 text-sm text-gray-600">Jump straight to what you need.</p>
                            </div>
                            <Link href="/products" className="text-sm font-medium text-gray-900 hover:underline">
                                View all
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {categories.slice(0, 8).map((c) => (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => router.get('/products', { category: String(c.id) })}
                                    className="rounded-xl border bg-white p-4 text-left shadow-sm hover:bg-gray-50"
                                >
                                    <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                                    <div className="mt-1 text-xs text-gray-500">Browse products</div>
                                </button>
                            ))}
                        </div>
                    </section>
                ) : null}

                {new_arrivals?.length ? (
                    <section className="mx-auto max-w-6xl px-4 pb-2 pt-2">
                        <div className="mb-6 flex items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold">New arrivals</h2>
                                <p className="mt-1 text-sm text-gray-600">Fresh stock added recently.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => router.get('/products', { sort: 'newest' })}
                                className="text-sm font-medium text-gray-900 hover:underline"
                            >
                                See newest
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {new_arrivals.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    liked={liked_ids.includes(p.id)}
                                />
                            ))}
                        </div>
                    </section>
                ) : null}

                <section id="featured" className="mx-auto max-w-6xl px-4 py-10">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold">Featured gadgets</h2>
                        <p className="mt-1 text-sm text-gray-600">Latest picks from the catalog.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {products.map((p) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                liked={liked_ids.includes(p.id)}
                            />
                        ))}
                    </div>
                </section>
            </StorefrontLayout>
        </>
    );
}
