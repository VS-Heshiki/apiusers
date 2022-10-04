<template>
    <div class="container">
        <div class="formStyle">
            <p style="font-size: 2rem">Register</p>
            <br />
            <div class="box w-5">
                <div class="field">
                    <label class="label">Email</label>
                    <div class="control">
                        <input class="input is-link" type="email" placeholder="Email" v-model="email" />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Username</label>
                    <div class="control">
                        <input class="input is-link" type="Username" placeholder="Username" v-model="username" />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Password</label>
                    <div class="control">
                        <input class="input is-link" type="password" placeholder="Password" v-model="password" />
                    </div>
                </div>
                <button class="button is-link" @click="register">Register</button>
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
                username: '',
                toast: '',
            };
        },
        methods: {
            register() {
                axios
                    .post('http://localhost:3000/user', {
                        email: this.email,
                        username: this.username,
                        password: this.password,
                    })
                    .then(res => {
                        this.toast = bulmaToast.toast({ message: res.data, type: 'is-success', animate : {in: 'fadeIn', out: 'fadeOut'}, position: 'top-center' });
                        this.$router.push({ name: 'Users' });
                    })
                    .catch(err => {
                        this.toast = bulmaToast.toast({ message: err.response.data, type: 'is-danger', animate : {in: 'fadeIn', out: 'fadeOut'}, position: 'top-center' });
                    });
            },
        },
    };
</script>

<style>
    p {
        color: #dbd9db;
    }

    .formStyle {
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    .box {
        width: 25rem;
        background-color: #84818a !important;
    }

    .notification {
        width: 25rem;
    }

    button {
        width: 100px;
    }

    input {
        background: black;
        color: aliceblue;
    }
</style>
