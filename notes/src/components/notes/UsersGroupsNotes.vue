<template>
   <div>    
       <p id="group-title" class="my-2">{{group_title}}</p> 
       <display-notes :notes="$store.state.notes.notes_to_display"></display-notes>
    </div> 
</template>

<script>
import DisplayNotes from './DisplayNotes.vue';
export default {
    name:'UsersGroupsNotes',
    data(){
        return{
            group_title:'',
        }
    },
   components:{
        DisplayNotes
    },
    beforeCreate(){
        let group_id = this.$route.query.group_id;
       this.$store.commit('setGroupNotes',group_id)
    },
    created(){
        this.group_title = this.$route.params.group_title;
    }
}
</script>

<style lang="stylus" scoped>
#group-title{
    width: 79%;
    left: 0;
    top: 0;
    margin: auto;
    font-size: 1.5em;
    font-weight: 500;
    border-bottom:1px solid lightgrey;
}
.note{
   display: -webkit-box;
    height: 200px;
    width: calc(25%);
    margin: 5px;
    border: 1px solid #d3d3d3;
    border-radius: 10px;
    color:white;
    min-width:200px;
}
</style>