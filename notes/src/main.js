import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import { routes } from './routes.js';
import { store } from './store.js';
import axios from 'axios';
import Vuelidate from 'vuelidate';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'jquery/src/jquery.js';
import 'bootstrap/dist/js/bootstrap.min.js';
Vue.use(Vuelidate);
Vue.use({
    install(Vue) {
        Vue.prototype.$token = localStorage.getItem('token');
        if (Vue.prototype.$token) {
            axios.defaults.headers.common['Authorization'] = "Bearer " + Vue.prototype.$token;
        }
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        //set headers for request
        axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        //common base url to be used throughout the application
        axios.defaults.baseURL = 'http://localhost:8000/api';

    }
})

Vue.use(VueRouter);

const router = new VueRouter({
    routes,
    mode: 'history'
});
Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    store,
    router
}).$mount('#app')