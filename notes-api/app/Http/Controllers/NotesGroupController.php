<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\NotesGroup;
use App\User;
use App\Note;
use App\Exceptions;
class NotesGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request,$group_id)
    {
        $notesGroup = new NotesGroup;
        $notesGroup = NotesGroup::find($group_id);
        $notes = $notesGroup->notes()->get();
        return response()->json(['notes'=>$notes]);
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
        $user = auth()->user();
        $user = User::find($user->id);
        if(!$user){
            return response()->json(['error'=>'Invalid User'],404);
        }
        $notes_group = $user->notesGroups()->create(['title'=>$request->title]);
        return response()->json(['notes_group'=>$notes_group],200);
        }
        catch(Exception $e){
            return response()->json(['error'=>$e->getMessage()],500);
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
        $ids = explode(',',$request->notes_ids);
        Note::whereIn('id',$ids)->update(['notes_group_id'=>$id]);
        return response()->json(['done'=>auth()->user()]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
