import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import { routes } from './routes.js';
import { store } from './vue-store.js';
import Vuelidate from 'vuelidate';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'jquery/src/jquery.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import setRequestHeaders from './functions/SetHeaders';
Vue.use(Vuelidate);
Vue.use({
    install() {
        setRequestHeaders()
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