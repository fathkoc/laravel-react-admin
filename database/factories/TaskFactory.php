<?php

use Faker\Generator as Faker;
use Illuminate\Support\Str;

$factory->define(App\Models\Task::class, function (Faker $faker) {
    return [
        'title' => $faker->sentence(3), 
        'description' => $faker->text(100), 
        'status' => $faker->randomElement(['pending', 'in_progress', 'completed']),
        'start_time' => $faker->dateTimeBetween('now', '+1 week'), 
    ];
});
