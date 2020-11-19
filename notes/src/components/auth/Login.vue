<template>
    <div>
        <div id="greeting">
            <span>Welcome Back :)</span><br>
            Login to check all your notes  
        </div>
        <hr>
        <div class="form-title">Login</div>
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
         <div class="mt-3 seperator">
            <span class="form-seperator"></span>
            <span>or</span>
            <span class="form-seperator"></span>
        </div>

        <div class="user-type my-3">
            <span>New to scribble?</span>
            <router-link to="/register"> Join Now</router-link>
        </div>
    </div>

</template>
<script>
    import { required, email } from "vuelidate/lib/validators";
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
            loginUser(){
                this.submitted = true;
                    if (this.$v.$invalid) {
                    return;
                }
                this.$store.dispatch('loginUser',this.user).then(() => {
                    this.$router.push('/notes')
                }).catch(error => {
                    console.log(error)
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
    border-bottom:1px solid #dadce0;
}
.user-type{
    text-align:center;
}

.seperator{
    display:flex;
}

.seperator > span{
        margin:0px 2px;
    }

.form-seperator{
    width: 47%;
    border: 1px solid lightgrey;
    display: inline-block;
    height:1px;
    align-self:center;
}


#greeting > span{
    font-size 1.5em;
    font-weight:bold;
}
</style>