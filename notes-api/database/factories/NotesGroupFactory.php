<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\NotesGroup;
use Faker\Generator as Faker;

$factory->define(NotesGroup::class, function (Faker $faker) {
    return [
        'title'=>$faker->name,
        'user_id' => App\User::pluck('id')->random(),
    ];
});
