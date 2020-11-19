<template>
        <div class="row d-flex flex-row justify-content-center" data-toggle>
            <div class="note rounded d-flex" :id="'note'+note.id"  v-for="note in notes" :key="note.id">
                <note :note="note" :editable="false"></note>
            </div>
          <div v-if="(!notes.length > 0 && !notes.loading)">
                No Notes to show here.
            </div>
        <modal modal_type="editNote" :display_note="true"> </modal>

        </div>
</template>

<script>
import Modal from '../modal/Modal.vue';
import Note from './Note.vue';
export default {
    name:'DisplayNotes',
    props:['notes'],
    components:{
        Note,
        Modal,
    }, 
}
</script>

<style lang="stylus" scoped>
.note{
    height: 200px;
    width: calc(25%);
    margin: 10px;
    border: 1px solid #d3d3d3;
    color:white;
    min-width:200px;
    transition:border 0.5s;
}

.selected {
    border:1px solid black !important;
}
</style>