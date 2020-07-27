<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Note;
use Faker\Generator as Faker;

$factory->define(Note::class, function (Faker $faker) {
    return [
        'title'=>$faker->name,
        'body' => $faker->paragraphs(rand(2,4),true),
        'color' => $faker->hexcolor(),
        'user_id' => App\User::pluck('id')->random()
    ];
});
