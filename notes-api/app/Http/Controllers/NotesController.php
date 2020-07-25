<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Note;
use App\NotesGroup;
use App\Exception;
class NotesController extends Controller
{
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = auth()->user();
        $notes= $user->notes()->where('notes_group_id',null)->get();
        $notes_group = $user->notesGroups()->get();
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
        try{
        $user_id = $request->userId;
        
        $user = User::find($user_id);   
        if(!$user){
            return response()->json(['error'=>'Invalid User'],404);
        } 
        $note= $user->notes()->create([
            'title'=>  $request->title,
            'body' => $request->body,
            'color'=> '#007bff'
        ]);
        if(!$note){
            return response()->json(['error'=>'Note not created'],422);
        }
        return response()->json(['note'=>$note],200);
        }
        catch(Exception $e){
            return response()->json(['error'=>'Server Error'],500);
        }
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
        try{
        $note = Note::find($id);
        if(!$note){
            return response()->json(['error'=>'Note not found'],404);
        }
        $note->update([
            'title'=>$request->title,
            'body'=>$request->body,
            'color'=>$request->color
        ]);
        if(!$note){
            return response()->json(['error'=>'Note not updated'],422);
        }
        return response()->json(['note'=>$note]);
    }
        catch(Exception $e){
            return response()->json(['error'=>'Server Error'],500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        try{
        $note_ids = $request->note_ids;
        $group_ids = $request->group_ids;
        if($note_ids!=[]){
            auth()->user()->notes()->whereIn('id',$note_ids)->delete();
        }
        if($group_ids!=[]){
            auth()->user()->notesGroups()->whereIn('id',$group_ids)->delete();
        }
        return response()->json(['data'=>'Notes deleted'],200);
    }
    catch(Exception $e){
        return response()->json(['error'=>'Server Error'],500);
    }
    }
}
