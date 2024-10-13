<?php

use Faker\Generator as Faker;
use Illuminate\Support\Str;

$factory->define(App\Models\Task::class, function (Faker $faker) {
    return [
        'title' => $faker->sentence(3), // 3 kelimelik rastgele başlık
        'description' => $faker->text(100), // 100 karakterlik rastgele açıklama
        'status' => $faker->randomElement(['pending', 'in_progress', 'completed']), // Rastgele durum
        'start_time' => $faker->dateTimeBetween('now', '+1 week'), // Şu andan 1 hafta sonrasına kadar rastgele bir tarih
    ];
});
