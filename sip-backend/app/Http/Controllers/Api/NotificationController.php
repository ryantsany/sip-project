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

    public function markAsRead(Request $request, $notificationId){
        $notification = $request->user()->notifications()->where('id', $notificationId)->first();

        if(!$notification){
            return ResponseFormatter::error(404, null, 'Notifikasi tidak ditemukan.');
        }

        $notification->markAsRead();

        return ResponseFormatter::success(null, 'Notifikasi berhasil ditandai sebagai dibaca.');
    }

    public function getThreeLatestNotifications(Request $request){
        $notifications = $request->user()->notifications()->orderBy('created_at', 'desc')->take(3)->get()->map(function($notification){
            return $notification->api_response;
        });

        return ResponseFormatter::success($notifications);
    }

    public function getNotificationDetails(Request $request, $notificationId){
        $notification = $request->user()->notifications()->where('id', $notificationId)->first();

        if(!$notification){
            return ResponseFormatter::error(404, null, 'Notifikasi tidak ditemukan.');
        }

        return ResponseFormatter::success($notification->api_response);
    }   
}
