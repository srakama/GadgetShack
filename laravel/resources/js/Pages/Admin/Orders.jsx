import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function StatusBadge({ status }) {
    const map = {
        paid:    'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
        failed:  'bg-red-100 text-red-700',
    };
    const cls = map[status] ?? 'bg-gray-100 text-gray-500';
    return <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{status || 'pending'}</span>;
}

export default function AdminOrders({ orders }) {
    return (
        <>
            <Head title="Admin — Orders" />
            <AdminLayout title="Orders">
                <div className="mb-4 text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''}</div>

                <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-100 text-sm">
                        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            <tr>
                                <th className="px-4 py-3 text-left">#</th>
                                <th className="px-4 py-3 text-left">Customer</th>
                                <th className="px-4 py-3 text-right">Total</th>
                                <th className="px-4 py-3 text-center">Payment</th>
                                <th className="px-4 py-3 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((o) => (
                                <tr key={o.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-gray-500">#{o.id}</td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-900">{o.user_name || '—'}</div>
                                        <div className="text-xs text-gray-400">{o.user_email || ''}</div>
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                        R {Number(o.total_amount || 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <StatusBadge status={o.payment_status} />
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                        {o.created_at ? new Date(o.created_at).toLocaleDateString() : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {orders.length === 0 && (
                        <div className="py-16 text-center text-gray-400">No orders yet.</div>
                    )}
                </div>
            </AdminLayout>
        </>
    );
}

