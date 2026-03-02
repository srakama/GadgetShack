import { Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function StorefrontLayout({ children }) {
    const { auth, ziggy } = usePage().props;
    const user = auth?.user;
    const cartCount = usePage().props?.cart?.count || 0;

    // ── Navbar search ──────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchOpen(false);
                setMobileSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (searchQuery.length < 2) {
            setSuggestions(null);
            setSearchOpen(false);
            return;
        }
        const timer = setTimeout(async () => {
            setSearchLoading(true);
            try {
                const res = await fetch(`/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
                const data = await res.json();
                setSuggestions(data);
                const hasResults = data.brands?.length > 0 || data.categories?.length > 0 || data.products?.length > 0;
                setSearchOpen(hasResults);
            } catch (_) {
                // ignore
            } finally {
                setSearchLoading(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearchSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (searchQuery.trim()) {
            setSearchOpen(false);
            router.get('/products', { search: searchQuery.trim() });
        }
    };

    const goToVendor = (vendor) => {
        setSearchOpen(false);
        setSearchQuery('');
        router.get('/products', { vendor });
    };

    const goToCategory = (categoryId) => {
        setSearchOpen(false);
        setSearchQuery('');
        router.get('/products', { category: categoryId });
    };

    const goToProduct = (productId) => {
        setSearchOpen(false);
        setMobileSearchOpen(false);
        setSearchQuery('');
        router.get(`/products/${productId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Announcement bar */}
            <div className="bg-gray-900 text-white text-xs py-2 px-4 text-center">
                <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
                    <span>🛡️ Up to a 2-Year Warranty</span>
                    <span className="hidden sm:inline text-gray-500">|</span>
                    <span>🚚 Free delivery for orders over R649</span>
                    <span className="hidden sm:inline text-gray-500">|</span>
                    <span>🔄 14-Day Return Policy</span>
                </div>
            </div>

            <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-9 w-9 flex-shrink-0">
                                <rect width="64" height="64" rx="12" fill="#111827"/>
                                <rect x="10" y="26" width="44" height="32" rx="4" fill="white"/>
                                <path d="M22 26 C22 14 42 14 42 26" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none"/>
                                <text x="32" y="50" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="bold" fontSize="18" fill="#111827" letterSpacing="-1">GS</text>
                            </svg>
                            <span className="text-lg font-semibold tracking-tight">GadgetShack</span>
                        </Link>
                        <nav className="hidden items-center gap-4 text-sm md:flex">
                            <Link
                                href="/products"
                                className="text-gray-700 hover:text-gray-900"
                            >
                                Products
                            </Link>
                            <Link
                                href="/cart"
                                className="relative text-gray-700 hover:text-gray-900"
                            >
                                Cart
                                {cartCount > 0 ? (
                                    <span className="absolute -right-3 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1 text-[11px] font-semibold text-white">
                                        {cartCount}
                                    </span>
                                ) : null}
                            </Link>
                            {user ? (
                                <Link
                                    href="/orders"
                                    className="text-gray-700 hover:text-gray-900"
                                >
                                    My Orders
                                </Link>
                            ) : null}
                        </nav>
                    </div>

                    <div ref={searchRef} className="relative hidden w-full max-w-md md:block">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => {
                                    const hasResults = suggestions?.brands?.length > 0 || suggestions?.categories?.length > 0 || suggestions?.products?.length > 0;
                                    if (hasResults) setSearchOpen(true);
                                }}
                                placeholder="Search products, brands, categories…"
                                className="w-full rounded-md border-gray-300 bg-white/90 pr-24 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900"
                            />
                            <button
                                type="submit"
                                className="absolute right-1 top-1 inline-flex items-center justify-center rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
                            >
                                {searchLoading ? '…' : 'Search'}
                            </button>
                        </form>

                        {searchOpen ? (
                            <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-xl border bg-white shadow-lg">
                                <div className="max-h-96 overflow-auto p-2">
                                    {suggestions?.brands?.length ? (
                                        <div className="p-2">
                                            <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Brands</div>
                                            <div className="flex flex-wrap gap-2">
                                                {suggestions.brands.map((b) => (
                                                    <button
                                                        key={b}
                                                        type="button"
                                                        onClick={() => goToVendor(b)}
                                                        className="rounded-full border bg-gray-50 px-3 py-1 text-xs text-gray-800 hover:bg-gray-100"
                                                    >
                                                        {b}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}

                                    {suggestions?.categories?.length ? (
                                        <div className="p-2">
                                            <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Categories</div>
                                            <div className="grid grid-cols-1 gap-1">
                                                {suggestions.categories.map((c) => (
                                                    <button
                                                        key={c.id}
                                                        type="button"
                                                        onClick={() => goToCategory(String(c.id))}
                                                        className="flex items-center justify-between rounded-md px-2 py-2 text-left text-sm text-gray-800 hover:bg-gray-50"
                                                    >
                                                        <span>{c.name}</span>
                                                        <span className="text-xs text-gray-400">View</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}

                                    {suggestions?.products?.length ? (
                                        <div className="p-2">
                                            <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Products</div>
                                            <div className="grid grid-cols-1 gap-1">
                                                {suggestions.products.map((p) => (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        onClick={() => goToProduct(p.id)}
                                                        className="rounded-md px-2 py-2 text-left hover:bg-gray-50"
                                                    >
                                                        <div className="text-sm font-medium text-gray-900">{p.name}</div>
                                                        <div className="mt-0.5 text-xs text-gray-500">
                                                            {p.vendor ? `${p.vendor} · ` : ''}{p.category_name || 'Uncategorized'}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <nav className="flex items-center gap-3 text-sm">
                        <button
                            type="button"
                            onClick={() => {
                                setMobileSearchOpen((v) => !v);
                                const hasResults = suggestions?.brands?.length > 0 || suggestions?.categories?.length > 0 || suggestions?.products?.length > 0;
                                if (hasResults) setSearchOpen(true);
                            }}
                            className="md:hidden rounded-md border bg-white px-3 py-2 text-gray-700 hover:text-gray-900"
                        >
                            Search
                        </button>

                        <Link
                            href="/products"
                            className="md:hidden text-gray-700 hover:text-gray-900"
                        >
                            Products
                        </Link>

                        <Link
                            href="/cart"
                            className="relative md:hidden text-gray-700 hover:text-gray-900"
                        >
                            Cart
                            {cartCount > 0 ? (
                                <span className="absolute -right-3 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1 text-[11px] font-semibold text-white">
                                    {cartCount}
                                </span>
                            ) : null}
                        </Link>

                        {user ? (
                            <Link
                                href="/orders"
                                className="md:hidden text-gray-700 hover:text-gray-900"
                            >
                                My Orders
                            </Link>
                        ) : null}

                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600"
                                    >
                                        ⚙️ Admin
                                    </Link>
                                )}
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md px-3 py-2 text-gray-700 hover:text-gray-900"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('profile.edit')}
                                    className="rounded-md px-3 py-2 text-gray-700 hover:text-gray-900"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="rounded-md bg-gray-900 px-3 py-2 font-medium text-white hover:bg-gray-800"
                                >
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-md px-3 py-2 text-gray-700 hover:text-gray-900"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-md bg-gray-900 px-3 py-2 font-medium text-white hover:bg-gray-800"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {mobileSearchOpen ? (
                <div className="md:hidden border-b bg-white">
                    <div className="mx-auto max-w-6xl px-4 py-3">
                        <form onSubmit={handleSearchSubmit}>
                            <div className="flex gap-2">
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products, brands, categories…"
                                    className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex flex-shrink-0 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                                >
                                    {searchLoading ? '…' : 'Go'}
                                </button>
                            </div>
                        </form>

                        {searchOpen ? (
                            <div className="mt-2 overflow-hidden rounded-xl border bg-white shadow-sm">
                                <div className="max-h-80 overflow-auto p-2">
                                    {suggestions?.brands?.length ? (
                                        <div className="p-2">
                                            <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Brands</div>
                                            <div className="flex flex-wrap gap-2">
                                                {suggestions.brands.map((b) => (
                                                    <button
                                                        key={b}
                                                        type="button"
                                                        onClick={() => goToVendor(b)}
                                                        className="rounded-full border bg-gray-50 px-3 py-1 text-xs text-gray-800 hover:bg-gray-100"
                                                    >
                                                        {b}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}

                                    {suggestions?.categories?.length ? (
                                        <div className="p-2">
                                            <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Categories</div>
                                            <div className="grid grid-cols-1 gap-1">
                                                {suggestions.categories.map((c) => (
                                                    <button
                                                        key={c.id}
                                                        type="button"
                                                        onClick={() => goToCategory(String(c.id))}
                                                        className="flex items-center justify-between rounded-md px-2 py-2 text-left text-sm text-gray-800 hover:bg-gray-50"
                                                    >
                                                        <span>{c.name}</span>
                                                        <span className="text-xs text-gray-400">View</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}

                                    {suggestions?.products?.length ? (
                                        <div className="p-2">
                                            <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Products</div>
                                            <div className="grid grid-cols-1 gap-1">
                                                {suggestions.products.map((p) => (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        onClick={() => goToProduct(p.id)}
                                                        className="rounded-md px-2 py-2 text-left hover:bg-gray-50"
                                                    >
                                                        <div className="text-sm font-medium text-gray-900">{p.name}</div>
                                                        <div className="mt-0.5 text-xs text-gray-500">
                                                            {p.vendor ? `${p.vendor} · ` : ''}{p.category_name || 'Uncategorized'}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}

            <main>{children}</main>

            <footer className="bg-[#0d1b2a] text-gray-300 text-sm">
                {/* Main footer grid */}
                <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Col 1 — Brand & contact */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-10 w-10 flex-shrink-0">
                                <rect width="64" height="64" rx="12" fill="#1f2937"/>
                                <rect x="10" y="26" width="44" height="32" rx="4" fill="white"/>
                                <path d="M22 26 C22 14 42 14 42 26" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none"/>
                                <text x="32" y="50" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="bold" fontSize="18" fill="#1f2937" letterSpacing="-1">GS</text>
                            </svg>
                            <span className="text-xl font-bold text-white tracking-tight">GadgetShack</span>
                        </div>
                        <div className="text-xs leading-relaxed text-gray-400">
                            <p className="font-semibold text-gray-300 mb-1">Cape Town Store:</p>
                            <p>Sunbird Park Kuils River,<br />Cape Town, 7580</p>
                        </div>
                        <div className="text-xs leading-relaxed text-gray-400">
                            <p>Email: <a href="mailto:info@gadgetshack.co.za" className="hover:text-white">info@gadgetshack.co.za</a></p>
                            <p className="mt-1">Online Queries: <a href="tel:0870595500" className="hover:text-white">021 137 8453</a></p>
                        </div>
                        {/* Social icons */}
                        <div className="flex items-center gap-4 mt-1">
                            <a href="#" aria-label="Facebook" className="hover:text-white transition">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.478-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                            </a>
                            <a href="#" aria-label="Instagram" className="hover:text-white transition">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.516 2.497 5.783 2.226 7.149 2.163 8.415 2.105 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 1.955 2.073.556 3.473.04 5.315-.045 7.17-.103 8.45-.116 8.859-.116 12c0 3.141.013 3.55.071 4.83.085 1.855.601 3.697 2 5.097 1.4 1.4 3.242 1.916 5.097 2.001C8.45 23.986 8.859 24 12 24c3.141 0 3.55-.014 4.83-.072 1.855-.085 3.697-.601 5.097-2 1.4-1.4 1.916-3.242 2.001-5.097.058-1.28.071-1.689.071-4.83 0-3.141-.013-3.55-.071-4.83-.085-1.855-.601-3.697-2-5.097-1.4-1.4-3.242-1.916-5.097-2.001C15.55.014 15.141 0 12 0z"/><path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                            </a>
                            <a href="#" aria-label="LinkedIn" className="hover:text-white transition">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                            </a>
                            <a href="#" aria-label="TikTok" className="hover:text-white transition">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.02a8.18 8.18 0 004.78 1.52V7.1a4.85 4.85 0 01-1.01-.41z"/></svg>
                            </a>
                        </div>
                    </div>

                    {/* Col 2 — Legal */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-xs text-gray-400">
                            {[
                                ['Warranty', '/warranty-policy'],
                                ['Refund Policy', '/refund-policy'],
                                ['Shipping Policy', '/shipping-policy'],
                                ['Terms & Conditions', '/terms-conditions'],
                                ['Privacy Statement', '/privacy-statement'],
                                ['Sale & Promotions Terms', '/sale-promotions-terms'],
                            ].map(([label, href]) => (
                                <li key={label}>
                                    <a
                                        href={href}
                                        className="hover:text-white transition"
                                        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                    >
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4 — My Account */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">My Account</h3>
                        <ul className="space-y-2 text-xs text-gray-400">
                            {[
                                ['My Account', route('dashboard')],
                                ['Track My Order', '/orders'],
                                ['Cart', '/cart'],
                                ['Checkout', '/checkout'],
                                ['Contact Us', '#'],
                            ].map(([label, href]) => (
                                <li key={label}><Link href={href} className="hover:text-white transition">{label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 5 — Newsletter */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Sign up for special offers!</h3>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex flex-col gap-3"
                        >
                            <input
                                type="text"
                                placeholder="First Name"
                                className="rounded-md bg-white/10 border border-white/20 px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <input
                                type="email"
                                placeholder="Email *"
                                required
                                className="rounded-md bg-white/10 border border-white/20 px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <button
                                type="submit"
                                className="rounded-md bg-emerald-500 hover:bg-emerald-600 transition px-4 py-2 text-sm font-semibold text-white"
                            >
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10">
                    <div className="mx-auto max-w-6xl px-4 py-4 grid grid-cols-3 items-center text-xs text-gray-500">
                        <span>© {new Date().getFullYear()} GadgetShack. All rights reserved.</span>
                        <span className="flex items-center justify-center gap-1">
                            Crafted with <span className="text-red-500">❤️</span> by{' '}
                            <a href="https://azaniadigital.co.za" target="_blank" rel="noopener noreferrer" className="hover:text-white underline underline-offset-2">
                                Azania_Digital
                            </a>
                        </span>
                        <span />
                    </div>
                </div>
            </footer>
        </div>
    );
}
