<template>
    <div class="row d-flex flex-wrap justify-content-center notes-group-container">
        <div class="notes-group d-flex m-3 p-2" v-for="group in notes_groups" :id="'group'+group.id" :key="group.id">
                <router-link :to="{ name: 'group', params: {group_title:group.title}, query:{group_id:group.id}}">
                    <i class="fa fa-folder folder" aria-hidden="true"></i>
                    <p class="group-title">
                    {{group.title}}
                    </p>
                </router-link>
                <div class="select-group">
                    <button @click="selectGroup(group.id)" class="btn btn-dark btn-circle"> 
                    <i class="fa fa-check" aria-hidden="true"></i>
                    </button>
                </div>
        </div>
      
    </div>
</template>

<script>
export default {
 name:'DisplayNotesGroups',
 props:['notes_groups'],
 methods:{
     selectGroup(group_id){
        var selectedGroup =document.getElementById('group'+group_id);
        if(selectedGroup.classList.contains("selected")){
            selectedGroup.classList.remove("selected")
        } 
        else {
            selectedGroup.classList.add("selected");
        }
        this.$store.commit('selectGroup',group_id);
    }
 }
}

</script>

<style lang="stylus" scoped>
.folder{
    font-size:5em
    outline:none;
}

.notes-group-container{
    width: 80%;
    left: 0;
    top: 0;
    margin: auto
}
.notes-group{
    width:min-content;
    border:1px solid transparent;
}

.group-title{
    word-break:break-all;
}

.btn-circle { 
    width: 40px; 
    height: 40px; 
    padding: 7px 10px; 
    border-radius: 25px; 
    font-size: 15px; 
    text-align: center; 
} 

.selected {
    border:1px solid lightgray !important;
    border-radius:10px;
}
</style>

