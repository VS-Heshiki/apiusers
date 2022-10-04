<template>
    <div class="container">
        <div class="formStyle">
            <p style="font-size: 2rem">Login</p>
            <br />
            <div class="box w-5">
                <div class="field">
                    <label class="label">Email</label>
                    <div class="control">
                        <input class="input is-link" type="email" placeholder="Email" v-model="email" />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Password</label>
                    <div class="control">
                        <input class="input is-link" type="password" placeholder="Password" v-model="password" />
                    </div>
                </div>
                <button class="button is-link" @click="login" style="margin-right: 10px">Login</button>
                <router-link :to="{name: 'Register'}" ><button class="button is-link" style="margin-left: 10px">Register</button></router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import * as bulmaToast from 'bulma-toast';
    export default {
        data() {
            return {
                email: '',
                password: '',
                toast: '',
            };
        },
        methods: {
            login() {
                axios
                    .post('http://localhost:3000/login', {
                        email: this.email,
                        password: this.password,
                    })
                    .then(res => {
                        localStorage.setItem('token', res.data.token);
                        this.toast = bulmaToast.toast({ message: res.data.message, type: 'is-success', animate: { in: 'fadeIn', out: 'fadeOut'}, position: 'top-center' });
                        this.$router.push({ name: 'Users' });
                    })
                    .catch(err => {
                        this.toast = bulmaToast.toast({ message: err.response.data, type: 'is-danger', animate: { in: 'fadeIn', out: 'fadeOut' }, position: 'top-center' });
                    });
            },
        },
    };
</script>

<style></style>
