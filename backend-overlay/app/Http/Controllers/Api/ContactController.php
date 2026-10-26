<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // Honeypot: real visitors never see this field. Bots fill it, so we
        // answer as if it worked and store nothing.
        if ($request->filled('website')) {
            return response()->json(['message' => 'Thank you. Your message was sent.'], 201);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150'],
            'message' => ['required', 'string', 'min:10', 'max:3000'],
        ]);

        ContactMessage::create($data + ['ip' => $request->ip()]);

        // Optional email alert. Set PORTFOLIO_CONTACT_TO in .env to enable it.
        // A mail failure must never lose the message, which is already saved.
        if ($to = config('portfolio.contact_to')) {
            try {
                Mail::raw(
                    "From: {$data['name']} <{$data['email']}>\n\n{$data['message']}",
                    function ($mail) use ($to, $data) {
                        $mail->to($to)
                            ->replyTo($data['email'], $data['name'])
                            ->subject('New portfolio message from '.$data['name']);
                    }
                );
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return response()->json(['message' => 'Thank you. Your message was sent.'], 201);
    }
}
