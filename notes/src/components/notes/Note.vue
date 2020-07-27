<template>
<!-- Set the background color only if note is provided-->
<div :style="note&& bgColor" class="rounded w-100">
    <!-- if note is present set the note's id of the note id object-->
    <div :id="note?'note'+note.id:'note'" class="d-flex flex-row h-100">  
    <!-- if note is editable i.e note is just displayed but not in the edit mode modal add data toggle and data-target -->
       <div class="p-3 note-content" @keyup="newNote" :data-toggle="!editable ?'modal':''" :data-target="!editable ? '#editNoteModal':''" @click="editNote">
           <!-- when enter is pressed go to the body of the note rather than adding a new line in the title of the note -->
            <div id="new-note-title" @keydown.enter.prevent= "$event.target.nextElementSibling.focus()" role="textbox" aria-label="Title" :contenteditable="editable"  data-placeholder="Title">{{note && note.title}}</div>
            <div id="new-note-body" aria-multiline="true" role="textbox" aria-label="Write Something here..." :contenteditable="editable" class="mt-2" data-placeholder="Write Something here...">{{getNoteBody}}</div>
        </div>
        <!-- if note is present i.e. this is not a new note and the note is not in edit mode show actions for these notes -->
        <div class="d-flex flex-column note-actions" v-if="note && !editable">
            <div class="select-note flex-grow-1">
                    <button @click.stop="selectNote(note.id)" class="btn rounded-circle btn-light btn-circle"> 
                    <i class="fa fa-check" aria-hidden="true"></i>
                    </button>
            </div>
            <div class="set-color-button">
                <button type="button" name="setNoteColor" @click="showColors=!showColors" class="show-colors-button rounded-circle">
                </button>
            </div>
        </div>
         
    </div>
    <div class="d-flex flex-wrap note-colors-container" v-if="(note && showColors)">
        <button type="button" v-for="(color,key) in notes_colors" @click="noteColorChange(color)" class="rounded-circle note-colors m-1" :style="{backgroundColor:color}" :key="key">
        </button>
    </div>
</div>
</template>

<script>
export default {
    name:'Note',
    props:{
        note:{
            type:Object,
        },
        editable:{
             default: function () {
                return true
        },
        },
        display_note:{
            type:Boolean,
            default:function(){
                return false;
            }
        }
    },
    data(){
        return {
            title:this.note ? this.note.title:'',
            body:this.note ? this.note.body:'',
            note_color:this.note?this.note.color:'#FF0000',
            notes_colors:['#FF0000','#FF6600','#FFCC00','#00FF00','#462066','#41AAC4'],
            timeoutId:'',
            showColors:false
        }
    },
     computed:{
         //return background color for note
           bgColor:function(){
            return "background-color: "+this.note_color;
        },
        getNoteBody:function(){
            // if note is in edit mode display the entire body if it is in display mode display part of the body
            if(this.note&& this.note.body!=null) {
             return (this.editable?this.note.body:this.note.body.substring(0,50)+"...")
            }
            return ''
        }
    },
    methods:{
        noteColorChange(color){
            //change the note color
            this.note_color=color;
             let note_body = {
                    title:this.note.title,
                    body:this.note.body,
                    color:this.note_color
                }
            //set current note for updating
            this.$store.commit('setNote',this.note);
            //update the note color
            this.$store.dispatch({type:'updateNoteColor',note_body})
        },
        editNote(){
            if(!this.$store.state.note.editNote){
                this.$store.commit('editNote',this.note);
            }
        },

        getContent(e){
            if(e.target.id==='new-note-title'){
                this.title = e.target.innerText;
            }
            else if(e.target.id==='new-note-body'){
                this.body = e.target.innerText
            }

        },  
        selectNote(note_id){
            var selectedNote =document.getElementById('note'+note_id);
            if(selectedNote.classList.contains("selected")){
                selectedNote.classList.remove("selected")
            } 
            else {
                selectedNote.classList.add("selected");
            }
        this.$store.commit('selectNote',note_id);
        },
        newNote(e){
            this.getContent (e);
            //check to see if note is empty and don't save the note if just the enter key is pressed
            if(e.key!=='Enter' && (this.title !== '' || this.body!== '')){
                console.log("in new note")

                let note_body = {
                    title:this.title,
                    body:this.body,
                    color:this.note_color
                }
                console.log(note_body)
                //check to see if timeout to check whether user has stopped typing exists
                if(this.timeoutId) clearTimeout(this.timeoutId);
                //create a timeout to check if user has stopped typing
                this.timeoutId = setTimeout(()=>{
                //check if the note is already created or not
                if(Object.entries(this.$store.state.note.note).length === 0){
                    console.log(note_body)
                    this.$store.dispatch({type:'createNote',note_body})
                }else{
                    this.$store.dispatch({type:'updateNote',note_body})
                }
                },1000);//wait 0.75 second before sending the request to the server to update or create note
            }
        },
    }
}
</script>

<style lang="stylus" scoped>


#new-note-title{
    width:100%;
    white-space:pre-line;
    font-size:1.3em;
}
#new-note-body{
    width:100%;
    white-space:pre-line;
}



#new-note-title:empty:before,#new-note-body:empty:before {
  content:attr(data-placeholder);
  color:gray;
}

#note{
    word-break: break-word;
    overflow:hidden;
    width:100%;
}
.note-colors-container{
    position: relative;
    width: 136px;
    height: 100px;
    left: 66.6%;
    bottom: 71%;
    border-width: 2px;
    border-style: outset;
    border-color: -internal-light-dark(rgb(118, 118, 118), rgb(195, 195, 195));
    background-color: white;
    border-radius: 10px;
    z-index:4000;
}

.note-colors{
    width:27%;
    height:34%;
    border-width: 1.5px;
    border-style: outset;
    border-color: -internal-light-dark(rgb(118, 118, 118), rgb(195, 195, 195));
    outline:none;
}
.note-content{
    width:95%;
}
.set-color-button{
    color:blue;
}

.note-colors-container::after{
    content: " ";
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: black transparent transparent transparent;
}

.show-colors-button{
    width:2rem;
    height:2rem;
    outline:none;
}
</style>