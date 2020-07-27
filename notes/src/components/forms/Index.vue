<template>
<div class="container landing-page">
<div class="form-container align-items-center row p-3">
  <div class="col-sm-1 col-md-7 col-lg-7"></div>
  <div class="col-sm-11 col-md-5 col-lg-5" id="forms">
    <div v-if="this.$store.state.form_type == 'login'">
      <login></login>
    </div> 
    <div v-if="this.$store.state.form_type == 'register'">
      <register></register>
    </div>
  </div>
</div>
</div>
</template>

<script>
  import Login from './Login.vue';
  import Register from './Register.vue';

export default {
  name: 'Index',
  components:{
    Login,
    Register
  },
  mounted(){
    console.log(this.$token);  
  }
 }

</script>

<style lang="stylus">

.form-container{
  border: 1px solid lightgray;
  border-radius: 10px;
  height:100%;
  margin:0px !important;
}

.landing-page{
  height:100%;
  padding:1em 1em;
}
</style>
