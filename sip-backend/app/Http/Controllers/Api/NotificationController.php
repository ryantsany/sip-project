<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\ResponseFormatter;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function getUserNotifications(Request $request){
        $notifications = $request->user()->notifications()->orderBy('created_at', 'desc')->get()->map(function($notification){
            return $notification->api_response;
        });

        return ResponseFormatter::success($notifications);
    }
}
