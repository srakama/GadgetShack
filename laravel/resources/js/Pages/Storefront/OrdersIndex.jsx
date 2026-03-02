import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

export default function OrdersIndex({ orders }) {
    const hasOrders = Array.isArray(orders) && orders.length > 0;

    return (
        <>
            <Head title="My Orders" />
            <StorefrontLayout>
                <section className="mx-auto max-w-6xl px-4 py-10">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">My Orders</h1>
                        <p className="mt-1 text-sm text-gray-600">Your order history.</p>
                    </div>

                    {!hasOrders ? (
                        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                            <div className="text-sm text-gray-600">You have no orders yet.</div>
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
                        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                            <div className="divide-y">
                                {orders.map((o) => (
                                    <div key={o.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">Order #{o.id}</div>
                                            <div className="mt-1 text-xs text-gray-500">
                                                Status: {o.status} · Payment: {o.payment_status}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                                            <div className="text-sm font-semibold">R {Number(o.total_amount).toFixed(2)}</div>
                                            <Link
                                                href={`/orders/${o.id}`}
                                                className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </StorefrontLayout>
        </>
    );
}
