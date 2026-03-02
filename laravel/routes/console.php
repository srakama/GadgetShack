<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('gadgetshack:import {--path=} {--full}', function () {
    $path = $this->option('path');

    if (!$path) {
        $candidates = [
            base_path('../scraper/data/techmarkit-products.json'),
            base_path('../scraper/data/techmarkit_products.json'),
            base_path('../techmarkit_products.json'),
        ];

        foreach ($candidates as $candidate) {
            if (File::exists($candidate)) {
                $path = $candidate;
                break;
            }
        }
    }

    if (!$path || !File::exists($path)) {
        $this->error('Import JSON file not found. Provide --path=/absolute/or/relative/path.json');
        return self::FAILURE;
    }

    $this->info('Reading: '.$path);

    $raw = File::get($path);
    $decoded = json_decode($raw, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        $this->error('Invalid JSON: '.json_last_error_msg());
        return self::FAILURE;
    }

    $products = $decoded;
    if (is_array($decoded) && array_key_exists('products', $decoded) && is_array($decoded['products'])) {
        $products = $decoded['products'];
    }

    if (!is_array($products)) {
        $this->error('Unexpected JSON structure: expected an array of products or {"products": [...]}');
        return self::FAILURE;
    }

    $now = now();
    $categoryMap = [];
    $seenSkus = [];

    $newCount = 0;
    $updatedCount = 0;
    $skippedCount = 0;

    DB::beginTransaction();
    try {
        foreach ($products as $product) {
            if (!is_array($product)) {
                $skippedCount++;
                continue;
            }

            $sku = $product['sku'] ?? null;
            if (!$sku) {
                $skippedCount++;
                continue;
            }

            $seenSkus[] = $sku;

            $categoryName = $product['category'] ?? null;
            $categoryId = null;

            if ($categoryName) {
                if (array_key_exists($categoryName, $categoryMap)) {
                    $categoryId = $categoryMap[$categoryName];
                } else {
                    $existingCategoryId = DB::table('categories')->where('name', $categoryName)->value('id');
                    if ($existingCategoryId) {
                        $categoryId = $existingCategoryId;
                    } else {
                        $categoryId = DB::table('categories')->insertGetId([
                            'name' => $categoryName,
                            'description' => 'Products in the '.$categoryName.' category',
                            'created_at' => $now,
                            'updated_at' => $now,
                        ]);
                    }

                    $categoryMap[$categoryName] = $categoryId;
                }
            }

            $images = $product['images'] ?? [];
            if (!is_array($images)) {
                $images = [];
            }

            $tags = $product['tags'] ?? null;
            if (is_array($tags)) {
                $tags = json_encode($tags);
            }

            $data = [
                'sku' => $sku,
                'name' => $product['name'] ?? '',
                'description' => $product['description'] ?? null,
                'price' => (float) ($product['price'] ?? 0),
                'category_id' => $categoryId,
                'stock_quantity' => (int) ($product['stock_quantity'] ?? 0),
                'images' => json_encode($images),
                'sizes' => $product['sizes'] ?? null,
                'colors' => $product['colors'] ?? null,
                'status' => $product['status'] ?? 'active',
                'scraped_at' => $product['scraped_at'] ?? null,
                'source_url' => $product['source_url'] ?? null,
                'grade' => $product['grade'] ?? null,
                'shopify_id' => isset($product['shopify_id']) ? (string) $product['shopify_id'] : null,
                'product_type' => $product['product_type'] ?? null,
                'tags' => $tags,
                'vendor' => $product['vendor'] ?? null,
                'compare_at_price' => isset($product['compare_at_price']) ? (float) $product['compare_at_price'] : null,
                'discount_percent' => isset($product['discount_percent']) ? (int) $product['discount_percent'] : null,
                'featured' => !empty($product['featured']) ? 1 : 0,
                'updated_at' => $now,
            ];

            $existingId = DB::table('products')->where('sku', $sku)->value('id');
            if ($existingId) {
                DB::table('products')->where('id', $existingId)->update($data);
                $updatedCount++;
            } else {
                $data['created_at'] = $now;
                DB::table('products')->insert($data);
                $newCount++;
            }
        }

        if ($this->option('full')) {
            $this->info('Full import: deactivating products not present in input file...');

            if (count($seenSkus) === 0) {
                $this->warn('No SKUs found in input. Skipping deactivation step.');
            } else {
                $affected = DB::table('products')
                    ->where('status', 'active')
                    ->whereNotIn('sku', $seenSkus)
                    ->update([
                        'status' => 'inactive',
                        'updated_at' => $now,
                    ]);

                $this->info('Deactivated: '.$affected);
            }
        }

        DB::commit();
    } catch (Throwable $e) {
        DB::rollBack();
        $this->error('Import failed: '.$e->getMessage());
        return self::FAILURE;
    }

    $this->info('Import complete.');
    $this->line('New: '.$newCount);
    $this->line('Updated: '.$updatedCount);
    $this->line('Skipped: '.$skippedCount);

    return self::SUCCESS;
})->purpose('Import scraper JSON into categories/products (idempotent by SKU)');

Artisan::command('gadgetshack:scrape-techmarkit {--base=} {--output=} {--full} {--limit=} {--max-pages=} {--updated-at-min=}', function () {
    $baseUrl = (string) ($this->option('base') ?: env('TM_BASE_URL', 'https://techmarkit.co.za'));
    $baseUrl = rtrim($baseUrl, '/');

    $limit = (int) ($this->option('limit') ?: env('TM_LIMIT', 250));
    if ($limit < 1) {
        $limit = 250;
    }
    if ($limit > 250) {
        $limit = 250;
    }

    $maxPages = (int) ($this->option('max-pages') ?: 10);
    if ($maxPages < 1) {
        $maxPages = 10;
    }

    $outputPath = (string) ($this->option('output') ?: base_path('../scraper/data/techmarkit-products.json'));
    $lastRunFile = base_path('../scraper/data/last_run.json');

    $isFull = (bool) $this->option('full');
    $updatedAtMin = $this->option('updated-at-min');
    if (!$isFull && !$updatedAtMin) {
        if (File::exists($lastRunFile)) {
            $decoded = json_decode((string) File::get($lastRunFile), true);
            if (is_array($decoded) && !empty($decoded['last_run'])) {
                $updatedAtMin = (string) $decoded['last_run'];
            }
        }
    }

    $collections = [
        ['handle' => 'used-refurbished-new-smartphones', 'name' => 'Smartphones', 'category' => 'Smartphones'],
        ['handle' => 'used-refurbished-new-laptops', 'name' => 'Laptops', 'category' => 'Laptops'],
        ['handle' => 'refurbished-used-second-hand-iphones', 'name' => 'iPhones', 'category' => 'Smartphones'],
        ['handle' => 'used-refurbished-second-hand-samsung-phones', 'name' => 'Samsung Phones', 'category' => 'Smartphones'],
        ['handle' => 'used-refurbished-new-tablets-ereaders', 'name' => 'Tablets', 'category' => 'Tablets'],
        ['handle' => 'monitors', 'name' => 'Monitors', 'category' => 'Electronics'],
        ['handle' => 'audio-speakers', 'name' => 'Audio & Speakers', 'category' => 'Audio'],
        ['handle' => 'fitness-watches-1', 'name' => 'Fitness & Watches', 'category' => 'Wearables'],
    ];

    $userAgent = 'GadgetShackBot/1.0 (+https://gadgetshack.local)';

    $stripHtml = function (string $html): string {
        $txt = preg_replace('/<[^>]*>/', '', $html);
        $txt = preg_replace('/\s+/', ' ', (string) $txt);
        return trim((string) $txt);
    };

    $generateDescription = function (string $name, string $grade): string {
        $gradeDescriptions = [
            'New' => 'Brand new device with full warranty and original packaging.',
            'A+' => 'Excellent condition with minimal signs of use. Fully tested and certified.',
            'A' => 'Very good condition with light signs of use. Fully functional and tested.',
            'B' => 'Good condition with moderate signs of use. Fully functional and tested.',
            'C' => 'Fair condition with visible signs of use. Fully functional and tested.',
            'Used' => 'Pre-owned device in working condition.',
        ];

        $baseDescription = $name.' available at TechMarkIt South Africa. ';
        $gradeDescription = $gradeDescriptions[$grade] ?? $gradeDescriptions['Used'];
        $warranty = ' Comes with TechMarkIt warranty and 14-day return policy.';

        return $baseDescription.$gradeDescription.$warranty;
    };

    $isDuplicate = function (array $product, array $existingProducts): bool {
        $name = strtolower((string) ($product['name'] ?? ''));
        $sku = (string) ($product['sku'] ?? '');

        foreach ($existingProducts as $ex) {
            if (strtolower((string) ($ex['name'] ?? '')) === $name) {
                return true;
            }
            if (!empty($sku) && (string) ($ex['sku'] ?? '') === $sku) {
                return true;
            }
        }

        return false;
    };

    $convertShopifyProduct = function (array $shopifyProduct, ?string $categoryOverride) use ($baseUrl, $stripHtml, $generateDescription): ?array {
        $name = (string) ($shopifyProduct['title'] ?? '');
        $handle = (string) ($shopifyProduct['handle'] ?? '');
        if (!$name || mb_strlen($name) < 5) {
            return null;
        }

        $isPublished = !empty($shopifyProduct['published_at']);

        $price = 0.0;
        $compareAt = null;
        $variants = is_array($shopifyProduct['variants'] ?? null) ? $shopifyProduct['variants'] : [];
        if (count($variants) > 0) {
            $v0 = $variants[0];
            $price = (float) ($v0['price'] ?? 0);
            $compareAt = isset($v0['compare_at_price']) && $v0['compare_at_price'] !== null
                ? (float) $v0['compare_at_price']
                : null;
        }

        if ($price <= 0) {
            return null;
        }

        $images = [];
        $shopifyImages = is_array($shopifyProduct['images'] ?? null) ? $shopifyProduct['images'] : [];
        if (count($shopifyImages) > 0) {
            foreach ($shopifyImages as $img) {
                $src = $img['src'] ?? null;
                if (is_string($src) && str_starts_with($src, '//')) {
                    $src = 'https:'.$src;
                }
                if (is_string($src) && $src !== '') {
                    $images[] = $src;
                }
            }
        }

        if (count($images) === 0 && count($variants) > 0) {
            $vsrc = $variants[0]['featured_image']['src'] ?? null;
            if (is_string($vsrc) && str_starts_with($vsrc, '//')) {
                $vsrc = 'https:'.$vsrc;
            }
            if (is_string($vsrc) && $vsrc !== '') {
                $images = [$vsrc];
            }
        }

        $category = $categoryOverride ?: 'Electronics';
        $productType = strtolower((string) ($shopifyProduct['product_type'] ?? ''));
        $tags = is_array($shopifyProduct['tags'] ?? null) ? $shopifyProduct['tags'] : (string) ($shopifyProduct['tags'] ?? '');
        $tagsArr = is_array($tags) ? $tags : array_values(array_filter(array_map('trim', explode(',', $tags))));
        $allText = strtolower(trim($name.' '.$productType.' '.implode(' ', $tagsArr)));

        if (preg_match('/\b(phone|iphone|samsung|galaxy|xiaomi|pixel|oppo|vivo|nova|note|ultra)\b/', $allText)) {
            $category = 'Smartphones';
        } elseif (preg_match('/\b(laptop|notebook|macbook|thinkpad|ideapad|pavilion|envy|xps|zenbook|vivobook|raider|tuf|modern|thin|latitude|elitebook|vostro|surface)\b/', $allText)) {
            $category = 'Laptops';
        } elseif (preg_match('/\b(tablet|ipad|matepad|tab|ereader|e-reader)\b/', $allText)) {
            $category = 'Tablets';
        } elseif (preg_match('/\b(watch|wearable|fitness|fitbit|galaxy watch|apple watch)\b/', $allText)) {
            $category = 'Wearables';
        } elseif (preg_match('/\b(headphone|earbud|earphone|speaker|audio|jbl|bose|sony|skullcandy)\b/', $allText)) {
            $category = 'Audio';
        } elseif (preg_match('/\b(keyboard|mouse|monitor|ssd|charger|power bank|case|cable|dock|adapter)\b/', $allText)) {
            $category = 'Accessories';
        }

        $grade = 'Used';
        $titleLower = strtolower($name);
        $allTagsLower = strtolower(implode(' ', $tagsArr));
        if (str_contains($titleLower, 'new') || str_contains($allTagsLower, 'new')) {
            $grade = 'New';
        } elseif (str_contains($allTagsLower, 'grade a+') || str_contains($allTagsLower, 'grade: a+')) {
            $grade = 'A+';
        } elseif (str_contains($allTagsLower, 'grade a') || str_contains($allTagsLower, 'grade: a')) {
            $grade = 'A';
        } elseif (str_contains($allTagsLower, 'grade b') || str_contains($allTagsLower, 'grade: b')) {
            $grade = 'B';
        } elseif (str_contains($allTagsLower, 'grade c') || str_contains($allTagsLower, 'grade: c')) {
            $grade = 'C';
        }

        $productId = $shopifyProduct['id'] ?? null;
        $variantId = $variants[0]['id'] ?? $productId;

        if (!$productId) {
            return null;
        }

        $slug = strtoupper($handle);
        $slug = preg_replace('/[^A-Z0-9-]/', '-', (string) $slug);
        $slug = substr((string) $slug, 0, 12);
        $sku = 'TM-'.$productId.'-'.$variantId.'-'.$slug;

        $description = '';
        if (!empty($shopifyProduct['body_html'])) {
            $description = $stripHtml((string) $shopifyProduct['body_html']);
            $description = substr($description, 0, 500).'...';
        } else {
            $description = $generateDescription($name, $grade);
        }

        $stockQuantity = 10;
        if (count($variants) > 0) {
            $inv = $variants[0]['inventory_quantity'] ?? null;
            if ($inv !== null && is_numeric($inv) && (int) $inv >= 0) {
                $stockQuantity = (int) $inv;
            }
        }

        $discountPercent = 0;
        if ($compareAt !== null && $compareAt > 0 && $compareAt > $price) {
            $discountPercent = (int) round((($compareAt - $price) / $compareAt) * 100);
        }

        $sourceUrl = ($isPublished && $handle)
            ? $baseUrl.'/products/'.$handle
            : $baseUrl.'/search?q='.rawurlencode($name);

        return [
            'sku' => $sku,
            'name' => $name,
            'description' => $description,
            'price' => $price,
            'compare_at_price' => $compareAt,
            'discount_percent' => $discountPercent,
            'category' => $category,
            'images' => $images,
            'stock_quantity' => $stockQuantity,
            'grade' => $grade,
            'vendor' => $shopifyProduct['vendor'] ?? null,
            'source_url' => $sourceUrl,
            'shopify_id' => $productId,
            'product_type' => $shopifyProduct['product_type'] ?? null,
            'tags' => $tagsArr,
        ];
    };

    $getWithRetry = function (string $url, int $tries = 5) use ($userAgent) {
        $delayMs = 500;
        for ($i = 0; $i < $tries; $i++) {
            $res = Http::withHeaders([
                'User-Agent' => $userAgent,
            ])->timeout(30)->get($url);

            if ($res->successful()) {
                return $res;
            }

            if ($res->status() === 429) {
                $retryAfterSeconds = (int) ($res->header('Retry-After') ?: 2);
                usleep(max(1, $retryAfterSeconds) * 1000 * 1000);
                continue;
            }

            if ($i < $tries - 1) {
                usleep($delayMs * 1000);
                $delayMs *= 2;
                continue;
            }

            $res->throw();
        }

        return null;
    };

    $products = [];
    $this->info('Starting TechMarkIt Shopify scrape');
    $this->line('Base URL: '.$baseUrl);
    if ($updatedAtMin) {
        $this->line('updated_at_min: '.$updatedAtMin);
    } else {
        $this->line('updated_at_min: (none)');
    }

    $this->info('Fetching via /products.json');
    $page = 1;
    $hasMore = true;
    while ($hasMore && $page <= $maxPages) {
        $params = [
            'limit' => (string) $limit,
            'page' => (string) $page,
        ];
        if ($updatedAtMin) {
            $params['updated_at_min'] = (string) $updatedAtMin;
        }

        $url = $baseUrl.'/products.json?'.http_build_query($params);
        $this->line('Page '.$page.': '.$url);

        try {
            $res = $getWithRetry($url);
            if (!$res) {
                $hasMore = false;
                break;
            }

            $data = $res->json();
            $items = is_array($data['products'] ?? null) ? $data['products'] : [];
            if (count($items) === 0) {
                $hasMore = false;
                break;
            }

            foreach ($items as $shopifyProduct) {
                if (!is_array($shopifyProduct)) {
                    continue;
                }

                $product = $convertShopifyProduct($shopifyProduct, null);
                if (!$product) {
                    continue;
                }

                if (!$isDuplicate($product, $products)) {
                    $products[] = $product;
                }
            }

            $hasMore = count($items) === $limit;
            $page++;

            usleep((300 + random_int(0, 500)) * 1000);
        } catch (Throwable $e) {
            $this->warn('Error on page '.$page.': '.$e->getMessage());
            $hasMore = false;
        }
    }

    if (count($products) < 20) {
        $this->warn('Low product count from /products.json, trying collection-specific scraping...');
        foreach ($collections as $collection) {
            $this->info('Scraping collection: '.$collection['name']);
            $cPage = 1;
            $cHasMore = true;
            while ($cHasMore && $cPage <= 5) {
                $url = $baseUrl.'/collections/'.$collection['handle'].'/products.json?'.http_build_query([
                    'limit' => '250',
                    'page' => (string) $cPage,
                ]);
                $this->line('  Page '.$cPage.': '.$url);

                try {
                    $res = $getWithRetry($url);
                    if (!$res) {
                        $cHasMore = false;
                        break;
                    }

                    $data = $res->json();
                    $items = is_array($data['products'] ?? null) ? $data['products'] : [];
                    if (count($items) === 0) {
                        $cHasMore = false;
                        break;
                    }

                    foreach ($items as $shopifyProduct) {
                        if (!is_array($shopifyProduct)) {
                            continue;
                        }

                        $product = $convertShopifyProduct($shopifyProduct, (string) $collection['category']);
                        if (!$product) {
                            continue;
                        }

                        if (!$isDuplicate($product, $products)) {
                            $products[] = $product;
                        }
                    }

                    $cHasMore = count($items) === 250;
                    $cPage++;

                    usleep(1500 * 1000);
                } catch (Throwable $e) {
                    $this->warn('  Error: '.$e->getMessage());
                    $cHasMore = false;
                }
            }

            usleep(2000 * 1000);
            if (count($products) >= 100) {
                $this->info('Reached 100+ products, stopping collection scrape');
                break;
            }
        }
    }

    $this->info('Scrape complete. Products: '.count($products));

    $valid = [];
    $invalidCount = 0;
    foreach ($products as $p) {
        $sku = $p['sku'] ?? null;
        $name = $p['name'] ?? null;
        $price = $p['price'] ?? null;
        if (!$sku || !$name || !is_numeric($price) || (float) $price <= 0) {
            $invalidCount++;
            continue;
        }
        $valid[] = $p;
    }

    if ($invalidCount > 0) {
        $this->warn('Filtered invalid products: '.$invalidCount);
    }

    File::ensureDirectoryExists(dirname($outputPath));
    File::put($outputPath, json_encode($valid, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    $this->info('Saved JSON: '.$outputPath);

    $now = now();
    $categoryMap = [];
    $seenSkus = [];
    $newCount = 0;
    $updatedCount = 0;
    $skippedCount = 0;

    DB::beginTransaction();
    try {
        foreach ($valid as $product) {
            if (!is_array($product)) {
                $skippedCount++;
                continue;
            }

            $sku = $product['sku'] ?? null;
            if (!$sku) {
                $skippedCount++;
                continue;
            }

            $seenSkus[] = $sku;

            $categoryName = $product['category'] ?? null;
            $categoryId = null;
            if ($categoryName) {
                if (array_key_exists($categoryName, $categoryMap)) {
                    $categoryId = $categoryMap[$categoryName];
                } else {
                    $existingCategoryId = DB::table('categories')->where('name', $categoryName)->value('id');
                    if ($existingCategoryId) {
                        $categoryId = $existingCategoryId;
                    } else {
                        $categoryId = DB::table('categories')->insertGetId([
                            'name' => $categoryName,
                            'description' => 'Products in the '.$categoryName.' category',
                            'created_at' => $now,
                            'updated_at' => $now,
                        ]);
                    }

                    $categoryMap[$categoryName] = $categoryId;
                }
            }

            $images = $product['images'] ?? [];
            if (!is_array($images)) {
                $images = [];
            }

            $tags = $product['tags'] ?? null;
            if (is_array($tags)) {
                $tags = json_encode($tags);
            }

            $data = [
                'sku' => $sku,
                'name' => $product['name'] ?? '',
                'description' => $product['description'] ?? null,
                'price' => (float) ($product['price'] ?? 0),
                'category_id' => $categoryId,
                'stock_quantity' => (int) ($product['stock_quantity'] ?? 0),
                'images' => json_encode($images),
                'sizes' => $product['sizes'] ?? null,
                'colors' => $product['colors'] ?? null,
                'status' => 'active',
                'scraped_at' => $now,
                'source_url' => $product['source_url'] ?? null,
                'grade' => $product['grade'] ?? null,
                'shopify_id' => isset($product['shopify_id']) ? (string) $product['shopify_id'] : null,
                'product_type' => $product['product_type'] ?? null,
                'tags' => $tags,
                'vendor' => $product['vendor'] ?? null,
                'compare_at_price' => isset($product['compare_at_price']) ? (float) $product['compare_at_price'] : null,
                'discount_percent' => isset($product['discount_percent']) ? (int) $product['discount_percent'] : null,
                'featured' => !empty($product['featured']) ? 1 : 0,
                'updated_at' => $now,
            ];

            $existingId = DB::table('products')->where('sku', $sku)->value('id');
            if ($existingId) {
                DB::table('products')->where('id', $existingId)->update($data);
                $updatedCount++;
            } else {
                $data['created_at'] = $now;
                DB::table('products')->insert($data);
                $newCount++;
            }
        }

        if ($isFull) {
            $this->info('Full scrape: deactivating products not present in the latest scrape...');

            if (count($seenSkus) === 0) {
                $this->warn('No SKUs found. Skipping deactivation step.');
            } else {
                $affected = DB::table('products')
                    ->where('status', 'active')
                    ->whereNotIn('sku', $seenSkus)
                    ->update([
                        'status' => 'inactive',
                        'updated_at' => $now,
                    ]);

                $this->info('Deactivated: '.$affected);
            }
        }

        DB::commit();
    } catch (Throwable $e) {
        DB::rollBack();
        $this->error('DB upsert failed: '.$e->getMessage());
        return self::FAILURE;
    }

    $this->info('DB upsert complete.');
    $this->line('New: '.$newCount);
    $this->line('Updated: '.$updatedCount);
    $this->line('Skipped: '.$skippedCount);

    File::ensureDirectoryExists(dirname($lastRunFile));
    File::put($lastRunFile, json_encode(['last_run' => now()->toISOString()], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

    return self::SUCCESS;
})->purpose('Scrape TechMarkIt Shopify JSON API and write scraper/data/techmarkit-products.json');
