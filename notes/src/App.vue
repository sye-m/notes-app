<template>
  <router-view></router-view>
</template>

<script>
export default {
  name:'App',
  created(){
    this.$store.dispatch({type:'getUser'});
  },
  beforeRouteEnter (to, from, next) {
        next(vm => {
            if(vm.$token) {
              next({path:'/user'})
            }
            else {
              next({path:'/auth'})
            }
        })
    },
}
</script>

<style lang="stylus">
[contenteditable]{
  outline: 0px solid transparent;
}
</style>