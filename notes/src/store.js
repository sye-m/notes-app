import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
Vue.use(Vuex);
export const store = new Vuex.Store({
    state: {
        auth: {
            loading: true,
            user: {
                name: ''
            },
        },
        form_type: "register",
        all_notes: {
            all_notes: [],
            loading: false
        },
        note: {
            note: {},
            loading: true,
            editNote: false,
        },
        notes_groups: {
            notes_groups: [],
            selected_groups: []
        },
        notes: {
            selected_notes: [],
            notes_to_display: []
        },
        searched_notes: []
    },
    mutations: {
        setUser: (state, user) => {
            state.auth = {
                ...state.auth,
                loading: false,
                user: user
            }
        },
        setNote: (state, note) => {
            state.note = {
                ...state.note,
                note: note,
                loading: false
            }
        },
        searchNotes: (state, searched_text) => {
            console.log(searched_text)
            let notes = state.notes.notes.filter((note) => { if (note.body.search(searched_text) >= 0) return true });
            console.log(notes)
            state.searched_notes = notes;
        },
        //add note id to the selected notes these will select those notes
        selectNote: (state, note_id) => {
            let note_exists = state.notes.selected_notes.indexOf(note_id);
            if (note_exists < 0) {
                state.notes.selected_notes.push(note_id);
            } else {
                state.notes.selected_notes.splice(note_exists, 1);
            }
        },
        //add group id to selected groups these will select those groups
        selectGroup: (state, group_id) => {
            let group_exists = state.notes_groups.selected_groups.indexOf(group_id);
            if (group_exists < 0) {
                state.notes_groups.selected_groups.push(group_id);
            } else {
                state.notes_groups.selected_groups.splice(group_exists, 1);
            }
        },
        setAllNotes: (state, notes) => {
            state.all_notes = {...state.all_notes, all_notes: notes, loading: false }
        },
        //add notes that belong to this specific group 
        setGroupNotes: (state, group_id) => {
            let notes = state.all_notes.all_notes.filter((note) => note.notes_group_id == group_id)
            state.notes = {
                ...state.notes,
                notes_to_display: notes
            }
        },
        //update notes 
        setNotesNotInGroups: (state) => {
            let notes = state.all_notes.all_notes.filter((note) => !note.notes_group_id)
            state.notes.notes_to_display = notes;
        },
        //update notes_groups by adding a group this will only add group
        updateNotesGroup: (state, notes_group) => {
            state.notes_groups = {
                ...state.notes_groups,
                notes_groups: [notes_group, ...notes_group]
            }
        },

        setNotesGroups: (state, notes_groups) => {
            state.notes_groups = {
                ...state.notes,
                notes_groups: notes_groups
            }
        },

        //add note from notes to note state to edit it.
        editNote: (state, note) => {
            state.note = {...state.note, note: note, editNote: true }
        },

        //after editing of note is done add that note to the notes array
        addToNotes: (state) => {
            let index = state.notes.notes_to_display.findIndex(note => note.id === state.note.note.id);
            if (index >= 0) {

                state.notes.notes_to_display.splice(index, 1)

            }
            state.notes.notes_to_display = {...state.notes.notes_to_display, notes_to_display: [state.note.note, ...state.notes.notes_to_display] }
            state.note = {...state.note, note: {} }

        },
        removeNotes: (state) => {
            //remove the notes from home page which are either deleted or added to a group
            let notes = state.notes.notes_to_display.filter((note) => {
                let removeItem = false;
                state.notes.selected_notes.forEach((note_id) => {
                    if (note.id === note_id) {
                        //if the note is in the selected notes remove it
                        removeItem = true
                    }
                })
                if (!removeItem) {
                    return true //keep the note if it is note in the selected notes 
                }
            })
            state.notes = {...state.notes, notes_to_display: notes, loading: false, selected_notes: [] }
        },
        removeNote(state) {
            state.note.note = {...state.note, note: {} }
        }
    },
    actions: {
        getUser: ({ commit }) => {
            axios.get(`user/`).then((res) => {
                let user = res.data.user;
                commit('setUser', user)
            }).catch((error) => {
                console.log(error);
            })
        },
        createNote: ({ commit, state }, { note_body: { title, body, color } }) => {
            axios.post('notes', { 'userId': state.auth.user.id, 'title': title, 'body': body, 'color': color }).catch((error) => {
                console.log(error);
            }).then((res) => {
                commit('setNote', res.data.note)
            });

        },
        updateNote: ({ commit, state }, { note_body: { title, body, color } }) => {
            axios.put(`notes/${state.note.note.id}`, { 'title': title, 'body': body, 'color': color }).
            catch((error) => {
                console.log(error);
            }).then((res) => {
                commit('setNote', res.data.note)
            });
        },
        updateNoteColor: ({ commit, state }, { note_body: { title, body, color } }) => {
            axios.put(`notes/${state.note.note.id}`, { 'title': title, 'body': body, 'color': color }).
            catch((error) => {
                console.log(error);
            }).then((res) => {
                commit('removeNote')
                console.log(res);
            });
        },
        newGroup: ({ commit }, { group_title }) => {
            console.log('Group title', group_title)
            axios.post('notesgroup/', { 'title': group_title })
                .catch((error) => {
                    console.log(error);
                }).then((res) => {
                    commit('updateNotesGroup', res.data.notes_group);
                });
        },
        getNotesAndGroups: ({ commit, state }) => {
            state.all_notes.loading = true;
            axios.get(`/notes/`).catch((error) => {
                console.log(error);
            }).then((res) => {
                console.log(res);
                let notes = res.data.notes;
                let notes_groups = res.data.notes_groups;
                commit('setAllNotes', notes);
                commit('setNotesNotInGroups');
                commit('setNotesGroups', notes_groups);
            });
        },
        addNotesToGroup: ({ commit, state }, { group_id }) => {
            axios.put('notesgroup/' + group_id, { 'notes_ids': state.selected_notes.toString() }).catch((error) => {
                console.log(error);
            }).then((res) => {
                console.log(res);
                commit('removeNotes');
            });
        },
        deleteNotes: ({ commit, state }) => {
            axios.delete('notes/', { data: { 'note_ids': state.selected_notes, 'group_ids': state.notes_groups.selected_groups } }).
            catch((error) => {
                console.log(error);
            }).then((res) => {
                console.log(res)
                commit('removeNotes');
            });
        }
    }
});