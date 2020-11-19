<template>
<div class="container landing-page">
<div class="form-container align-items-center row p-3">
  <div class="d-none d-sm-none d-md-block col-md-7 col-lg-7 site-image"></div>
  <div class="col-sm-11 col-md-5 col-lg-5" id="forms">
   <router-view></router-view>
  </div>
</div>
</div>
</template>

<script>


export default {
  name: 'Auth',
   beforeRouteEnter (to, from, next) {
        next(vm => {
            if(vm.$token){
                vm.$router.push('/notes')
            }
        })
    },
 }

</script>

<style lang="stylus">
.site-image{
    height:100%;
    width:100%;
    background-size: contain;
    background-image: url('../../assets/scribbleBG.jpg');
    background-repeat: no-repeat;
    background-position: center;
}
.form-container{
  border: 1px solid lightgray;
  border-radius: 10px;
  height:100%;
  margin:0px !important;
  display:flex;
  justify-content:center;
}

.landing-page{
  height:100%;
  padding:1em 1em;
}
</style>
