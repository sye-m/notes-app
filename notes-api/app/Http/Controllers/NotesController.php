<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Note;
use App\NotesGroup;
class NotesController extends Controller
{
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($user_id)
    {
        $user = new User(); 
        $user = User::find($user_id);
        $notes= $user->notes()->where('notes_group_id',null)->get();
        $notes_group = $user->notesGroup()->get();
        return response()->json(['notes'=>$notes,'notes_groups'=>$notes_group]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user_id = $request->userId;
        $user = User::find($user_id);    
        $note= $user->notes()->create([
            'title'=>  $request->title,
            'body' => $request->body,
            'color'=> '#007bff'
        ]);
        return response()->json(['note'=>$note]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $note = Note::find($id);
        $note = $note->update([
            'title'=>$request->title,
            'body'=>$request->body,
            'color'=>$request->color
        ]);
        return response()->json(['note'=>$note]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request,$notes_ids)
    {
        $ids = explode(',',$notes_ids);
        Note::destroy($ids);
        return response()->json(['data'=>'success']);
    }
}
