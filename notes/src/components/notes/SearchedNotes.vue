<template>
     <div>    
       <h4 id="group-title" class="my-2">Results for "{{this.$route.query.text}}"</h4> 
       <hr>
       <display-notes :notes="$store.state.searched_notes"></display-notes>
    </div>
</template>

<script>
import DisplayNotes from './DisplayNotes';
export default {
    name:'SearchedNotes',
    components:{
        DisplayNotes
    },
    created(){
        this.$store.commit('searchNotes',this.$route.query.text)
    },
        beforeRouteUpdate(to,from,next){
        this.$store.commit('searchNotes',this.$route.query.text)
        next();
        }
}
</script>
<style lang="stylus" scoped>

</style>