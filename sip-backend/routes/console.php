<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Console\Commands\NotifyDueBorrowings;
use App\Console\Commands\NotifyLateBorrowings;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command(NotifyDueBorrowings::class)->daily();
Schedule::command(NotifyLateBorrowings::class)->daily();