<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

function gadgetshack_markup_percent(): float
{
    $val = (float) (env('MARKUP_PERCENT', 20));
    return $val > 0 ? $val : 20;
}

function gadgetshack_apply_markup(float $basePrice): float
{
    $pct = gadgetshack_markup_percent();
    $final = $basePrice * (1 + $pct / 100);
    return round($final, 2);
}

function gadgetshack_format_product(array $product): array
{
    $images = [];
    if (!empty($product['images'])) {
        $decoded = json_decode($product['images'], true);
        if (is_array($decoded)) {
            $images = $decoded;
        }
    }

    $sizes = [];
    if (!empty($product['sizes'])) {
        $sizes = array_values(array_filter(array_map('trim', explode(',', (string) $product['sizes']))));
    }

    $colors = [];
    if (!empty($product['colors'])) {
        $colors = array_values(array_filter(array_map('trim', explode(',', (string) $product['colors']))));
    }

    $price = isset($product['price']) ? (float) $product['price'] : 0.0;

    $product['images'] = $images;
    $product['sizes'] = $sizes;
    $product['colors'] = $colors;
    $product['price'] = gadgetshack_apply_markup($price);

    return $product;
}

Route::get('/homepage', function (Request $request) {
    $limit = (int) $request->query('limit', 8);
    if ($limit <= 0) {
        $limit = 8;
    }

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

    $formatted = array_map('gadgetshack_format_product', $products);

    return response()->json([
        'products' => $formatted,
        'pagination' => ['limit' => $limit],
    ]);
});

Route::get('/categories', function () {
    $categories = DB::table('categories as c')
        ->leftJoin('products as p', function ($join) {
            $join->on('c.id', '=', 'p.category_id')
                ->where('p.status', '=', 'active');
        })
        ->groupBy('c.id', 'c.name', 'c.description', 'c.created_at', 'c.updated_at')
        ->orderBy('c.name')
        ->selectRaw('c.*, COUNT(p.id) as product_count')
        ->get();

    return response()->json(['categories' => $categories]);
});

Route::get('/categories/{id}', function (int $id) {
    $category = DB::table('categories as c')
        ->leftJoin('products as p', function ($join) {
            $join->on('c.id', '=', 'p.category_id')
                ->where('p.status', '=', 'active');
        })
        ->where('c.id', '=', $id)
        ->groupBy('c.id', 'c.name', 'c.description', 'c.created_at', 'c.updated_at')
        ->selectRaw('c.*, COUNT(p.id) as product_count')
        ->first();

    if (!$category) {
        return response()->json(['error' => 'Category not found'], 404);
    }

    return response()->json(['category' => $category]);
});

Route::get('/products', function (Request $request) {
    $page = (int) $request->query('page', 1);
    $limit = (int) $request->query('limit', 20);
    $category = $request->query('category');
    $search = $request->query('search');
    $minPrice = $request->query('minPrice');
    $maxPrice = $request->query('maxPrice');
    $status = $request->query('status', 'active');

    if ($page < 1) {
        $page = 1;
    }
    if ($limit < 1) {
        $limit = 20;
    }

    $query = DB::table('products as p')
        ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
        ->where('p.status', '=', $status)
        ->select('p.*', 'c.name as category_name');

    if ($category !== null && $category !== '') {
        $query->where('p.category_id', '=', (int) $category);
    }

    if ($search) {
        $like = '%'.$search.'%';
        $query->where(function ($q) use ($like) {
            $q->where('p.name', 'like', $like)
                ->orWhere('p.description', 'like', $like)
                ->orWhere('p.sku', 'like', $like);
        });
    }

    if ($minPrice !== null && $minPrice !== '') {
        $query->where('p.price', '>=', (float) $minPrice);
    }

    if ($maxPrice !== null && $maxPrice !== '') {
        $query->where('p.price', '<=', (float) $maxPrice);
    }

    $total = (clone $query)->count('p.id');

    $offset = ($page - 1) * $limit;

    $rows = $query
        ->orderByDesc('p.created_at')
        ->limit($limit)
        ->offset($offset)
        ->get()
        ->map(fn ($row) => (array) $row)
        ->all();

    $formatted = array_map('gadgetshack_format_product', $rows);

    return response()->json([
        'products' => $formatted,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => (int) ceil($total / $limit),
        ],
    ]);
});

Route::get('/products/{id}', function (int $id) {
    $product = DB::table('products as p')
        ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
        ->where('p.id', '=', $id)
        ->select('p.*', 'c.name as category_name')
        ->first();

    if (!$product) {
        return response()->json(['error' => 'Product not found'], 404);
    }

    return response()->json(['product' => gadgetshack_format_product((array) $product)]);
});
