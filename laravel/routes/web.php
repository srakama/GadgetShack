<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

Route::get('/', function () {
    $limit = 8;

    $featured = DB::table('products as p')
        ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
        ->where('p.status', '=', 'active')
        ->where('p.featured', '=', 1)
        ->select('p.*', 'c.name as category_name')
        ->inRandomOrder()
        ->limit($limit)
        ->get()
        ->map(fn ($row) => (array) $row)
        ->all();

    $products = $featured;
    if (count($featured) < $limit) {
        $remaining = $limit - count($featured);
        $filler = DB::table('products as p')
            ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
            ->where('p.status', '=', 'active')
            ->where('p.featured', '=', 0)
            ->orderByDesc('p.created_at')
            ->select('p.*', 'c.name as category_name')
            ->limit($remaining)
            ->get()
            ->map(fn ($row) => (array) $row)
            ->all();
        $products = array_merge($featured, $filler);
    }

    $pct = (float) (env('MARKUP_PERCENT', 20));
    if ($pct <= 0) {
        $pct = 20;
    }

    $products = array_map(function (array $p) use ($pct) {
        $images = [];
        if (!empty($p['images'])) {
            $decoded = json_decode($p['images'], true);
            if (is_array($decoded)) {
                $images = $decoded;
            }
        }
        $p['images'] = $images;

        $price = isset($p['price']) ? (float) $p['price'] : 0.0;
        $p['price'] = round($price * (1 + $pct / 100), 2);

        return $p;
    }, $products);

    $newArrivals = DB::table('products as p')
        ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
        ->where('p.status', '=', 'active')
        ->orderByDesc('p.created_at')
        ->select('p.*', 'c.name as category_name')
        ->limit(8)
        ->get()
        ->map(fn ($row) => (array) $row)
        ->all();

    $newArrivals = array_map(function (array $p) use ($pct) {
        $images = [];
        if (!empty($p['images'])) {
            $decoded = json_decode($p['images'], true);
            if (is_array($decoded)) {
                $images = $decoded;
            }
        }
        $p['images'] = $images;

        $price = isset($p['price']) ? (float) $p['price'] : 0.0;
        $p['price'] = round($price * (1 + $pct / 100), 2);

        return $p;
    }, $newArrivals);

    $likedIds = [];
    if (auth()->check()) {
        $likedIds = DB::table('product_likes')
            ->where('user_id', auth()->id())
            ->pluck('product_id')
            ->map(fn ($id) => (int) $id)
            ->all();
    }

    $categories = DB::table('categories')
        ->orderBy('name')
        ->limit(8)
        ->get()
        ->map(fn ($row) => (array) $row)
        ->all();

    return Inertia::render('Storefront/Home', [
        'products' => $products,
        'categories' => $categories,
        'new_arrivals' => $newArrivals,
        'liked_ids' => $likedIds,
    ]);
});

Route::get('/shipping-policy', function () {
    return Inertia::render('Storefront/ShippingPolicy');
})->name('shipping-policy');

Route::get('/refund-policy', function () {
    return Inertia::render('Storefront/RefundPolicy');
})->name('refund-policy');

Route::get('/warranty-policy', function () {
    return Inertia::render('Storefront/WarrantyPolicy');
})->name('warranty-policy');

Route::get('/terms-conditions', function () {
    return Inertia::render('Storefront/TermsConditions');
})->name('terms-conditions');

Route::get('/privacy-statement', function () {
    return Inertia::render('Storefront/PrivacyStatement');
})->name('privacy-statement');

Route::get('/sale-promotions-terms', function () {
    return Inertia::render('Storefront/SalePromotionsTerms');
})->name('sale-promotions-terms');

// Live search suggestions endpoint
Route::get('/search/suggestions', function (Request $request) {
    $q = trim((string) $request->query('q', ''));
    if (mb_strlen($q) > 80) {
        $q = mb_substr($q, 0, 80);
    }
    if (mb_strlen($q) < 2) {
        return response()->json(['brands' => [], 'categories' => [], 'products' => []]);
    }

    $like = '%' . $q . '%';

    $brands = DB::table('products')
        ->where('status', 'active')
        ->whereNotNull('vendor')
        ->where('vendor', '!=', '')
        ->where('vendor', 'like', $like)
        ->distinct()
        ->orderBy('vendor')
        ->limit(5)
        ->pluck('vendor');

    $categories = DB::table('categories as c')
        ->join('products as p', 'p.category_id', '=', 'c.id')
        ->where('p.status', 'active')
        ->where('c.name', 'like', $like)
        ->select('c.id', 'c.name')
        ->distinct()
        ->orderBy('c.name')
        ->limit(5)
        ->get();

    $products = DB::table('products as p')
        ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
        ->where('p.status', 'active')
        ->where(function ($x) use ($like) {
            $x->where('p.name', 'like', $like)
              ->orWhere('p.vendor', 'like', $like)
              ->orWhere('p.product_type', 'like', $like)
              ->orWhere('p.tags', 'like', $like)
              ->orWhere('c.name', 'like', $like);
        })
        ->select('p.id', 'p.name', 'p.vendor', 'c.name as category_name')
        ->limit(6)
        ->get();

    return response()->json(compact('brands', 'categories', 'products'));
});

Route::get('/products', function (Request $request) {
    $pct = (float) (env('MARKUP_PERCENT', 20));
    if ($pct <= 0) {
        $pct = 20;
    }

    $page = (int) $request->query('page', 1);
    if ($page < 1) {
        $page = 1;
    }

    $limit = (int) $request->query('limit', 24);
    if ($limit < 1) {
        $limit = 24;
    }
    if ($limit > 60) {
        $limit = 60;
    }

    $categoryId = $request->query('category');

    $search = $request->query('search');
    if ($search !== null) {
        $search = trim((string) $search);
        if (mb_strlen($search) > 80) {
            $search = mb_substr($search, 0, 80);
        }
    }

    $vendor = $request->query('vendor');
    if ($vendor !== null) {
        $vendor = trim((string) $vendor);
        if (mb_strlen($vendor) > 80) {
            $vendor = mb_substr($vendor, 0, 80);
        }
    }
    $sort = (string) $request->query('sort', 'newest');

    $baseQuery = DB::table('products as p')
        ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
        ->where('p.status', '=', 'active')
        ->select('p.*', 'c.name as category_name');

    if ($categoryId !== null && $categoryId !== '') {
        $baseQuery->where('p.category_id', '=', (int) $categoryId);
    }

    if ($vendor !== null && $vendor !== '') {
        $baseQuery->where('p.vendor', '=', $vendor);
    }

    if ($search !== null && $search !== '') {
        $like = '%'.$search.'%';
        $baseQuery->where(function ($q) use ($like) {
            $q->where('p.name', 'like', $like)
                ->orWhere('p.description', 'like', $like)
                ->orWhere('p.sku', 'like', $like)
                ->orWhere('p.vendor', 'like', $like)
                ->orWhere('p.product_type', 'like', $like)
                ->orWhere('p.tags', 'like', $like)
                ->orWhere('c.name', 'like', $like);
        });
    }

    $total = (clone $baseQuery)->count('p.id');
    $offset = ($page - 1) * $limit;

    $sortKey = $sort;
    if (!in_array($sortKey, ['newest', 'name_asc', 'price_asc', 'price_desc'], true)) {
        $sortKey = 'newest';
    }

    $rows = (clone $baseQuery)
        ->when($sortKey === 'newest', fn ($q) => $q->orderByDesc('p.created_at'))
        ->when($sortKey === 'name_asc', fn ($q) => $q->orderBy('p.name'))
        ->when($sortKey === 'price_asc', fn ($q) => $q->orderBy('p.price'))
        ->when($sortKey === 'price_desc', fn ($q) => $q->orderByDesc('p.price'))
        ->limit($limit)
        ->offset($offset)
        ->get()
        ->map(fn ($row) => (array) $row)
        ->all();

    $rows = array_map(function (array $p) use ($pct) {
        $images = [];
        if (!empty($p['images'])) {
            $decoded = json_decode($p['images'], true);
            if (is_array($decoded)) {
                $images = $decoded;
            }
        }
        $p['images'] = $images;

        $price = isset($p['price']) ? (float) $p['price'] : 0.0;
        $p['price'] = round($price * (1 + $pct / 100), 2);

        return $p;
    }, $rows);

    $categories = DB::table('categories')
        ->orderBy('name')
        ->get();

    $vendors = DB::table('products')
        ->where('status', 'active')
        ->whereNotNull('vendor')
        ->where('vendor', '!=', '')
        ->distinct()
        ->orderBy('vendor')
        ->limit(200)
        ->pluck('vendor')
        ->map(fn ($v) => (string) $v)
        ->all();

    $likedIds = [];
    if (auth()->check()) {
        $likedIds = DB::table('product_likes')
            ->where('user_id', auth()->id())
            ->pluck('product_id')
            ->map(fn ($id) => (int) $id)
            ->all();
    }

    return Inertia::render('Storefront/Products', [
        'products' => $rows,
        'categories' => $categories,
        'vendors' => $vendors,
        'liked_ids' => $likedIds,
        'filters' => [
            'category' => $categoryId,
            'search' => $search,
            'vendor' => $vendor,
            'sort' => $sortKey,
        ],
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => (int) ceil($total / $limit),
        ],
    ]);
});

Route::get('/products/{id}', function (int $id) {
    $pct = (float) (env('MARKUP_PERCENT', 20));
    if ($pct <= 0) {
        $pct = 20;
    }

    $product = DB::table('products as p')
        ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
        ->where('p.id', $id)
        ->select('p.*', 'c.name as category_name')
        ->first();

    if (!$product) {
        abort(404);
    }

    $p = (array) $product;
    $images = [];
    if (!empty($p['images'])) {
        $decoded = json_decode($p['images'], true);
        if (is_array($decoded)) {
            $images = $decoded;
        }
    }
    $p['images'] = $images;

    $price = isset($p['price']) ? (float) $p['price'] : 0.0;
    $p['price'] = round($price * (1 + $pct / 100), 2);

    $related = [];
    if (!empty($p['category_id'])) {
        $relatedRows = DB::table('products as p')
            ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
            ->where('p.status', '=', 'active')
            ->where('p.category_id', '=', (int) $p['category_id'])
            ->where('p.id', '!=', $id)
            ->orderByDesc('p.created_at')
            ->select('p.*', 'c.name as category_name')
            ->limit(8)
            ->get()
            ->map(fn ($row) => (array) $row)
            ->all();

        $related = array_map(function (array $rp) use ($pct) {
            $images = [];
            if (!empty($rp['images'])) {
                $decoded = json_decode($rp['images'], true);
                if (is_array($decoded)) {
                    $images = $decoded;
                }
            }
            $rp['images'] = $images;

            $price = isset($rp['price']) ? (float) $rp['price'] : 0.0;
            $rp['price'] = round($price * (1 + $pct / 100), 2);

            return $rp;
        }, $relatedRows);
    }

    $isLiked = false;
    $likedIds = [];
    if (auth()->check()) {
        $isLiked = DB::table('product_likes')
            ->where('user_id', auth()->id())
            ->where('product_id', $id)
            ->exists();
        $likedIds = DB::table('product_likes')
            ->where('user_id', auth()->id())
            ->pluck('product_id')
            ->map(fn ($rid) => (int) $rid)
            ->all();
    }

    return Inertia::render('Storefront/ProductShow', [
        'product' => $p,
        'related' => $related,
        'is_liked' => $isLiked,
        'liked_ids' => $likedIds,
    ]);
});

// Like toggle route
Route::post('/products/{id}/like', function (int $id, Request $request) {
    $exists = DB::table('product_likes')
        ->where('user_id', $request->user()->id)
        ->where('product_id', $id)
        ->exists();

    if ($exists) {
        DB::table('product_likes')
            ->where('user_id', $request->user()->id)
            ->where('product_id', $id)
            ->delete();
        $liked = false;
    } else {
        DB::table('product_likes')->insert([
            'user_id' => $request->user()->id,
            'product_id' => $id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $liked = true;
    }

    $count = DB::table('product_likes')->where('product_id', $id)->count();

    return response()->json(['liked' => $liked, 'count' => $count]);
})->middleware('auth');

Route::get('/cart', function (Request $request) {
    $pct = (float) (env('MARKUP_PERCENT', 20));
    if ($pct <= 0) {
        $pct = 20;
    }

    $cart = $request->session()->get('cart', []);
    if (!is_array($cart)) {
        $cart = [];
    }

    $productIds = array_map('intval', array_keys($cart));
    $products = [];
    if (count($productIds) > 0) {
        $rows = DB::table('products as p')
            ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
            ->whereIn('p.id', $productIds)
            ->select('p.*', 'c.name as category_name')
            ->get()
            ->map(fn ($row) => (array) $row)
            ->all();

        foreach ($rows as $row) {
            $images = [];
            if (!empty($row['images'])) {
                $decoded = json_decode($row['images'], true);
                if (is_array($decoded)) {
                    $images = $decoded;
                }
            }
            $row['images'] = $images;

            $price = isset($row['price']) ? (float) $row['price'] : 0.0;
            $row['price'] = round($price * (1 + $pct / 100), 2);

            $products[(int) $row['id']] = $row;
        }
    }

    $items = [];
    $subtotal = 0.0;
    foreach ($cart as $productId => $item) {
        $pid = (int) $productId;
        $qty = is_array($item) ? (int) ($item['qty'] ?? 1) : 1;
        if ($qty < 1) {
            $qty = 1;
        }

        $product = $products[$pid] ?? null;
        if (!$product) {
            continue;
        }

        $lineTotal = round(((float) $product['price']) * $qty, 2);
        $subtotal = round($subtotal + $lineTotal, 2);

        $items[] = [
            'product' => $product,
            'qty' => $qty,
            'line_total' => $lineTotal,
        ];
    }

    return Inertia::render('Storefront/Cart', [
        'items' => $items,
        'subtotal' => $subtotal,
    ]);
});

Route::post('/cart/add', function (Request $request) {
    $productId = (int) $request->input('product_id');
    $qty = (int) $request->input('qty', 1);
    if ($qty < 1) {
        $qty = 1;
    }
    if ($qty > 50) {
        $qty = 50;
    }

    $exists = DB::table('products')->where('id', $productId)->exists();
    if (!$exists) {
        return redirect()->back();
    }

    $cart = $request->session()->get('cart', []);
    if (!is_array($cart)) {
        $cart = [];
    }

    $currentQty = (int) (($cart[$productId]['qty'] ?? 0));
    $cart[$productId] = [
        'qty' => min(50, $currentQty + $qty),
    ];

    $request->session()->put('cart', $cart);
    return redirect()->back();
});

Route::post('/cart/update', function (Request $request) {
    $productId = (int) $request->input('product_id');
    $qty = (int) $request->input('qty', 1);
    if ($qty < 1) {
        $qty = 1;
    }
    if ($qty > 50) {
        $qty = 50;
    }

    $cart = $request->session()->get('cart', []);
    if (!is_array($cart)) {
        $cart = [];
    }

    if (array_key_exists($productId, $cart)) {
        $cart[$productId] = [
            'qty' => $qty,
        ];
        $request->session()->put('cart', $cart);
    }

    return redirect()->back();
});

Route::post('/cart/remove', function (Request $request) {
    $productId = (int) $request->input('product_id');

    $cart = $request->session()->get('cart', []);
    if (!is_array($cart)) {
        $cart = [];
    }

    if (array_key_exists($productId, $cart)) {
        unset($cart[$productId]);
        $request->session()->put('cart', $cart);
    }

    return redirect()->back();
});

Route::post('/cart/clear', function (Request $request) {
    $request->session()->forget('cart');
    return redirect()->back();
});

Route::get('/checkout', function (Request $request) {
    $pct = (float) (env('MARKUP_PERCENT', 20));
    if ($pct <= 0) {
        $pct = 20;
    }

    $cart = $request->session()->get('cart', []);
    if (!is_array($cart) || count($cart) === 0) {
        return redirect('/cart');
    }

    $productIds = array_map('intval', array_keys($cart));
    $rows = DB::table('products')
        ->whereIn('id', $productIds)
        ->get()
        ->map(fn ($row) => (array) $row)
        ->all();

    $products = [];
    foreach ($rows as $row) {
        $price = isset($row['price']) ? (float) $row['price'] : 0.0;
        $row['price'] = round($price * (1 + $pct / 100), 2);
        $products[(int) $row['id']] = $row;
    }

    $items = [];
    $subtotal = 0.0;
    foreach ($cart as $productId => $item) {
        $pid = (int) $productId;
        $qty = is_array($item) ? (int) ($item['qty'] ?? 1) : 1;
        if ($qty < 1) {
            $qty = 1;
        }

        $product = $products[$pid] ?? null;
        if (!$product) {
            continue;
        }

        $lineTotal = round(((float) $product['price']) * $qty, 2);
        $subtotal = round($subtotal + $lineTotal, 2);

        $items[] = [
            'product_id' => $pid,
            'name' => $product['name'] ?? '',
            'qty' => $qty,
            'unit_price' => (float) $product['price'],
            'line_total' => $lineTotal,
        ];
    }

    return Inertia::render('Storefront/Checkout', [
        'items' => $items,
        'subtotal' => $subtotal,
    ]);
})->middleware('auth');

Route::post('/checkout/place', function (Request $request) {
    $user = $request->user();

    $pct = (float) (env('MARKUP_PERCENT', 20));
    if ($pct <= 0) {
        $pct = 20;
    }

    $cart = $request->session()->get('cart', []);
    if (!is_array($cart) || count($cart) === 0) {
        return redirect('/cart');
    }

    $shippingAddress = $request->string('shipping_address')->trim()->toString();
    if ($shippingAddress === '') {
        return redirect()->back()->withErrors([
            'shipping_address' => 'Shipping address is required.',
        ]);
    }

    $productIds = array_map('intval', array_keys($cart));
    $rows = DB::table('products')
        ->whereIn('id', $productIds)
        ->where('status', '=', 'active')
        ->get()
        ->map(fn ($row) => (array) $row)
        ->all();

    $products = [];
    foreach ($rows as $row) {
        $price = isset($row['price']) ? (float) $row['price'] : 0.0;
        $row['price'] = round($price * (1 + $pct / 100), 2);
        $products[(int) $row['id']] = $row;
    }

    $items = [];
    $total = 0.0;
    foreach ($cart as $productId => $item) {
        $pid = (int) $productId;
        $qty = is_array($item) ? (int) ($item['qty'] ?? 1) : 1;
        if ($qty < 1) {
            $qty = 1;
        }

        $product = $products[$pid] ?? null;
        if (!$product) {
            continue;
        }

        $unit = (float) $product['price'];
        $line = round($unit * $qty, 2);
        $total = round($total + $line, 2);

        $items[] = [
            'product_id' => $pid,
            'quantity' => $qty,
            'price' => $unit,
        ];
    }

    if (count($items) === 0) {
        return redirect('/cart');
    }

    $now = now();

    DB::beginTransaction();
    try {
        $orderId = DB::table('orders')->insertGetId([
            'user_id' => $user?->id,
            'status' => 'pending',
            'payment_status' => 'pending',
            'payment_intent_id' => null,
            'total_amount' => $total,
            'shipping_address' => $shippingAddress,
            'billing_address' => $shippingAddress,
            'tracking_number' => null,
            'shipping_provider' => null,
            'shipping_service' => null,
            'shipping_cost' => null,
            'shipping_status' => null,
            'shipping_location' => null,
            'estimated_delivery' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        foreach ($items as $it) {
            DB::table('order_items')->insert([
                'order_id' => $orderId,
                'product_id' => $it['product_id'],
                'quantity' => $it['quantity'],
                'price' => $it['price'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        DB::commit();
    } catch (Throwable $e) {
        DB::rollBack();
        throw $e;
    }

    $request->session()->forget('cart');

    return redirect('/orders/'.$orderId);
})->middleware('auth');

Route::get('/orders', function (Request $request) {
    $orders = DB::table('orders')
        ->where('user_id', $request->user()->id)
        ->orderByDesc('created_at')
        ->limit(50)
        ->get()
        ->map(fn ($row) => (array) $row)
        ->all();

    return Inertia::render('Storefront/OrdersIndex', [
        'orders' => $orders,
    ]);
})->middleware('auth');

Route::get('/orders/{id}', function (Request $request, int $id) {
    $order = DB::table('orders')
        ->where('id', $id)
        ->where('user_id', $request->user()->id)
        ->first();

    if (!$order) {
        abort(404);
    }

    $items = DB::table('order_items as oi')
        ->join('products as p', 'oi.product_id', '=', 'p.id')
        ->where('oi.order_id', '=', $id)
        ->select('oi.*', 'p.name as product_name', 'p.images as product_images')
        ->get()
        ->map(function ($row) {
            $arr = (array) $row;
            $images = [];
            if (!empty($arr['product_images'])) {
                $decoded = json_decode($arr['product_images'], true);
                if (is_array($decoded)) {
                    $images = $decoded;
                }
            }
            $arr['product_images'] = $images;
            return $arr;
        })
        ->all();

    return Inertia::render('Storefront/OrderShow', [
        'order' => (array) $order,
        'items' => $items,
    ]);
})->middleware('auth');

Route::get('/payments/payfast/{orderId}/start', function (Request $request, int $orderId) {
    $order = DB::table('orders')
        ->where('id', $orderId)
        ->where('user_id', $request->user()->id)
        ->first();

    if (!$order) {
        abort(404);
    }

    $orderArr = (array) $order;
    if (($orderArr['payment_status'] ?? '') !== 'pending') {
        return redirect('/orders/'.$orderId);
    }

    $merchantId = env('PAYFAST_MERCHANT_ID');
    $merchantKey = env('PAYFAST_MERCHANT_KEY');
    $passphrase = env('PAYFAST_PASSPHRASE');
    $sandbox = (bool) env('PAYFAST_SANDBOX', true);

    if (!$merchantId || !$merchantKey) {
        abort(500, 'PayFast is not configured');
    }

    $baseUrl = $sandbox ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process';

    $returnUrl = url('/payments/payfast/return?order_id='.$orderId);
    $cancelUrl = url('/payments/payfast/cancel?order_id='.$orderId);
    $notifyUrl = url('/payments/payfast/itn');

    $amount = number_format((float) ($orderArr['total_amount'] ?? 0), 2, '.', '');

    $data = [
        'merchant_id' => $merchantId,
        'merchant_key' => $merchantKey,
        'return_url' => $returnUrl,
        'cancel_url' => $cancelUrl,
        'notify_url' => $notifyUrl,
        'm_payment_id' => (string) $orderId,
        'amount' => $amount,
        'item_name' => 'GadgetShack Order #'.$orderId,
        'custom_str1' => (string) $request->user()->id,
    ];

    $toSign = [];
    foreach ($data as $k => $v) {
        $toSign[] = $k.'='.urlencode(trim((string) $v));
    }
    $signStr = implode('&', $toSign);
    if ($passphrase) {
        $signStr .= '&passphrase='.urlencode(trim((string) $passphrase));
    }
    $data['signature'] = md5($signStr);

    return response()->view('payment-redirect', [
        'action' => $baseUrl,
        'fields' => $data,
    ]);
})->middleware('auth');

Route::get('/payments/payfast/return', function (Request $request) {
    $orderId = (int) $request->query('order_id');
    return redirect('/orders/'.$orderId);
})->middleware('auth');

Route::get('/payments/payfast/cancel', function (Request $request) {
    $orderId = (int) $request->query('order_id');
    return redirect('/orders/'.$orderId);
})->middleware('auth');

Route::post('/payments/payfast/itn', function (Request $request) {
    $payload = $request->all();

    $paymentStatus = (string) ($payload['payment_status'] ?? '');
    $orderId = (int) ($payload['m_payment_id'] ?? 0);
    $pfPaymentId = (string) ($payload['pf_payment_id'] ?? '');

    if ($orderId <= 0) {
        return response('OK', 200);
    }

    $merchantId = env('PAYFAST_MERCHANT_ID');
    $passphrase = env('PAYFAST_PASSPHRASE');
    $sandbox = (bool) env('PAYFAST_SANDBOX', true);
    $validateUrl = $sandbox ? 'https://sandbox.payfast.co.za/eng/query/validate' : 'https://www.payfast.co.za/eng/query/validate';

    if (!hash_equals((string) ($payload['merchant_id'] ?? ''), (string) $merchantId)) {
        return response('OK', 200);
    }

    $signature = (string) ($payload['signature'] ?? '');
    $signParts = [];
    foreach ($payload as $k => $v) {
        if ($k === 'signature') {
            continue;
        }
        $signParts[] = $k.'='.urlencode(trim((string) $v));
    }
    $signStr = implode('&', $signParts);
    if ($passphrase) {
        $signStr .= '&passphrase='.urlencode(trim((string) $passphrase));
    }
    $calcSignature = md5($signStr);
    if (!hash_equals($calcSignature, $signature)) {
        return response('OK', 200);
    }

    $pfHostValid = false;
    try {
        $res = Http::asForm()->timeout(30)->post($validateUrl, $payload);
        $pfHostValid = $res->successful() && trim((string) $res->body()) === 'VALID';
    } catch (Throwable $e) {
        $pfHostValid = false;
    }

    DB::table('payment_notifications')->insert([
        'provider' => 'payfast',
        'order_id' => $orderId ?: null,
        'event_type' => 'itn',
        'verified' => $pfHostValid ? 1 : 0,
        'status' => $paymentStatus ?: null,
        'reference' => $pfPaymentId ?: null,
        'remote_ip' => $request->ip(),
        'payload' => json_encode($payload),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    if ($pfHostValid && strtoupper($paymentStatus) === 'COMPLETE') {
        DB::table('orders')
            ->where('id', $orderId)
            ->update([
                'payment_status' => 'paid',
                'payment_intent_id' => $pfPaymentId ?: 'payfast',
                'updated_at' => now(),
            ]);
    }

    return response('OK', 200);
});

Route::get('/payments/paypal/{orderId}/start', function (Request $request, int $orderId) {
    $order = DB::table('orders')
        ->where('id', $orderId)
        ->where('user_id', $request->user()->id)
        ->first();

    if (!$order) {
        abort(404);
    }

    $orderArr = (array) $order;
    if (($orderArr['payment_status'] ?? '') !== 'pending') {
        return redirect('/orders/'.$orderId);
    }

    $business = env('PAYPAL_BUSINESS_EMAIL');
    $sandbox = (bool) env('PAYPAL_SANDBOX', true);
    if (!$business) {
        abort(500, 'PayPal is not configured');
    }

    $baseUrl = $sandbox ? 'https://www.sandbox.paypal.com/cgi-bin/webscr' : 'https://www.paypal.com/cgi-bin/webscr';
    $returnUrl = url('/payments/paypal/return?order_id='.$orderId);
    $cancelUrl = url('/payments/paypal/cancel?order_id='.$orderId);
    $notifyUrl = url('/payments/paypal/ipn');

    $amount = number_format((float) ($orderArr['total_amount'] ?? 0), 2, '.', '');

    $fields = [
        'cmd' => '_xclick',
        'business' => $business,
        'item_name' => 'GadgetShack Order #'.$orderId,
        'amount' => $amount,
        'currency_code' => env('PAYPAL_CURRENCY', 'ZAR'),
        'custom' => (string) $orderId,
        'return' => $returnUrl,
        'cancel_return' => $cancelUrl,
        'notify_url' => $notifyUrl,
        'no_shipping' => '1',
    ];

    return response()->view('payment-redirect', [
        'action' => $baseUrl,
        'fields' => $fields,
    ]);
})->middleware('auth');

Route::get('/payments/paypal/return', function (Request $request) {
    $orderId = (int) $request->query('order_id');
    return redirect('/orders/'.$orderId);
})->middleware('auth');

Route::get('/payments/paypal/cancel', function (Request $request) {
    $orderId = (int) $request->query('order_id');
    return redirect('/orders/'.$orderId);
})->middleware('auth');

Route::post('/payments/paypal/ipn', function (Request $request) {
    $payload = $request->all();

    $orderId = (int) ($payload['custom'] ?? 0);
    if ($orderId <= 0) {
        return response('OK', 200);
    }

    $sandbox = (bool) env('PAYPAL_SANDBOX', true);
    $verifyUrl = $sandbox ? 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr' : 'https://ipnpb.paypal.com/cgi-bin/webscr';

    $verifyPayload = array_merge(['cmd' => '_notify-validate'], $payload);

    $verified = false;
    try {
        $res = Http::asForm()->timeout(30)->post($verifyUrl, $verifyPayload);
        $verified = $res->successful() && trim((string) $res->body()) === 'VERIFIED';
    } catch (Throwable $e) {
        $verified = false;
    }

    if (!$verified) {
        DB::table('payment_notifications')->insert([
            'provider' => 'paypal',
            'order_id' => $orderId ?: null,
            'event_type' => 'ipn',
            'verified' => 0,
            'status' => (string) ($payload['payment_status'] ?? null),
            'reference' => (string) ($payload['txn_id'] ?? null),
            'remote_ip' => $request->ip(),
            'payload' => json_encode($payload),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        return response('OK', 200);
    }

    $paymentStatus = strtoupper((string) ($payload['payment_status'] ?? ''));
    $txnId = (string) ($payload['txn_id'] ?? '');

    $receiverEmail = (string) ($payload['receiver_email'] ?? '');
    $business = (string) env('PAYPAL_BUSINESS_EMAIL', '');
    if ($business !== '' && !hash_equals(strtolower($business), strtolower($receiverEmail))) {
        return response('OK', 200);
    }

    if ($paymentStatus === 'COMPLETED') {
        DB::table('orders')
            ->where('id', $orderId)
            ->update([
                'payment_status' => 'paid',
                'payment_intent_id' => $txnId ?: 'paypal',
                'updated_at' => now(),
            ]);
    }

    DB::table('payment_notifications')->insert([
        'provider' => 'paypal',
        'order_id' => $orderId ?: null,
        'event_type' => 'ipn',
        'verified' => 1,
        'status' => (string) ($payload['payment_status'] ?? null),
        'reference' => $txnId ?: null,
        'remote_ip' => $request->ip(),
        'payload' => json_encode($payload),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return response('OK', 200);
});

Route::get('/orders/{id}/status', function (Request $request, int $id) {
    $row = DB::table('orders')
        ->where('id', $id)
        ->where('user_id', $request->user()->id)
        ->first();

    if (!$row) {
        abort(404);
    }

    return response()->json([
        'payment_status' => (string) ($row->payment_status ?? 'pending'),
    ]);
})->middleware('auth');

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::get('/ready', function () {
    return response()->json([
        'status' => 'ready',
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ─── Admin Routes ────────────────────────────────────────────────────────────
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {

    // Dashboard
    Route::get('/', function (Request $request) {
        $markup = (float) (env('MARKUP_PERCENT', 20));

        $stats = [
            'total_products'   => DB::table('products')->count(),
            'active_products'  => DB::table('products')->where('status', 'active')->count(),
            'inactive_products'=> DB::table('products')->where('status', '!=', 'active')->count(),
            'featured_products'=> DB::table('products')->where('featured', 1)->count(),
            'out_of_stock'     => DB::table('products')->where('stock_quantity', 0)->count(),
            'total_orders'     => DB::table('orders')->count(),
            'total_revenue'    => DB::table('orders')->where('payment_status', 'paid')->sum('total_amount'),
            'total_users'      => DB::table('users')->where('role', 'customer')->count(),
            'total_categories' => DB::table('categories')->count(),
        ];

        $recent = DB::table('products')
            ->leftJoin('categories as c', 'products.category_id', '=', 'c.id')
            ->select('products.*', 'c.name as category_name')
            ->orderByDesc('products.created_at')
            ->limit(5)
            ->get()
            ->map(fn ($r) => (array) $r)
            ->all();

        foreach ($recent as &$r) {
            $r['images'] = is_string($r['images'] ?? null) ? (json_decode($r['images'], true) ?: []) : [];
        }

        return Inertia::render('Admin/Dashboard', [
            'stats'   => $stats,
            'recent'  => $recent,
            'markup'  => $markup,
        ]);
    })->name('admin.dashboard');

    // Products index
    Route::get('/products', function (Request $request) {
        $markup = (float) (env('MARKUP_PERCENT', 20));
        $page   = max(1, (int) $request->query('page', 1));
        $limit  = 25;
        $search = $request->query('search', '');
        $status = $request->query('status', '');
        $catId  = $request->query('category', '');

        $q = DB::table('products as p')
            ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
            ->select('p.*', 'c.name as category_name');

        if ($search) {
            $like = '%'.$search.'%';
            $q->where(fn ($x) => $x->where('p.name', 'like', $like)
                ->orWhere('p.sku', 'like', $like)
                ->orWhere('p.vendor', 'like', $like));
        }
        if ($status) $q->where('p.status', $status);
        if ($catId)  $q->where('p.category_id', (int) $catId);

        $total = (clone $q)->count('p.id');
        $rows  = (clone $q)->orderByDesc('p.created_at')->limit($limit)->offset(($page - 1) * $limit)->get()
            ->map(fn ($r) => (array) $r)->all();

        foreach ($rows as &$r) {
            $r['images'] = is_string($r['images'] ?? null) ? (json_decode($r['images'], true) ?: []) : [];
        }

        $categories = DB::table('categories')->orderBy('name')->get();

        return Inertia::render('Admin/Products/Index', [
            'products'   => $rows,
            'categories' => $categories,
            'markup'     => $markup,
            'filters'    => compact('search', 'status', 'catId'),
            'pagination' => ['page' => $page, 'limit' => $limit, 'total' => $total, 'pages' => (int) ceil($total / $limit)],
        ]);
    })->name('admin.products.index');

    // Upload image file
    Route::post('/products/upload-image', function (Request $request) {
        $request->validate(['image' => 'required|image|max:5120']); // 5 MB max
        $path = $request->file('image')->store('products', 'public');
        return response()->json(['url' => asset('storage/' . $path)]);
    })->name('admin.products.upload_image');

    // Create form
    Route::get('/products/create', function (Request $request) {
        $markup = (float) (env('MARKUP_PERCENT', 20));
        $categories = DB::table('categories')->orderBy('name')->get();
        return Inertia::render('Admin/Products/Edit', [
            'product'    => null,
            'categories' => $categories,
            'markup'     => $markup,
        ]);
    })->name('admin.products.create');

    // Store new product
    Route::post('/products', function (Request $request) {
        $data = $request->validate([
            'sku'              => 'required|string|max:255|unique:products,sku',
            'name'             => 'required|string|max:255',
            'description'      => 'nullable|string',
            'price'            => 'required|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0',
            'category_id'      => 'nullable|integer|exists:categories,id',
            'stock_quantity'   => 'required|integer|min:0',
            'status'           => 'required|in:active,inactive,draft',
            'featured'         => 'boolean',
            'grade'            => 'nullable|string|max:50',
            'vendor'           => 'nullable|string|max:255',
            'product_type'     => 'nullable|string|max:255',
            'tags'             => 'nullable|string',
            'source_url'       => 'nullable|string|max:2048',
            'images'           => 'nullable|array',
            'images.*'         => 'nullable|string|url',
        ]);

        $data['images'] = json_encode(array_values(array_filter($data['images'] ?? [])));
        $data['featured'] = (bool) ($data['featured'] ?? false);
        $data['created_at'] = now();
        $data['updated_at'] = now();

        $id = DB::table('products')->insertGetId($data);
        return redirect('/admin/products/'.$id.'/edit')->with('success', 'Product created.');
    })->name('admin.products.store');

    // Edit form
    Route::get('/products/{id}/edit', function (Request $request, int $id) {
        $markup = (float) (env('MARKUP_PERCENT', 20));
        $product = DB::table('products as p')
            ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
            ->where('p.id', $id)
            ->select('p.*', 'c.name as category_name')
            ->first();

        if (!$product) abort(404);
        $p = (array) $product;
        $p['images'] = is_string($p['images'] ?? null) ? (json_decode($p['images'], true) ?: []) : [];

        $categories = DB::table('categories')->orderBy('name')->get();
        return Inertia::render('Admin/Products/Edit', [
            'product'    => $p,
            'categories' => $categories,
            'markup'     => $markup,
        ]);
    })->name('admin.products.edit');

    // Update product
    Route::put('/products/{id}', function (Request $request, int $id) {
        $data = $request->validate([
            'sku'              => 'required|string|max:255|unique:products,sku,'.$id,
            'name'             => 'required|string|max:255',
            'description'      => 'nullable|string',
            'price'            => 'required|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0',
            'category_id'      => 'nullable|integer|exists:categories,id',
            'stock_quantity'   => 'required|integer|min:0',
            'status'           => 'required|in:active,inactive,draft',
            'featured'         => 'boolean',
            'grade'            => 'nullable|string|max:50',
            'vendor'           => 'nullable|string|max:255',
            'product_type'     => 'nullable|string|max:255',
            'tags'             => 'nullable|string',
            'source_url'       => 'nullable|string|max:2048',
            'images'           => 'nullable|array',
            'images.*'         => 'nullable|string',
        ]);

        $data['images'] = json_encode(array_values(array_filter($data['images'] ?? [])));
        $data['featured'] = (bool) ($data['featured'] ?? false);
        $data['updated_at'] = now();

        DB::table('products')->where('id', $id)->update($data);
        return redirect('/admin/products/'.$id.'/edit')->with('success', 'Product updated successfully.');
    })->name('admin.products.update');

    // Delete product
    Route::delete('/products/{id}', function (Request $request, int $id) {
        DB::table('product_likes')->where('product_id', $id)->delete();
        DB::table('products')->where('id', $id)->delete();
        return redirect('/admin/products')->with('success', 'Product deleted.');
    })->name('admin.products.destroy');

    // Toggle featured
    Route::post('/products/{id}/featured', function (Request $request, int $id) {
        $product = DB::table('products')->where('id', $id)->first();
        if (!$product) abort(404);
        DB::table('products')->where('id', $id)->update([
            'featured'   => !$product->featured,
            'updated_at' => now(),
        ]);
        return back();
    })->name('admin.products.featured');

    // Orders index (stub)
    Route::get('/orders', function (Request $request) {
        $orders = DB::table('orders as o')
            ->leftJoin('users as u', 'o.user_id', '=', 'u.id')
            ->select('o.*', 'u.name as user_name', 'u.email as user_email')
            ->orderByDesc('o.created_at')
            ->limit(100)
            ->get()
            ->map(fn ($r) => (array) $r)
            ->all();
        return Inertia::render('Admin/Orders', ['orders' => $orders]);
    })->name('admin.orders');
});

require __DIR__.'/auth.php';
