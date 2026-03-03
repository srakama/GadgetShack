import { Head, Link, router, usePage } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import ProductCard from '@/Components/ProductCard';
import { useMemo, useState } from 'react';
import axios from 'axios';

export default function ProductShow({ product, related, is_liked = false, liked_ids = [] }) {
    const user = usePage().props?.auth?.user;
    const currentUrl = usePage().props?.ziggy?.location || `/products/${product.id}`;
    const canonical = typeof currentUrl === 'string' ? currentUrl.split('?')[0] : `/products/${product.id}`;
    const isAdmin = user?.role === 'admin';
    const isLoggedIn = !!user;
    const images = useMemo(() => (Array.isArray(product.images) ? product.images : []), [product.images]);
    const [activeImage, setActiveImage] = useState(images[0] || null);
    const [liked, setLiked] = useState(is_liked);
    const [likeCount, setLikeCount] = useState(product.like_count || 0);
    const [liking, setLiking] = useState(false);

    const handleLike = async () => {
        if (!isLoggedIn) { router.visit('/login'); return; }
        if (liking) return;
        setLiking(true);
        try {
            const res = await axios.post(`/products/${product.id}/like`);
            setLiked(res.data.liked);
            setLikeCount(res.data.count);
        } catch { /* silent */ } finally { setLiking(false); }
    };

    const metaDescription = (() => {
        const raw = (product?.description || '').trim();
        if (!raw) return `Buy ${product?.name || 'this product'} at GadgetVilla. Refurbished tech at great prices.`;
        return raw.length > 160 ? `${raw.slice(0, 157)}...` : raw;
    })();

    const ldJson = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product?.name,
        image: Array.isArray(product?.images) ? product.images : undefined,
        description: product?.description || undefined,
        sku: product?.sku || undefined,
        brand: product?.vendor ? { '@type': 'Brand', name: product.vendor } : undefined,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'ZAR',
            price: Number(product?.price || 0).toFixed(2),
            availability: (product?.stock_quantity ?? 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: canonical,
        },
    };

    return (
        <>
            <Head title={product.name}>
                <meta name="description" content={metaDescription} />
                <link rel="canonical" href={canonical} />
                <meta property="og:type" content="product" />
                <meta property="og:title" content={product.name} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:url" content={canonical} />
                {images?.[0] ? <meta property="og:image" content={images[0]} /> : null}
                <meta name="twitter:title" content={product.name} />
                <meta name="twitter:description" content={metaDescription} />
                {images?.[0] ? <meta name="twitter:image" content={images[0]} /> : null}
                <script type="application/ld+json">{JSON.stringify(ldJson)}</script>
            </Head>
            <StorefrontLayout>
                <section className="mx-auto max-w-6xl px-4 py-10">
                    <div className="mb-6">
                        <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900">
                            Back to products
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <div className="overflow-hidden rounded-2xl border bg-white">
                            <div className="relative aspect-square w-full bg-gray-100">
                                {activeImage ? (
                                    <img
                                        src={activeImage}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                        loading="eager"
                                        fetchPriority="high"
                                        decoding="async"
                                    />
                                ) : null}

                                {/* Like button — bottom-right of main image */}
                                <button
                                    type="button"
                                    onClick={handleLike}
                                    disabled={liking}
                                    title={isLoggedIn ? (liked ? 'Unlike' : 'Like this product') : 'Login to like'}
                                    className={`absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium shadow-md transition
                                        ${liked ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/90 text-gray-500 hover:bg-white hover:text-red-500'}
                                        ${liking ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    {liked ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    )}
                                    <span>{liked ? 'Liked' : 'Like'}{likeCount > 0 ? ` · ${likeCount}` : ''}</span>
                                </button>

                                {/* Admin edit overlay */}
                                {isAdmin && (
                                    <Link
                                        href={`/admin/products/${product.id}/edit`}
                                        className="absolute left-3 top-3 rounded-full bg-gray-900/80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-900"
                                    >
                                        ✏️ Edit Product
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm text-gray-500">{product.category_name || 'Uncategorized'}</div>
                            <h1 className="mt-1 text-2xl font-bold">{product.name}</h1>
                            <div className="mt-3 text-2xl font-semibold">R {Number(product.price).toFixed(2)}</div>

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => router.post('/cart/add', { product_id: product.id, qty: 1 }, { preserveScroll: true })}
                                    className="inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
                                >
                                    Add to cart
                                </button>
                                <Link
                                    href="/cart"
                                    className="inline-flex items-center justify-center rounded-md border bg-white px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                                >
                                    View cart
                                </Link>
                            </div>

                            {product.description ? (
                                <div className="prose prose-sm mt-6 max-w-none">
                                    <p>{product.description}</p>
                                </div>
                            ) : null}

                            <div className="mt-6 rounded-xl border bg-white p-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">SKU</span>
                                    <span className="font-medium">{product.sku}</span>
                                </div>
                                <div className="mt-2 flex justify-between">
                                    <span className="text-gray-600">Stock</span>
                                    <span className="font-medium">{product.stock_quantity}</span>
                                </div>
                                {product.grade ? (
                                    <div className="mt-2 flex justify-between">
                                        <span className="text-gray-600">Grade</span>
                                        <span className="font-medium">{product.grade}</span>
                                    </div>
                                ) : null}
                                {isAdmin && product.vendor ? (
                                    <div className="mt-2 flex justify-between">
                                        <span className="text-gray-600">Vendor</span>
                                        <span className="font-medium">{product.vendor}</span>
                                    </div>
                                ) : null}
                            </div>

                            {images.length > 1 ? (
                                <div className="mt-6">
                                    <div className="text-sm font-medium text-gray-900">More images</div>
                                    <div className="mt-3 grid grid-cols-5 gap-2">
                                        {images.slice(0, 10).map((src) => (
                                            <button
                                                key={src}
                                                type="button"
                                                onClick={() => setActiveImage(src)}
                                                className={`overflow-hidden rounded-lg border bg-white transition ${
                                                    src === activeImage ? 'border-gray-900' : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="aspect-square bg-gray-100">
                                                    <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </section>

                {Array.isArray(related) && related.length > 0 ? (
                    <section className="mx-auto max-w-6xl px-4 pb-12">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold">Related products</h2>
                            <p className="mt-1 text-sm text-gray-600">More items from the same category.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {related.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    liked={liked_ids.includes(p.id)}
                                />
                            ))}
                        </div>
                    </section>
                ) : null}
            </StorefrontLayout>
        </>
    );
}
