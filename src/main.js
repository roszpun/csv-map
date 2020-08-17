import Vue from 'vue';
import papaparse from 'papaparse';
import 'vue-googlemaps/dist/vue-googlemaps.css';
import VueGoogleMaps from 'vue-googlemaps';
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;
Vue.prototype.$parser = papaparse;
Vue.use(VueGoogleMaps, {
  load: {
    // Google API key
    apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
    // Enable more Google Maps libraries here
    libraries: ['places'],
    // Use new renderer
    useBetaRenderer: false,
  },
});
new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
