<template>
    <div>
        <div id="greeting">
            <span>Welcome Back :)</span><br>
            To Check all your notes Login now
        </div>
        <hr>
        <div class="form-title">Login</div>
        <hr>
        <form @submit.prevent="loginUser">
        
        <div class="form-group mb-3">
            <input placeholder="Email-Id" v-bind:class="{'form-control':true,'input-required':submitted && !$v.user.email.required}" type="email" name="email" v-model.trim="$v.user.email.$model">
            <div class="alert alert-danger" v-if="submitted && !$v.user.email.email">Email is invalid</div>
        </div>

        <div class="form-group mb-3">
            <input placeholder="Password" v-bind:class="{'form-control':true,'input-required':submitted && !$v.user.password.required}" class="form-control" type="password" name="password" v-model.trim="$v.user.password.$model" aria-describedby="passwordHelpBlock">
        </div>

        <div>
           <button type="submit" class="btn btn-primary form-control" value="Register">Log In</button>
       </div>
        </form>
        <div class="alert alert-danger mt-2" v-if="error">
            {{error}}
        </div>
         <div class="mt-3">
            <span class="form-seperator"></span>
            <span>or</span>
            <span class="form-seperator"></span>
        </div>

        <div class="user-type my-3">
            <span>New to scribble?</span>
            <a href="" @click.prevent="changeFormType">Join In</a>
        </div>
    </div>

</template>
<script>
    import { required, email } from "vuelidate/lib/validators";
    import axios from 'axios';
export default {
    name:'Login',
    data(){
        return{
            submitted:false,
            user:{
                email:'',
                password:''       
            },
            error:''
        }
    },
    validations: {
                user: {
                    email: { required, email },
                    password: { required },
                }
            },
    methods:{
        changeFormType(){
            this.$store.state.form_type = "register";
        },
        loginUser(){
            
                this.submitted = true;
                 if (this.$v.$invalid) {
                    return;
                }
                axios.post('login',{
                    'email':this.user.email,
                    'password':this.user.password,
                }).catch(error=>{
                    console.log(error);
                }).then(res=>{
                    if(res.data.error){
                        this.error = res.data.error;
                    }
                    console.log(res);
                    if(res.data.auth){
                    let accessToken = res.data.auth.access_token;
                    localStorage.setItem('token',accessToken);
                    }

                });
                },
    }
}
</script>

<style lang="stylus">
.form-title{
    color: #0080FF;
    text-align: center;
    font-family: Cooper Black;
    font-size: 2em;
}
.user-type{
    text-align:center;
}
.form-seperator{
    width: 47%;
    border: 1px solid lightgrey;
    display: inline-block;
}
#greeting > span{
    font-size 2.2em;
    font-weight:bold;
}
</style>