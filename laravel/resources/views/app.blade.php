<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <meta name="description" content="Shop refurbished tech and gadgets at great prices. Browse smartphones, laptops, tablets and accessories.">
        <meta name="robots" content="index,follow">

        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ config('app.name', 'GadgetVilla') }}">
        <meta property="og:title" content="{{ config('app.name', 'GadgetVilla') }}">
        <meta property="og:description" content="Shop refurbished tech and gadgets at great prices. Browse smartphones, laptops, tablets and accessories.">
        <meta property="og:image" content="/favicon.svg">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ config('app.name', 'GadgetVilla') }}">
        <meta name="twitter:description" content="Shop refurbished tech and gadgets at great prices. Browse smartphones, laptops, tablets and accessories.">
        <meta name="twitter:image" content="/favicon.svg">

        <title inertia>{{ config('app.name', 'GadgetVilla') }}</title>

        <!-- Favicon -->
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
