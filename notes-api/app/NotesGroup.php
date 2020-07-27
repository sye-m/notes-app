<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
class NotesGroup extends Model
{
    protected $fillable = ['title'];
    
    public function user(){
        return $this->belongsTo('App\User');
    }

    public function notes(){
        return $this->hasMany('App\Note');
    }
}
