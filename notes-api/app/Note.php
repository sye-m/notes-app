<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
use App\NotesGroup;

class Note extends Model
{
    protected $fillable = ['title','body','color'];

    public function user(){
       return $this->belongsTo(User::class);
    }

    public function notesGroup(){
        return $this->belongsTo(NotesGroup::class);
    }
}
