<?php

namespace App\Http\Controllers;
use Laravel\Passport\HasApiTokens;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Registered;
use App\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use \GuzzleHttp\Client;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    use HasApiTokens;
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    public function validator(Request $request)
    {
        return Validator::make($request->all(), array(
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ));
    }
  
    public function register(Request $request)
    {
        if(!$request->all()){
            response()->json(['error_message'=>'User is already registered','errors'=>$errors],409);   
        }

        $validator = $this->validator($request);
        if($validator->fails()){
            return response()->json(['user'=>$request->all(),'errors'=>$validator->errors()]);
        }

        $user = new User;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $user->save();

        return $this->registered($request, $user)
                      ?response()->json(['success_message'=>'You are successfully registered'],202): response()->json(['error_message'=>'User is already registered','errors'=>$errors],409);
    }

   
    public function login(Request $request)
    {
        $http = new Client;
        $credentials = $request->only('email','password');
        if(Auth::attempt($credentials)){
            $user_id = User::select('id')->where('email',$request->email)->get();
        }
        else{
            return response()->json(['error'=>'Incorrect Email or Password']);
        }
        $response = $http->post('http://localhost:8001/oauth/token', [
            'form_params' => [
                'grant_type' => 'password',
                'client_id' => '2',
                'client_secret' => 'QE4W6RnYIklsqTywbov97sgcd1RcO5ZUyDUzATKC',
                'username' => $request->email,
                'password' => $request->password,
                'scope' => '',
            ],
        ]);
        
        return response(['auth'=>json_decode((string) $response->getBody(), true),'user_id'=>$user_id],200);
        
            }
    
   
    public function logout(Request $request)
    {
      
    }

    
    public function registered(Request $request,User $user){
        if($user->where('email',$request->email)->get())
        {
            return true;
        }
        return false;
    }
}

