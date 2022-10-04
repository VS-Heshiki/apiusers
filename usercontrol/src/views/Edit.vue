<template>
    <div class="container">
        <div class="formStyle">
            <p style="font-size: 2rem">Edit</p>
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
                <div class="formButton">
                    <div class="select is-link">
                        <select v-model="role">
                            <option class="option" value="1">Admin</option>
                            <option class="option" value="0">Default</option>
                        </select>
                    </div>
                    <button class="button is-link" @click="editUser">Finish</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import req from '../token';
    import * as bulmaToast from 'bulma-toast';
    export default {
        data() {
            return {
                email: '',
                username: '',
                id: -1,
                role: -1,
                err: undefined,
            };
        },
        created() {
            axios
                .get('http://localhost:3000/user/' + this.$route.params.id, req)
                .then(res => {
                    this.id = res.data.id;
                    this.email = res.data.email;
                    this.username = res.data.username;
                    this.role = res.data.role;
                })
                .catch(err => {
                    console.log(err);
                    this.$route.push({ name: 'Users' });
                });
        },
        methods: {
            editUser() {
                axios
                    .put(
                        'http://localhost:3000/user',
                        {
                            id: this.id,
                            email: this.email,
                            username: this.username,
                            role: this.role,
                        },
                        req
                    )
                    .then(res => {
                        this.toast = bulmaToast.toast({ message: res.data, type: 'is-success', animate: { in: 'fadeIn', out: 'fadeOut' }, position: 'top-center' });
                        this.$router.push({name : 'Users'})
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
        },
    };
</script>

<style scoped>
    .formButton {
        display: flex;
        justify-content: space-around;
    }

    input {
        color: aliceblue;
        background-color: black !important;
    }

    select {
        color: aliceblue;
        background-color: black !important;
    }
</style>
