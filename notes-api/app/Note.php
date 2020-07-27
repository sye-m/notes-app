<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = ['title','body','color','notes_group_id'];

    public function user(){
       return $this->belongsTo('App\User');
    }

    public function notesGroups(){
        return $this->belongsTo('App\NotesGroup');
    }
}
