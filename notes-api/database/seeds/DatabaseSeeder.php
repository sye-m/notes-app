<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Note;
use App\NotesGroup;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UserSeeder::class);
        factory(User::class,5)->create()->each(function($u){
            $u->notesGroups()->saveMany(
                factory(NotesGroup::class,rand(1,6))->make())->each(function($g){
                $g->notes()->saveMany(factory(Note::class,rand(1,7))->make());
            });
        });
    }
}
