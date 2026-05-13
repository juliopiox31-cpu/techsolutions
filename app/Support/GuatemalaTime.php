<?php

namespace App\Support;

use Carbon\Carbon;
use Carbon\CarbonInterface;

final class GuatemalaTime
{
    public const TZ = 'America/Guatemala';

    public static function formatDateTime(?CarbonInterface $value): ?string
    {
        if ($value === null) {
            return null;
        }

        return Carbon::parse($value)->timezone(self::TZ)->format('d/m/Y H:i');
    }

    public static function formatDateMonthYear(?CarbonInterface $value): ?string
    {
        if ($value === null) {
            return null;
        }

        return Carbon::parse($value)->timezone(self::TZ)->format('d M Y');
    }

    public static function formatDateShort(?CarbonInterface $value): ?string
    {
        if ($value === null) {
            return null;
        }

        return Carbon::parse($value)->timezone(self::TZ)->format('d/m/Y');
    }

    public static function monthInZone(?CarbonInterface $value): ?int
    {
        if ($value === null) {
            return null;
        }

        return Carbon::parse($value)->timezone(self::TZ)->month;
    }
}
