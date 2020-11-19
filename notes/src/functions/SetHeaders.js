import Vue from 'vue';
import axios from 'axios';
const setRequestHeaders = () => {
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

export default setRequestHeaders;