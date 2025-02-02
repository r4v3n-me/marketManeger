/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue').default;

// let token = document.head.querySelector('meta[name="csrf-token"]');

// if (token) {
//     window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
// } else {
//     console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
// }

import vuetify from '../plugins/vuetify';
import router from './router'
import store from './store'
import './plugins/progressBar'
import './plugins/roles'
import axios from 'axios';

// redirect if Unauthenticated
axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401 || error.response.status === 419) {
        window.location.reload();
    }
    // if (error.response.status === 404) {
    //     router.replace({
    //         name: 'not_found'
    //     })
    // }
    return Promise.reject(error);
});

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('app-container', require('./AppContainer.vue').default);
Vue.component('app-manager', require('./layouts/AppManager.vue').default);
Vue.component('app-administrator', require('./layouts/AppAdministrator.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    vuetify: vuetify,
    router: router,
    store: store,
    el: '#app',
});
