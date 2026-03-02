import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

function HeartIcon({ filled }) {
    return filled ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    );
}

export default function ProductCard({ product, liked: initialLiked = false, showAddToCart = true }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role === 'admin';
    const isLoggedIn = !!user;

    const [liked, setLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(product.like_count || 0);
    const [liking, setLiking] = useState(false);

    const handleLike = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            router.visit('/login');
            return;
        }

        if (liking) return;
        setLiking(true);

        try {
            const response = await axios.post(`/products/${product.id}/like`);
            setLiked(response.data.liked);
            setLikeCount(response.data.count);
        } catch {
            // silently fail
        } finally {
            setLiking(false);
        }
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        router.post('/cart/add', { product_id: product.id, qty: 1 }, { preserveScroll: true });
    };

    return (
        <div className="group relative rounded-xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow">
            <Link href={`/products/${product.id}`} className="block p-4">
                {/* Image container */}
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                    {product.images?.[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-12 w-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                        </div>
                    )}

                    {/* Admin edit badge */}
                    {isAdmin && (
                        <Link
                            href={`/admin/products/${product.id}/edit`}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute left-2 top-2 rounded-full bg-gray-900/80 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100 hover:bg-gray-900"
                        >
                            Edit
                        </Link>
                    )}

                    {/* Like button — bottom-right corner */}
                    <button
                        type="button"
                        onClick={handleLike}
                        disabled={liking}
                        title={isLoggedIn ? (liked ? 'Unlike' : 'Like') : 'Login to like'}
                        className={`absolute bottom-2 right-2 flex items-center gap-1 rounded-full px-2 py-1.5 text-xs font-medium shadow transition
                            ${liked
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-white/90 text-gray-500 hover:bg-white hover:text-red-500'}
                            ${liking ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        <HeartIcon filled={liked} />
                        {likeCount > 0 && <span>{likeCount}</span>}
                    </button>
                </div>

                {/* Product info */}
                <div className="mt-3">
                    <div className="text-xs text-gray-500">{product.category_name || 'Uncategorized'}</div>
                    <div className="mt-1 line-clamp-2 text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-semibold">R {Number(product.price).toFixed(2)}</span>
                    </div>
                </div>
            </Link>

            {/* Add to cart — only for logged-in customers */}
            {showAddToCart && isLoggedIn && (
                <div className="px-4 pb-4">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                    >
                        Add to cart
                    </button>
                </div>
            )}

            {/* Guest CTA — same Add to cart label, redirects to login */}
            {showAddToCart && !isLoggedIn && (
                <div className="px-4 pb-4">
                    <Link
                        href="/login"
                        className="block w-full rounded-md bg-gray-900 px-3 py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
                    >
                        Add to cart
                    </Link>
                </div>
            )}
        </div>
    );
}

