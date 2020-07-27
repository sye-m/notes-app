import Index from './components/forms/Index.vue';
import Home from './components/user/Home.vue';
import UsersNotes from './components/user/UsersNotes.vue';
import UsersGroupsNotes from './components/notes/UsersGroupsNotes.vue';
import SearchedNotes from './components/notes/SearchedNotes.vue';
export const routes = [
    { path: '', component: Index, name: 'reglog' },
    {
        path: '/user',
        component: Home,
        children: [{
                path: '',
                component: UsersNotes
            },
            {
                path: 'group/:group_title',
                name: 'group',
                component: UsersGroupsNotes
            },
            {
                path: 'search',
                name: 'searchNotes',
                component: SearchedNotes
            }
        ]
    }
];