import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import RegisterComponent from "./components/RegisterComponent.vue"
import LoginComponent from "./components/LoginComponent.vue"
import HomeComponent from "./components/HomeComponent.vue"
import TicketsComponent from "./components/TicketsComponent.vue"

const routes = [
    { path: "/tickets/all/:page?", component: TicketsComponent },
    { path: '/register', component: RegisterComponent },
    { path: '/login', component: LoginComponent },
    { path: '/', component: HomeComponent },

    
    
];

const router = createRouter({
    history: createWebHistory(),
    routes, 
    
})
const app = createApp(App)
app.use(router)

app.config.globalProperties.$mainURL = "http://localhost:8080"
app.config.globalProperties.$apiURL = "http://localhost:4000"
app.config.globalProperties.$accessTokenKey = "accessTokenKey"

app.config.globalProperties.$user = null;
app.config.globalProperties.$login = false;
app.config.globalProperties.$headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("accessTokenKey")
};
app.mixin({
    methods: {
        dateTimeInFormat: function (timestamps) {
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
 
            const dateObj = new Date(timestamps)
            let date = dateObj.getDate()
            if (date < 10) {
                date = "0" + date
            }
            const month = months[dateObj.getMonth()]
            const year = dateObj.getFullYear()
 
            let hours = dateObj.getHours()
            if (hours < 10) {
                hours = "0" + hours
            }
 
            let minutes = dateObj.getMinutes()
            if (minutes < 10) {
                minutes = "0" + minutes
            }
 
            let seconds = dateObj.getSeconds()
            if (seconds < 10) {
                seconds = "0" + seconds
            }
 
            return date + " " + month + ", " + year + " " + hours + ":" + minutes + ":" + seconds
        }
    }
})
app.mount('#app')
