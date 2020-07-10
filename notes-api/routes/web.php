<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::post('api/register','UserController@register');
Route::post('api/login','UserController@login');

Route::group(['middleware' => 'auth:api'], function() {
    Route::get('logout', 'UserController@logout');
    Route::get('/api/getnotes/{user_id}','NotesController@index');
    Route::get('api/getdata',function(){
        return response()->json(['data'=>'sample']);
    });
});
Route::resource('notes','NotesController');
Route::resource('notesgroup','NotesGroupController');
