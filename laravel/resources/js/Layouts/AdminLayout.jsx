import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const NAV = [
    { href: '/admin', label: '🏠 Dashboard', match: /^\/admin$/ },
    { href: '/admin/products', label: '📦 Products', match: /^\/admin\/products/ },
    { href: '/admin/orders', label: '🧾 Orders', match: /^\/admin\/orders/ },
];

export default function AdminLayout({ title, children }) {
    const { auth, ziggy } = usePage().props;
    const user = auth?.user;
    const path = typeof window !== 'undefined' ? window.location.pathname : (ziggy?.location ?? '');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 text-white transition-transform duration-200
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:flex lg:flex-col`}>
                <div className="flex h-16 items-center justify-between px-5 border-b border-white/10">
                    <Link href="/admin" className="text-lg font-bold tracking-tight">
                        ⚙️ GadgetVilla
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">✕</button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {NAV.map(({ href, label, match }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition
                                ${match.test(path)
                                    ? 'bg-white/15 text-white'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="border-t border-white/10 p-4 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition"
                    >
                        🛍️ Back to Store
                    </Link>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                    >
                        🚪 Logout ({user?.name})
                    </Link>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main */}
            <div className="flex flex-1 flex-col min-w-0">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100"
                    >
                        ☰
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold text-gray-800">{title || 'Admin Panel'}</h1>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="hidden sm:block">👤 {user?.name}</span>
                        <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[11px] font-semibold text-white">ADMIN</span>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

