import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Users from '../views/Users.vue';
import Edit from '../views/Edit.vue'
import axios from 'axios';
import req from '../token';

function AdminAuth(to, from, next) {
    if (localStorage.getItem('token') != undefined) {
        axios
            .post('http://localhost:3000/auth', {}, req)
            .then(res => {
                console.log(res);
                next();
            })
            .catch(err => {
                console.log(err.response);
                next('/login');
            });
    } else {
        next('/login');
    }
}

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/admin/users',
        name: 'Users',
        component: Users,
        beforeEnter: AdminAuth,
    },
    {
        path: '/admin/user/edit/:id',
        name: 'Edit',
        component: Edit,
        beforeEnter: AdminAuth,
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
