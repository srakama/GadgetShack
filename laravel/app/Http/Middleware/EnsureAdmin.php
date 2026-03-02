<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            if ($request->expectsJson() || $request->inertia()) {
                return response()->json(['message' => 'Forbidden.'], 403);
            }

            return redirect('/')->with('error', 'You do not have permission to access the admin area.');
        }

        return $next($request);
    }
}

