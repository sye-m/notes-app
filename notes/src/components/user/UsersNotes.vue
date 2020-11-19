<template>
  <div>
    <display-notes-groups
      :notes_groups="$store.state.notes.notes_groups"
    ></display-notes-groups>
    <Spinner :loading="$store.state.notes.loading" />
    <display-notes
      v-if="!$store.state.notes.loading"
      :notes="$store.state.notes.notes_to_display"
    ></display-notes>
  </div>
</template>

<script>
import DisplayNotes from "../notes/DisplayNotes.vue";
import DisplayNotesGroups from "../notes/DisplayNotesGroups.vue";
import Spinner from "../loader/Spinner.vue";

export default {
  name: "UsersNotes",
  components: {
    DisplayNotes,
    DisplayNotesGroups,
    Spinner,
  },
  mounted() {
    this.$store.commit("setNotesNotInGroups");
  },
};
</script>

<style lang="stylus" scoped></style>
