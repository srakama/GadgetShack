<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Redirecting…</title>
</head>
<body>
    <form id="payment-redirect" action="{{ $action }}" method="post">
        @foreach ($fields as $name => $value)
            <input type="hidden" name="{{ $name }}" value="{{ $value }}">
        @endforeach
        <noscript>
            <button type="submit">Continue</button>
        </noscript>
    </form>
    <script>
        document.getElementById('payment-redirect').submit();
    </script>
</body>
</html>
