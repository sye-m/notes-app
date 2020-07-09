<?php

namespace App\Http\Controllers;
use Laravel\Passport\HasApiTokens;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Registered;
use App\User;
use Illuminate\Support\Facades\Validator;

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
            'user_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ));
    }
  
    public function register(Request $request)
    {
        $user = new User;
        $validator = $this->validator($request);
        if($validator->fails()){
            return response()->json(['user'=>$request->all(),'errors'=>$validator->errors()]);
        }
        User::create($request->all());
        return $this->registered($request, $user)
                      ?response()->json(['success_message'=>'You are successfully registered'],202): response()->json(['error_message'=>'User is already registered','errors'=>$errors],409);
    }

   
    public function login(Request $request)
    {
        $user = new User;
        if ($this->registered($request,$user)){
            $user = $user->where('email',$request->email)->get();
            $token =  $user->createToken('Personal Access Token')->accessToken;
            $cookie = $this->getCookieDetails($token);
            return response()
                ->json([
                    'logged_in_user' => $user,
                    'token' => $token,
                ], 200)
                ->cookie($cookie['name'], $cookie['value'], $cookie['minutes'], $cookie['path'], $cookie['domain'], $cookie['secure'], $cookie['httponly'], $cookie['samesite']);
        } else {
            return response()->json(
                ['error' => 'invalid-credentials'], 422);
        }
    }
    private function getCookieDetails($token)
    {
        return [
            'name' => '_token',
            'value' => $token,
            'minutes' => 1440,
            'path' => null,
            'domain' => null,
            // 'secure' => true, // for production
            'secure' => null, // for localhost
            'httponly' => true,
            'samesite' => true,
        ];
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        $cookie = Cookie::forget('_token');
        return response()->json([
            'success_message' => 'You have successfully logged out'
        ])->withCookie($cookie);
    }

    
    public function registered(Request $request,User $user){
        if($user->where('email',$request->email)->get())
        {
            return true;
        }
        return false;
    }
}

