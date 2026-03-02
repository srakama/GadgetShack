import { Head, Link, router } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

export default function Cart({ items, subtotal }) {
    const updateQty = (productId, qty) => {
        router.post(
            '/cart/update',
            { product_id: productId, qty },
            { preserveScroll: true },
        );
    };

    const removeItem = (productId) => {
        router.post('/cart/remove', { product_id: productId }, { preserveScroll: true });
    };

    const clearCart = () => {
        router.post('/cart/clear', {}, { preserveScroll: true });
    };

    const hasItems = Array.isArray(items) && items.length > 0;

    return (
        <>
            <Head title="Cart" />
            <StorefrontLayout>
                <section className="mx-auto max-w-6xl px-4 py-10">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">Cart</h1>
                        <p className="mt-1 text-sm text-gray-600">Review your items before checkout.</p>
                    </div>

                    {!hasItems ? (
                        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                            <div className="text-sm text-gray-600">Your cart is empty.</div>
                            <div className="mt-4">
                                <Link
                                    href="/products"
                                    className="inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
                                >
                                    Browse products
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                                <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                                    <div className="divide-y">
                                        {items.map((it) => {
                                            const p = it.product;
                                            const image = p.images?.[0];
                                            return (
                                                <div key={p.id} className="flex gap-4 p-4">
                                                    <Link
                                                        href={`/products/${p.id}`}
                                                        className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100"
                                                    >
                                                        {image ? (
                                                            <img
                                                                src={image}
                                                                alt={p.name}
                                                                className="h-full w-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        ) : null}
                                                    </Link>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <Link
                                                                    href={`/products/${p.id}`}
                                                                    className="line-clamp-2 text-sm font-medium text-gray-900 hover:underline"
                                                                >
                                                                    {p.name}
                                                                </Link>
                                                                <div className="mt-1 text-xs text-gray-500">
                                                                    {p.category_name || 'Uncategorized'}
                                                                </div>
                                                            </div>
                                                            <div className="text-sm font-semibold">R {Number(p.price).toFixed(2)}</div>
                                                        </div>

                                                        <div className="mt-3 flex items-center justify-between gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQty(p.id, Math.max(1, it.qty - 1))}
                                                                    className="rounded-md border bg-white px-2 py-1 text-sm"
                                                                >
                                                                    -
                                                                </button>
                                                                <div className="w-10 text-center text-sm">{it.qty}</div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQty(p.id, Math.min(50, it.qty + 1))}
                                                                    className="rounded-md border bg-white px-2 py-1 text-sm"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                                <div className="text-sm text-gray-600">
                                                                    Line: <span className="font-medium text-gray-900">R {Number(it.line_total).toFixed(2)}</span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(p.id)}
                                                                    className="text-sm text-gray-700 hover:text-gray-900"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        onClick={clearCart}
                                        className="text-sm text-gray-700 hover:text-gray-900"
                                    >
                                        Clear cart
                                    </button>
                                </div>
                            </div>

                            <div>
                                <div className="rounded-xl border bg-white p-4 shadow-sm">
                                    <div className="text-sm font-semibold">Order summary</div>

                                    <div className="mt-4 flex items-center justify-between text-sm">
                                        <div className="text-gray-600">Subtotal</div>
                                        <div className="font-medium">R {Number(subtotal).toFixed(2)}</div>
                                    </div>

                                    <div className="mt-2 flex items-center justify-between text-sm">
                                        <div className="text-gray-600">Shipping</div>
                                        <div className="font-medium">Calculated at checkout</div>
                                    </div>

                                    <div className="mt-4 border-t pt-4 flex items-center justify-between">
                                        <div className="text-sm font-semibold">Total</div>
                                        <div className="text-sm font-semibold">R {Number(subtotal).toFixed(2)}</div>
                                    </div>

                                    <Link
                                        href="/checkout"
                                        className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800"
                                    >
                                        Checkout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </StorefrontLayout>
        </>
    );
}
