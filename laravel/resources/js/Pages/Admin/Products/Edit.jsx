import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useRef } from 'react';

function Field({ label, error, children, hint }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            {children}
            {hint  && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
            {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
        </div>
    );
}

const INPUT = "w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900";
const SELECT = "w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-gray-900 focus:ring-gray-900";

export default function AdminProductEdit({ product, categories, markup }) {
    const isNew = !product;
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [dragOver, setDragOver] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        sku:              product?.sku              ?? '',
        name:             product?.name             ?? '',
        description:      product?.description      ?? '',
        price:            product?.price            ?? '',
        compare_at_price: product?.compare_at_price ?? '',
        category_id:      product?.category_id      ?? '',
        stock_quantity:   product?.stock_quantity    ?? 0,
        status:           product?.status           ?? 'active',
        featured:         product?.featured         ? true : false,
        grade:            product?.grade            ?? '',
        vendor:           product?.vendor           ?? '',
        product_type:     product?.product_type     ?? '',
        tags:             product?.tags             ?? '',
        source_url:       product?.source_url       ?? '',
        images:           Array.isArray(product?.images) ? [...product.images] : [],
    });

    const salePrice = data.price ? (Number(data.price) * (1 + markup / 100)).toFixed(2) : '—';
    const profit    = data.price ? (Number(data.price) * markup / 100).toFixed(2) : '—';

    const submit = (e) => {
        e.preventDefault();
        if (isNew) post('/admin/products');
        else       put(`/admin/products/${product.id}`);
    };

    // Image management
    const addImage    = () => setData('images', [...data.images, '']);
    const removeImage = (i) => setData('images', data.images.filter((_, idx) => idx !== i));
    const setImage    = (i, val) => setData('images', data.images.map((img, idx) => idx === i ? val : img));

    // File upload handler
    const uploadFiles = async (files) => {
        if (!files || files.length === 0) return;
        setUploading(true);
        setUploadError('');
        const uploaded = [];
        for (const file of Array.from(files)) {
            const fd = new FormData();
            fd.append('image', file);
            fd.append('_token', document.head.querySelector('meta[name="csrf-token"]')?.content ?? '');
            try {
                const res = await fetch('/admin/products/upload-image', { method: 'POST', body: fd });
                if (!res.ok) throw new Error(await res.text());
                const json = await res.json();
                uploaded.push(json.url);
            } catch (err) {
                setUploadError('Upload failed: ' + (err.message ?? 'Unknown error'));
            }
        }
        if (uploaded.length) setData('images', [...data.images, ...uploaded]);
        setUploading(false);
    };

    const handleFileChange = (e) => uploadFiles(e.target.files);
    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        uploadFiles(e.dataTransfer.files);
    };

    return (
        <>
            <Head title={isNew ? 'New Product' : `Edit: ${product.name}`} />
            <AdminLayout title={isNew ? 'Create Product' : 'Edit Product'}>
                {/* Breadcrumb */}
                <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/admin/products" className="hover:text-gray-900">Products</Link>
                    <span>/</span>
                    <span className="text-gray-900">{isNew ? 'New' : product.name}</span>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        {/* ── LEFT COLUMN (main fields) ── */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* General Info */}
                            <section className="rounded-xl border bg-white p-5 shadow-sm">
                                <h2 className="mb-4 text-sm font-semibold text-gray-800">General Information</h2>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Field label="Product Name *" error={errors.name}>
                                        <input value={data.name} onChange={e => setData('name', e.target.value)}
                                            className={INPUT} placeholder="e.g. Samsung Galaxy S23" required />
                                    </Field>
                                    <Field label="SKU *" error={errors.sku}>
                                        <input value={data.sku} onChange={e => setData('sku', e.target.value)}
                                            className={INPUT} placeholder="e.g. SAM-S23-128" required />
                                    </Field>
                                </div>
                                <div className="mt-4">
                                    <Field label="Description" error={errors.description}>
                                        <textarea value={data.description} onChange={e => setData('description', e.target.value)}
                                            rows={4} className={INPUT} placeholder="Product description…" />
                                    </Field>
                                </div>
                            </section>

                            {/* Pricing */}
                            <section className="rounded-xl border bg-white p-5 shadow-sm">
                                <h2 className="mb-4 text-sm font-semibold text-gray-800">Pricing &amp; Markup</h2>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Field label="Base Cost (R) *" error={errors.price}
                                        hint="Raw price from TechMarkIt — before markup">
                                        <input type="number" step="0.01" min="0"
                                            value={data.price} onChange={e => setData('price', e.target.value)}
                                            className={INPUT} placeholder="0.00" required />
                                    </Field>
                                    <Field label="Compare At Price (R)" error={errors.compare_at_price}
                                        hint="Original RRP / crossed-out price">
                                        <input type="number" step="0.01" min="0"
                                            value={data.compare_at_price} onChange={e => setData('compare_at_price', e.target.value)}
                                            className={INPUT} placeholder="0.00" />
                                    </Field>
                                </div>

                                {/* Live markup breakdown */}
                                {data.price ? (
                                    <div className="mt-4 grid grid-cols-3 gap-3">
                                        <div className="rounded-lg bg-gray-50 border p-3 text-center">
                                            <div className="text-[11px] text-gray-400 uppercase">Cost</div>
                                            <div className="mt-1 text-lg font-bold text-gray-700">R {Number(data.price).toFixed(2)}</div>
                                        </div>
                                        <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center">
                                            <div className="text-[11px] text-green-600 uppercase">Profit (+{markup}%)</div>
                                            <div className="mt-1 text-lg font-bold text-green-700">+R {profit}</div>
                                        </div>
                                        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-center">
                                            <div className="text-[11px] text-blue-600 uppercase">Sale Price</div>
                                            <div className="mt-1 text-lg font-bold text-blue-700">R {salePrice}</div>
                                        </div>
                                    </div>
                                ) : null}
                            </section>

                            {/* Images */}
                            <section className="rounded-xl border bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-semibold text-gray-800">Images ({data.images.filter(Boolean).length})</h2>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            className="rounded-md border bg-gray-900 px-3 py-1 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-50">
                                            {uploading ? '⏳ Uploading…' : '⬆ Upload File'}
                                        </button>
                                        <button type="button" onClick={addImage}
                                            className="rounded-md border px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                                            + Add URL
                                        </button>
                                    </div>
                                </div>

                                {/* Hidden file input */}
                                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                                    onChange={handleFileChange} />

                                {/* Upload error */}
                                {uploadError && (
                                    <p className="mb-3 text-xs text-red-500 bg-red-50 border border-red-200 rounded p-2">{uploadError}</p>
                                )}

                                {/* Drag-and-drop zone */}
                                <div
                                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 transition
                                        ${dragOver ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'}`}>
                                    <span className="text-2xl mb-1">🖼️</span>
                                    <p className="text-sm text-gray-500">Drag &amp; drop images here, or <span className="text-gray-900 font-medium underline">click to browse</span></p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 5 MB each</p>
                                </div>

                                {/* Preview grid */}
                                {data.images.filter(Boolean).length > 0 && (
                                    <div className="mb-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
                                        {data.images.filter(Boolean).map((src, i) => (
                                            <div key={i} className="relative group aspect-square">
                                                <img src={src} alt="" className="h-full w-full rounded-lg border object-cover" onError={e => e.target.style.display='none'} />
                                                <button type="button" onClick={() => removeImage(data.images.indexOf(src))}
                                                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs
                                                        opacity-0 group-hover:opacity-100 flex items-center justify-center transition">✕</button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* URL inputs */}
                                <div className="space-y-2">
                                    {data.images.map((img, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            {img && <img src={img} alt="" className="h-8 w-8 rounded border object-cover flex-shrink-0" onError={e => e.target.style.display='none'} />}
                                            <input value={img} onChange={e => setImage(i, e.target.value)}
                                                className={INPUT} placeholder="https://…image.jpg" />
                                            <button type="button" onClick={() => removeImage(i)}
                                                className="rounded-md border px-2 py-1 text-xs text-red-500 hover:bg-red-50 flex-shrink-0">✕</button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Source URL */}
                            <section className="rounded-xl border bg-white p-5 shadow-sm">
                                <h2 className="mb-4 text-sm font-semibold text-gray-800">Source</h2>
                                <Field label="TechMarkIt Source URL" error={errors.source_url}
                                    hint="Original listing URL on TechMarkIt">
                                    <div className="flex gap-2">
                                        <input value={data.source_url} onChange={e => setData('source_url', e.target.value)}
                                            className={INPUT} placeholder="https://techmarkit.co.za/products/…" />
                                        {data.source_url && (
                                            <a href={data.source_url} target="_blank" rel="noopener noreferrer"
                                                className="flex-shrink-0 rounded-md border px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50">
                                                ↗ Open
                                            </a>
                                        )}
                                    </div>
                                </Field>
                            </section>
                        </div>

                        {/* ── RIGHT COLUMN (meta) ── */}
                        <div className="space-y-6">

                            {/* Status & Inventory */}
                            <section className="rounded-xl border bg-white p-5 shadow-sm">
                                <h2 className="mb-4 text-sm font-semibold text-gray-800">Status &amp; Inventory</h2>
                                <div className="space-y-4">
                                    <Field label="Status *" error={errors.status}>
                                        <select value={data.status} onChange={e => setData('status', e.target.value)} className={SELECT}>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="draft">Draft</option>
                                        </select>
                                    </Field>
                                    <Field label="Stock Quantity *" error={errors.stock_quantity}>
                                        <input type="number" min="0" value={data.stock_quantity}
                                            onChange={e => setData('stock_quantity', parseInt(e.target.value) || 0)}
                                            className={INPUT} />
                                    </Field>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={data.featured}
                                            onChange={e => setData('featured', e.target.checked)}
                                            className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                                        <span className="text-sm text-gray-700">⭐ Featured product</span>
                                    </label>
                                </div>
                            </section>

                            {/* Category & Details */}
                            <section className="rounded-xl border bg-white p-5 shadow-sm">
                                <h2 className="mb-4 text-sm font-semibold text-gray-800">Category &amp; Details</h2>
                                <div className="space-y-4">
                                    <Field label="Category" error={errors.category_id}>
                                        <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className={SELECT}>
                                            <option value="">Uncategorized</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Grade" error={errors.grade} hint="e.g. A, B, Refurbished">
                                        <input value={data.grade} onChange={e => setData('grade', e.target.value)} className={INPUT} placeholder="A+" />
                                    </Field>
                                    <Field label="Vendor" error={errors.vendor}>
                                        <input value={data.vendor} onChange={e => setData('vendor', e.target.value)} className={INPUT} placeholder="e.g. TechMarkIt" />
                                    </Field>
                                    <Field label="Product Type" error={errors.product_type}>
                                        <input value={data.product_type} onChange={e => setData('product_type', e.target.value)} className={INPUT} placeholder="e.g. Smartphone" />
                                    </Field>
                                    <Field label="Tags" error={errors.tags} hint="Comma-separated">
                                        <input value={data.tags} onChange={e => setData('tags', e.target.value)} className={INPUT} placeholder="apple, iphone, refurbished" />
                                    </Field>
                                </div>
                            </section>

                            {/* Actions */}
                            <div className="flex flex-col gap-3">
                                <button type="submit" disabled={processing}
                                    className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60">
                                    {processing ? 'Saving…' : isNew ? 'Create Product' : 'Save Changes'}
                                </button>
                                <Link href="/admin/products"
                                    className="w-full rounded-lg border py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    Cancel
                                </Link>
                                {!isNew && (
                                    <a href={`/products/${product.id}`} target="_blank"
                                        className="w-full rounded-lg border py-2.5 text-center text-sm font-medium text-blue-600 hover:bg-blue-50">
                                        👁 View on Store ↗
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </AdminLayout>
        </>
    );
}

