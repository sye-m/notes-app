<template>
  <div id="home" @click="addToNotes">
    <div>
      <nav id="top-bar" class="navbar navbar-expand-lg navbar-dark bg-primary">
        <transition name="search">
          <div v-if="show_search" class="search-input">
            <input
              v-model="search_text"
              @keyup.enter="searchNote"
              type="text"
              class="form-control"
              placeholder="Search Notes..."
            />
            <button class="btn close-search" @click="toggleSearchBar">
              <i class="fa fa-times" aria-hidden="true"></i>
            </button>
          </div>
        </transition>
        <transition name="options">
          <div v-if="!show_search" class="d-flex w-100">
            <div id="site-name">
              <router-link to="/notes">Scribble</router-link>
            </div>
            <div class="search-bar">
              <div>
                <button
                  @click="toggleSearchBar"
                  class="btn btn-circle btn-secondary"
                >
                  <i class="fa fa-search" aria-hidden="true"></i>
                </button>
              </div>
            </div>
            <div class="dropdown show ml-3">
              <button
                class="btn btn-circle btn-secondary"
                @click="
                  () => {
                    modal_type = 'newGroup';
                  }
                "
                href="#"
                role="button"
                id="dropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
              </button>

              <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <a
                  class="dropdown-item"
                  type="button"
                  data-toggle="modal"
                  data-target="#newGroupModal"
                  >New Group</a
                >
                <a
                  class="dropdown-item"
                  data-toggle="dropdown"
                  @mouseover="show_group_menu = true"
                  >Add to group</a
                >
                <div
                  v-if="show_group_menu"
                  class="group-menu dropdown-menu"
                  @mouseleave="show_group_menu = false"
                >
                  <div
                    @click="addNotesToGroup(group.id)"
                    class="dropdown-item mt-2 p-2"
                    v-for="group in $store.state.notes.notes_groups"
                    :key="group.id"
                  >
                    {{ group.title }}
                  </div>
                </div>
              </div>
            </div>
            <div
              class="ml-3"
              @click="
                () => {
                  modal_type = 'del';
                }
              "
              v-if="
                $store.state.notes.selected_notes.length > 0 ||
                  $store.state.notes.selected_groups.length > 0
              "
            >
              <button
                class="btn btn-danger btn-circle"
                data-toggle="modal"
                data-target="#delModal"
              >
                <i class="fa fa-trash" aria-hidden="true"></i>
              </button>
            </div>
            <div class="ml-auto px-1">
              <div class="dropdown show">
                <a
                  class="btn btn-secondary dropdown-toggle"
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {{
                    Object.entries($store.state.auth.user) != 0 &&
                      $store.state.auth.user.name.substring(0, 6) + ".."
                  }}
                </a>

                <div
                  class="dropdown-menu user-menu"
                  aria-labelledby="dropdownMenuLink"
                >
                  <button class="dropdown-item logout-option" @click="logout">
                    <i class="fa fa-sign-out" aria-hidden="true"></i>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </nav>

      <div class="main-content container">
        <div id="new-note" @click.stop class="mt-2 new-note">
          <note></note>
        </div>
        <router-view></router-view>
      </div>
    </div>
    <modal :modal_type="modal_type" @newGroup="newGroup" @del="deleteNotes"></modal>
  </div>
</template>

<script>
import Note from "../notes/Note.vue";
import Modal from "../modal/Modal.vue";
export default {
  name: "Home",
  mounted() {
    this.$store.dispatch({ type: "getNotesAndGroups" });
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.$token) {
        vm.$router.push("/auth/login");
      }
    });
  },
  data() {
    return {
      show_group_menu: false,
      show_search: false,
      modal_type: "",
      search_text: "",
    };
  },
  components: {
    Note,
    Modal,
  },
  methods: {
    //if user clicks outside of the area of create note that note will be added to the notes array
    addToNotes(e) {
      if (
        e.target !== document.getElementById("new-note") &&
        (document.getElementById("new-note-title").innerText !== "" ||
          document.getElementById("new-note-body").innerText !== "") &&
        this.$store.state.note.note
      ) {
        this.$store.commit("addToNotes");
        //reset the note
        document.getElementById("new-note-title").textContent = "";
        document.getElementById("new-note-body").textContent = "";
      }
    
    },

    newGroup() {
      let group_title = document.getElementById("group-title").value;
      console.log(group_title)
      this.$store.dispatch({
        type: "newGroup",
        group_title,
      });
    },

    addNotesToGroup(group_id) {
      this.$store.dispatch({
        type: "addNotesToGroup",
        group_id,
      });
    },

    deleteNotes() {
      this.$store.dispatch({ type: "deleteNotes" });
    },

    toggleSearchBar() {
      this.show_search ? (this.show_search = false) : (this.show_search = true);
    },

    searchNote() {
      if (this.search_text) {
        this.$router
          .push({ name: "searchNotes", query: { text: this.search_text } })
          .catch(() => {});
      }
    },

    logout() {
      this.$token = "";
      localStorage.removeItem("token");
      this.$store.commit({ type: "userError" });
      this.$router.push({ name: "auth" });
    },
  },
};
</script>

<style lang="stylus" scoped>
.search-enter-active, .search-leave-active {
  transition: opacity 0.6s linear;
}

.search-enter, .search-leave-to  {
  width:0px;
  height:0px;
  visibility:hidden;
  opacity: 0;

}

.options-enter-active, .options-leave-active {
  transition: opacity .5s linear;
}

.options-enter, .options-leave-to  {
  width:0px;
  height:0px;
  visibility:hidden;
  opacity: 0;
}

#site-name > a{
    font-size:1.5em;
    color:white;
    text-decoration:none;
    margin-right:10px;
}
.user-menu{
    width:-webkit-fill-available;
    min-width:100%;
}
.logout-option{
    padding:0.5rem !important;
    display:flex;
}

.logout-option > i {
    position:relative;
    top:5px;
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

#top-bar{
    height:64px;
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
