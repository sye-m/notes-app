<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
use App\Note;
class NotesGroup extends Model
{
    protected $fillable = ['title'];
    
    public function user(){
        return $this->belongsTo(User::class);
    }

    public function notes(){
        return $this->hasMany(Note::class);
    }
}
