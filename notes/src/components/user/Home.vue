<template>
    <div id="home" @click="addToNotes">
        <div>
            <div id="top-bar">
                <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                     <div v-if="show_search" class="search-input">
                        <input v-model="search_text" @keyup.enter="searchNote" type="text" class="form-control" placeholder="Search Notes...">
                        <button  class="btn close-search" @click="toggleSearchBar">
                            <i class="fa fa-times" aria-hidden="true"></i>
                        </button>
                    </div>
                        <div v-if="!show_search" class="d-flex w-100">
                            <div>
                                <a class="navbar-brand" href="#">Scribble</a>
                            </div>
                            <div class="search-bar">
                                <div>
                                    <button @click="toggleSearchBar" class="btn btn-circle btn-secondary">
                                        <i class="fa fa-search" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                           <div class="dropdown show ml-3">
                                <button class="btn btn-circle btn-secondary" @click="()=>{modal_type='newGroup'}" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                </button>

                                <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                    <a class="dropdown-item" type="button" data-toggle="modal" data-target="#newGroupModal">New Group</a>
                                    <a class="dropdown-item" data-toggle="dropdown" @mouseover="show_group_menu=true">Add to group</a>
                                    <div v-if="show_group_menu" class="group-menu dropdown-menu" @mouseleave="show_group_menu=false">
                                        <div @click="addNotesToGroup(group.id)" class="dropdown-item mt-2 p-2" v-for="group in $store.state.notes_groups.notes_groups" :key="group.id">
                                            {{group.title}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="ml-3" @click="()=>{modal_type='del'}">
                                <button class="btn btn-danger btn-circle" data-toggle="modal" data-target="#delModal">
                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                </button>
                            </div>
                            <div class="ml-auto px-1">
                                <div class="dropdown show">
                                    <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {{Object.entries($store.state.auth.user)!==0 && $store.state.auth.user.name.substring(0,6)+".."}}
                                    </a>

                                    <div class="dropdown-menu user-menu" aria-labelledby="dropdownMenuLink">
                                        <a class="dropdown-item logout-option" @click="logout">
                                            <i class="fa fa-sign-out" aria-hidden="true"></i>
                                        <span class="d-xs-none d-sm-none d-md-none d-xl-inline d-lg-inline">Logout</span>    
                                        </a>
                                    </div>
                                    </div>
                                </div>
                        </div>
                </nav>
            </div>
            <div class="main-content container" >
                <div id="new-note" :editNote="false" @click.stop class="mt-2 new-note"> 
                    <note></note>
                </div>
               <router-view></router-view>
            </div>   
        </div>
        <!-- New Group Modal -->
        <modal :modal_type="modal_type" @newGroup="newGroup" @del="deleteNotes"></modal>
      
    </div>
</template>

<script>
import Note from '../notes/Note.vue';
import Modal from '../modal/Modal.vue'
export default {
    name:'Home',
    mounted(){
        this.$store.dispatch({type:'getUser'});
        this.$store.dispatch({type:'getNotesAndGroups'});
    },
    data(){
        return{
            show_group_menu:false,
            show_search:false,
            modal_type:'',
            search_text:''
        }
    },
    components:{
        Note,
        Modal
    },
    methods:{
        addToNotes(e){
            //if user clicks outside of the area of create note that note will be added to the notes array
            if(e.target !== document.getElementById('new-note') &&(document.getElementById('new-note-title').innerText!=='' ||document.getElementById('new-note-body').innerText!=='')) {
                this.$store.commit('addToNotes');
                //reset the note
                document.getElementById('new-note-title').textContent = '';
                document.getElementById('new-note-body').textContent = '';
         }       
        },

        newGroup(){
            let group_title = document.getElementById('group-title').textContent;
            this.$store.dispatch({
                type:'newGroup',
                group_title
            })
        },

        addNotesToGroup(group_id){
          this.$store.dispatch({
              type:'addNotesToGroup',
            group_id
            })
          
        },

        deleteNotes() {
            this.$store.dispatch({type:'deleteNotes'})            
        },

        toggleSearchBar(){
            this.show_search?this.show_search = false:this.show_search = true;
        },

        searchNote(){
            if(this.search_text){
                this.$router.push({name:'searchNotes',query:{text:this.search_text}}).catch(()=>{})
            }
        },

        logout(){
            localStorage.removeItem('user_id');
            localStorage.removeItem('token');
            this.$router.push({name:'reglog'});
        }
    }
}
</script>

<style lang="stylus" scoped>
.user-menu{
    width:-webkit-fill-available;
    min-width:100%;
}
.logout-option{
    padding:0.5rem !important;
}
.editable-note{
    position:absolute;
    left:0;
    top:0;
    background-color: rgba(0,0,0,0.4);
    overflow:hidden;
    height:100vh;
}


.main-content{
    height:100%;
}

#home{
    height:100%;
    overflow-x:hidden;
}

.new-note{
    height: auto;
    border:1px solid lightgrey;
    border-radius:10px;
    width: 79%;
    left: 0;
    top: 0;
    margin: auto;
    min-width:200px;
}

.search-input{
    width:95%;
}

.btn-circle { 
    width: 40px; 
    height: 40px; 
    padding: 7px 10px; 
    border-radius: 25px; 
    font-size: 15px; 
    text-align: center; 
} 

.close-search{
    display:inline;
    position:absolute;
}

.form-control{
    display:inline !important;
}

.group-menu{
    background: white;
    position: absolute;
    top: 55%;
    left: 100%;
    width:200px;
    border-radius: 0.25em;
    border: 1px solid rgba(0, 0, 0, 0.15);
}

@media only screen and (max-width:600px){
    .group-menu{
    background: #fff;
    position: absolute;
    top: 100%;
    left:0%;
    width: 200px;
    border-radius: 0rem 0.25rem 0.25rem 0.25rem;
    border: 1px solid rgba(0,0,0,0.15);
    }
}
.group-menu > div{
    cursor:pointer;
}

.group-menu > div:hover{
    background-color:lightgrey;
    color:white;
}
</style>