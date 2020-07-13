<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\NotesGroup;
use App\User;
use App\Note;
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
        $user = new User;
        $user = User::find($request->user_id);
        $user->notesGroup()->create(['title'=>$request->title]);
        return response()->json(['title'=>'done']);
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
        return response()->json(['done'=>'done']);
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
