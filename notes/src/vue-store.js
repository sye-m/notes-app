import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import setRequestHeaders from "./functions/SetHeaders";
Vue.use(Vuex);
export const store = new Vuex.Store({
  state: {
    auth: {
      loading: false,
      authenticated: false,
      user: {},
    },

    note: {
      note: null,
      editNote: false,
    },

    notes: {
      all_notes: [],
      loading: true,
      notes_groups: [],
      selected_notes: [],
      selected_groups: [],
      notes_to_display: [],
    },
  },

  mutations: {
    //getting user's data
    loadingUser: (state) => {
      state.auth = {
        ...state.auth,
        loading: true,
      };
    },

    //set user's data after user has logged in
    setUser: (state, user) => {
      state.auth = {
        ...state.auth,
        authenticated: true,
        loading: false,
        user: user,
      };
    },

    //if there is some error in fetching user's data
    userError: (state) => {
      state.auth = {
        authenticated: false,
        loading: false,
        user: {},
      };
    },

    //single note on which the user is working
    setNote: (state, note) => {
      state.note = {
        ...state.note,
        note: note,
        loading: false,
      };
    },

    //searched notes
    searchNotes: (state, searched_text) => {
      let notes = state.notes.all_notes.filter((note) => {
        if (note.body.search(searched_text) >= 0) return true;
      });
      state.notes.notes_to_display = notes;
    },

    //add note id to the selected notes this will select those notes
    selectNote: (state, note_id) => {
      let note_exists = state.notes.selected_notes.indexOf(note_id);
      if (note_exists < 0) {
        state.notes.selected_notes.push(note_id);
      } else {
        state.notes.selected_notes.splice(note_exists, 1);
      }
    },

    //add group id to selected groups this will select those groups
    selectGroup: (state, group_id) => {
      let group_exists = state.notes.selected_groups.indexOf(group_id);
      if (group_exists < 0) {
        state.notes.selected_groups.push(group_id);
      } else {
        state.notes.selected_groups.splice(group_exists, 1);
      }
    },

    setAllNotes: (state, notes) => {
      state.notes = { ...state.notes, all_notes: notes, loading: false };
    },

    //show notes that belong to this specific group
    setGroupNotes: (state, group_id) => {
      let notes = state.notes.all_notes.filter(
        (note) => note.notes_group_id == group_id
      );
      state.notes = {
        ...state.notes,
        notes_to_display: notes,
      };
    },

    setNotesNotInGroups: (state) => {
      let notes = state.notes.all_notes.filter((note) => !note.notes_group_id);
      state.notes.notes_to_display = notes;
    },

    //update notes_groups by adding a group this will only add group
    updateNotesGroup: (state, notes_group) => {
      state.notes = {
        ...state.notes,
        notes_groups: [...state.notes.notes_groups, notes_group],
      };
    },

    setNotesGroups: (state, notes_groups) => {
      state.notes = {
        ...state.notes,
        notes_groups: notes_groups,
      };
    },

    //add note from notes to note state to edit it.
    editNote: (state, note) => {
      state.note = { ...state.note, note: note, editNote: true };
    },

    //after editing of note is done update that note in the notes array
    addToNotes: (state) => {
      let added_notes_array = state.notes.notes_to_display;
      console.log(state.note.note)
      let index = added_notes_array.findIndex(
        (note) => state.note.note.id == note.id
      );
      //if user is editing a note a update the note in the notes array
      if (index >= 0) {
        added_notes_array[index] = state.note.note;
      }
      //if the user is creating a new note add that note to the top of notes array
      else {
        added_notes_array.unshift(state.note.note);
      }
      state.notes = { ...state.notes, notes_to_display: added_notes_array };
      state.note = { ...state.note, note: null };
    },

    //remove the notes from home page which are either deleted or added to a group
    removeNotes: (state) => {
      let notes = state.notes.notes_to_display.filter((note) => {
        let removeItem = false;
        state.notes.selected_notes.forEach((note_id) => {
          if (note.id === note_id) {
            //if the note is in the selected notes remove it
            removeItem = true;
          }
        });
        if (!removeItem) {
          return true; //keep the note if it is note in the selected notes
        }
      });
      state.notes = {
        ...state.notes,
        notes_to_display: notes,
        loading: false,
        selected_notes: [],
      };
    },
     //remove the notes from home page which are either deleted or added to a group
     removeGroups: (state) => {
      let notes_groups = state.notes.notes_groups.filter((group) => {
        let removeItem = false;
        state.notes.selected_groups.forEach((group_id) => {
          if (group.id === group_id) {
            //if the note is in the selected notes remove it
            removeItem = true;
          }
        });
        if (!removeItem) {
          return true; //keep the note if it is note in the selected notes
        }
      });
      state.notes = {
        ...state.notes,
        notes_groups: notes_groups,
        loading: false,
        selected_groups: [],
      };
    },
  },

  actions: {
    loginUser: ({ commit }, user) => {
      return new Promise((resolve, reject) => {
        commit("loadingUser");
        axios
          .post("login", {
            email: user.email,
            password: user.password,
          })
          .then((res) => {
            if (res.data.auth) {
              let token = res.data.auth.access_token;
              localStorage.setItem("token", token);
              setRequestHeaders();
              let user = res.data.user;
              commit("setUser", user);
              resolve();
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    //if the user has already logged in get the user's data
    getUser: async ({ commit }) => {
      axios
        .get(`user`)
        .then((res) => {
          let user = res.data.user;
          commit("setUser", user);
        })
        .catch(() => {
          commit("userError");
        });
    },

    //create a new note
    createNote: ({ commit, state }, { note_body: { title, body, color } }) => {
      axios
        .post("notes", {
          userId: state.auth.user.id,
          title: title,
          body: body,
          color: color,
        })
        .then((res) => {
          commit("setNote", res.data.note);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    //update an already existing note
    updateNote: ({ commit, state }, { note_body: { title, body, color } }) => {
      commit("setNote", {...state.note.note, title,body,color});
      console.log(title+color+body)
      axios
        .put(`notes/${state.note.note.id}`, {
          title: title,
          body: body,
          color: color,
        })
        .catch((error) => {
          console.log(error.response);
        })
     
    },

    //create a new group
    newGroup: ({ commit }, { group_title }) => {
      axios
        .post("notesgroup/", { title: group_title })
        .catch((error) => {
          console.log(error.response);
        })
        .then((res) => {
          commit("updateNotesGroup", res.data.notes_group);
        });
    },

    //get all of the user's notes and notes groups
    getNotesAndGroups: ({ commit, state }) => {
      state.notes.loading = true;
      axios
        .get(`/notes/`)
        .catch((error) => {
          console.log(error.response);
        })
        .then((res) => {
          if (res.data) {
            let notes = res.data.notes;
            let notes_groups = res.data.notes_groups;
            commit("setAllNotes", notes);
            commit("setNotesNotInGroups");
            commit("setNotesGroups", notes_groups);
          }
        });
    },

    //add the selected notes to a selected group
    addNotesToGroup: ({ commit, state }, { group_id }) => {
      axios
        .put("notesgroup/" + group_id, {
          notes_ids: state.notes.selected_notes.toString(),
        })
        .catch((error) => {
          console.log(error.response);
        })
        .then(() => {
          commit("removeNotes");
        });
    },

    //delete the selected notes
    deleteNotes: ({ commit, state }) => {
      axios
        .delete("notes/", {
          data: {
            note_ids: state.notes.selected_notes,
            group_ids: state.notes.selected_groups,
          },
        })
        .catch((error) => {
          console.log(error.response);
        })
        .then(() => {
          if(state.notes.selected_notes){
            commit("removeNotes");
          }
          if(state.notes.selected_groups){
            commit("removeGroups");
          }
        });
    },
  },
});
