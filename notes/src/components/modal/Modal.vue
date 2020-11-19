<template>
    <div class="modal fade" :id="modal_type+'Modal'" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">{{modalTitle}}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" aria-placeholder="Group title" v-if="isGroupModal || isEditNoteModal">
                <div contenteditable="true" id="group-title" v-if="isGroupModal"></div>
                <note v-if="$store.state.note.editNote" :note="$store.state.note.note"></note>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="this.$store.commit('addToNotes')">Close</button>
                <button type="button" :class="{btn:true, 'btn-primary':isGroupModal, 'btn-danger':!isGroupModal}" @click="$emit(modal_type)" data-dismiss="modal" v-if="!$store.state.note.editNote">{{buttonName}}</button>
            </div>
            </div>
        </div>
        </div>
</template>

<script>
import Note from '../notes/Note.vue';
export default {
    props:['modal_type'],
    data(){
        return {
            buttonName:''
        }
    },
    components:{
        Note
    },
    updated(){
        if(this.modal_type==='newGroup'){
            this.buttonName = 'Save'
        }
        else{
            this.buttonName = 'Delete'
        }
    },
    computed:{
        isGroupModal:function(){
            if(this.modal_type==='newGroup')
            return true;
            else {
                return false
            }
        },
        isEditNoteModal:function(){
            if(this.modal_type==='editNote'){
                return true
            }
            else{
                return false;
            }
        },
        modalTitle:function(){
              if(this.modal_type==='newGroup')
            return 'Add a new Group';
            else if(this.modal_type==='del'){
                return 'Delete the selected notes?'
            }
            else{
                return 'Edit Note'
            }
        }
    }
}
</script>

<style lang="stylus" scoped>

</style>