<template>
<div id="register">
    <div class="form-title">Create Account</div>
    <hr>
    <form @submit.prevent="registerUser">
        <div class="form-group mb-3">
            <span class="required-input" v-if="submitted && !$v.user.name.required"></span>
            <input placeholder="Full Name" v-bind:class="{'form-control':true,'input-required':submitted && !$v.user.name.required}" type="text" name="name" v-model.trim="$v.user.name.$model">
            <div class="alert alert-danger" v-if="submitted && !$v.user.name.minLength && $v.user.name.required">Name should at least be 3 characters</div>
        </div>

        <div class="form-group mb-3">
            <input placeholder="Email-Id" v-bind:class="{'form-control':true,'input-required':submitted && !$v.user.name.required}" type="email" name="email" v-model.trim="$v.user.email.$model">
            <div class="alert alert-danger" v-if="submitted && !$v.user.email.email">Email is invalid</div>
            <div class="alert alert-danger" v-if="errors.email">Email already exists</div>

        </div>
        
        <div class="form-group mb-3">
            <input placeholder="Password" v-bind:class="{'form-control':true,'input-required':submitted && !$v.user.name.required}" class="form-control" type="password" name="password" v-model.trim="$v.user.password.$model" aria-describedby="passwordHelpBlock">
            <small id="passwordHelpBlock" class="form-text text-muted">
            Must be more than 8 characters long
            </small>
            <div class="alert alert-danger" v-if="submitted && !$v.user.password.minLength">Password should at least be 8 characters</div>
        </div>

        <div class="form-group mb-3">
            <input placeholder="Confirm Password" v-bind:class="{'form-control':true,'input-required':submitted && !$v.user.name.required}"  type="password" name="re_password" v-model="$v.user.re_password.$model">
            <div class="alert alert-danger" v-if="!passwordMatches && $v.user.password.minLength">Password does not match</div>
        </div>
    
       <div>
           <button type="submit" class="btn btn-primary form-control" value="Register">Register</button>
       </div>
    </form>
    <div v-if="success_message" class="alert alert-success mt-2">
        You have successfully registered 
    </div>

    <div class="mt-3 seperator">
    <span class="form-seperator"></span>
    <span>or</span>
    <span class="form-seperator"></span>
    </div>

    <div class="user-type my-3">
        <span>Already a user? </span>
        <router-link to="/login">Sign In</router-link>
    </div>
</div>
</template>
<script>
    import { required, email, minLength,maxLength } from "vuelidate/lib/validators";
    import axios from 'axios';
    export default {
        name:'Register',
        data(){
        return {
        user:{
            name:"",
            email:"",
            password:"",
            re_password:""
        },
        errors:{
            email:''
        },
        submitted:false,
        passwordMatches:true,
        success_message:''
        }
        },

        validations: {
                user: {
                    name: { required,minLength:minLength(3),maxLength:maxLength(255) },
                    email: { required, email,maxLength:maxLength(255) },
                    password: { required, minLength: minLength(8),maxLength:maxLength(255) },
                    re_password: { required }
                }
            },
    
        methods:{
            checkPasswordMatch(){
                if(this.user.password != this.user.re_password){
                    this.passwordMatches = false;
                }
            },
            registerUser(){
                this.checkPasswordMatch();
                this.submitted = true;
                 if (this.$v.$invalid) {
                    return;
                }
                axios.post('register',{
                    'name':this.user.name,
                    'email':this.user.email,
                    'password':this.user.password,
                }).catch(error=>{
                    console.log(error);
                }).then((res)=>{
                    console.log(res);
                    if(res.data.errors){
                        this.errors.email = res.data.errors.email
                    }
                    if(res.data.success_message){
                        this.success_message = res.data.success_message
                    }
                });
                },
            changeFormType(){
                this.$store.state.form_type = "login";
            }
        }
    }
</script>

<style lang="stylus">
    .form-title{
        color: #0080FF;
        text-align: center;
        font-family: Cooper Black;
        font-size: 1.5em;
        border-bottom:1px solid #dadce0;
    }
    .required-input::after{
        content:" *";
        color:red;
    }
    .input-required{
        border:1px solid red !important;
    }

    .seperator{
        display:flex;
    }

    .seperator > span{
        margin:0px 2px;
    }

    .form-seperator{
        width: 46.5%;
        border: 1px solid #dadce0;
        display: inline-block;
        height:1px;
    }
    .user-type{
        text-align:center;
    }
</style>