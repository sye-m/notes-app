import Auth from './components/auth/Auth.vue';
import Register from './components/auth/Register.vue';
import Login from './components/auth/Login.vue';
import Home from './components/user/Home.vue';
import UsersNotes from './components/user/UsersNotes.vue';
import UsersGroupsNotes from './components/notes/UsersGroupsNotes.vue';
import SearchedNotes from './components/notes/SearchedNotes.vue';
import PageNotFound from './components/NotFound/PageNotFound.vue';

export const routes = [
    {
        path: '',
        component: Home,
        redirect:'/notes',
        children: [
            {
                path: '/notes',
                component: UsersNotes,
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
    },
    { 
        path: '/auth', 
        component: Auth,
        name: 'auth',       
        redirect:'/login',
        children:[
            {
                path:'register',
                component:Register, 
                name:'register'
            },
            {
                path:'login', 
                component:Login, 
                name:'login'
            }
        ] 
    },
    {
        path:"*",
        component:PageNotFound
    }
];