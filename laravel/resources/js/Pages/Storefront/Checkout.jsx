import { Head, router } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { useState } from 'react';

export default function Checkout({ items, subtotal, errors }) {
    const [shippingAddress, setShippingAddress] = useState('');

    const placeOrder = (e) => {
        e.preventDefault();
        router.post('/checkout/place', { shipping_address: shippingAddress });
    };

    return (
        <>
            <Head title="Checkout" />
            <StorefrontLayout>
                <section className="mx-auto max-w-6xl px-4 py-10">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">Checkout</h1>
                        <p className="mt-1 text-sm text-gray-600">Confirm your details and place your order.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <form onSubmit={placeOrder} className="rounded-xl border bg-white p-4 shadow-sm">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">Shipping address</label>
                                    <textarea
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        rows={5}
                                        className="mt-2 w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900"
                                        placeholder="Street, suburb, city, province, postal code"
                                    />
                                    {errors?.shipping_address ? (
                                        <div className="mt-2 text-sm text-red-600">{errors.shipping_address}</div>
                                    ) : null}
                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
                                >
                                    Place order
                                </button>

                                <div className="mt-3 text-xs text-gray-500">
                                    Payments are not integrated yet. This will create an order in the database.
                                </div>
                            </form>

                            <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
                                <div className="border-b p-4 text-sm font-semibold">Items</div>
                                <div className="divide-y">
                                    {items.map((it) => (
                                        <div key={it.product_id} className="flex items-center justify-between gap-3 p-4 text-sm">
                                            <div className="min-w-0">
                                                <div className="line-clamp-2 font-medium text-gray-900">{it.name}</div>
                                                <div className="mt-1 text-xs text-gray-500">
                                                    Qty {it.qty} · Unit R {Number(it.unit_price).toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 font-semibold">R {Number(it.line_total).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
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
                                    <div className="font-medium">Not calculated</div>
                                </div>

                                <div className="mt-4 border-t pt-4 flex items-center justify-between">
                                    <div className="text-sm font-semibold">Total</div>
                                    <div className="text-sm font-semibold">R {Number(subtotal).toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </StorefrontLayout>
        </>
    );
}
