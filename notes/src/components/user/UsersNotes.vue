<template>
    <div>
        <display-notes-groups :notes_groups="$store.state.notes_groups.notes_groups"></display-notes-groups>
        <hr/>
        <display-notes :notes="$store.state.notes.notes_to_display"></display-notes>
    </div>   
</template>

<script>
import DisplayNotes from '../notes/DisplayNotes.vue';
import DisplayNotesGroups from '../notes/DisplayNotesGroups.vue';
export default {
    name:'UsersNotes',
    components:{
        DisplayNotes,
        DisplayNotesGroups
    },
}
</script>

<style lang="stylus" scoped>


</style>