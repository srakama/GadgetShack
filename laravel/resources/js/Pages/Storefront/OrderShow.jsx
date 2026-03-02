import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { useState } from 'react';

export default function OrderShow({ order, items }) {
    const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
    const [refreshing, setRefreshing] = useState(false);

    const refreshStatus = async () => {
        try {
            setRefreshing(true);
            const res = await fetch(`/orders/${order.id}/status`, {
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                },
            });
            if (!res.ok) {
                return;
            }
            const data = await res.json();
            if (data?.payment_status) {
                setPaymentStatus(data.payment_status);
            }
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <>
            <Head title={`Order #${order.id}`} />
            <StorefrontLayout>
                <section className="mx-auto max-w-6xl px-4 py-10">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Status: <span className="font-medium text-gray-900">{order.status}</span> · Payment:{' '}
                            <span className="font-medium text-gray-900">{paymentStatus}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                                <div className="border-b p-4 text-sm font-semibold">Items</div>
                                <div className="divide-y">
                                    {items.map((it) => {
                                        const image = it.product_images?.[0];
                                        const lineTotal = Number(it.price) * Number(it.quantity);

                                        return (
                                            <div key={it.id} className="flex gap-4 p-4">
                                                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                    {image ? (
                                                        <img src={image} alt={it.product_name} className="h-full w-full object-cover" />
                                                    ) : null}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="line-clamp-2 text-sm font-medium text-gray-900">{it.product_name}</div>
                                                    <div className="mt-1 text-xs text-gray-500">
                                                        Qty {it.quantity} · Unit R {Number(it.price).toFixed(2)}
                                                    </div>
                                                </div>
                                                <div className="text-sm font-semibold">R {Number(lineTotal).toFixed(2)}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-6 rounded-xl border bg-white p-4 text-sm shadow-sm">
                                <div className="font-semibold text-gray-900">Shipping address</div>
                                <div className="mt-2 whitespace-pre-wrap text-gray-700">{order.shipping_address || '-'}</div>
                            </div>
                        </div>

                        <div>
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <div className="text-sm font-semibold">Summary</div>

                                <div className="mt-4 flex items-center justify-between text-sm">
                                    <div className="text-gray-600">Total</div>
                                    <div className="font-medium">R {Number(order.total_amount).toFixed(2)}</div>
                                </div>

                                <button
                                    type="button"
                                    onClick={refreshStatus}
                                    disabled={refreshing}
                                    className="mt-4 w-full rounded-md border bg-white px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {refreshing ? 'Refreshing…' : 'Refresh payment status'}
                                </button>

                                {paymentStatus === 'pending' ? (
                                    <div className="mt-4 grid grid-cols-1 gap-2">
                                        <Link
                                            href={`/payments/payfast/${order.id}/start`}
                                            className="inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-500"
                                        >
                                            Pay with PayFast
                                        </Link>
                                        <Link
                                            href={`/payments/paypal/${order.id}/start`}
                                            className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-500"
                                        >
                                            Pay with PayPal
                                        </Link>
                                        <div className="text-xs text-gray-500">
                                            After payment, the gateway will send a server callback to mark this order as paid.
                                        </div>
                                    </div>
                                ) : null}

                                <Link
                                    href="/products"
                                    className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800"
                                >
                                    Continue shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </StorefrontLayout>
        </>
    );
}
