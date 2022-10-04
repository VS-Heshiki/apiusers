<template>
    <div>
        <div class="columns is-centered" style="margin-top: 150px">
            <div class="column is-half">
                <h1>All Users</h1>
                <table class="table">
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Username</td>
                            <td>Email</td>
                            <td>Role</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id">
                            <td>{{ user.id }}</td>
                            <td>{{ user.username }}</td>
                            <td>{{ user.email }}</td>
                            <td>{{ textRole(user.role) }}</td>
                            <td>
                                <router-link :to="{name : 'Edit', params : {id : user.id}}" ><button class="button is-warning" style="margin-right: 10px">Edit</button></router-link>
                                <button class="button is-danger" style="margin-left: 10px" @click="showModal(user.id)">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div :class="{ modal: true, 'is-active': popUpModal }">
            <div class="modal-background"></div>
            <div class="modal-content">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title" style="color: #485fc7">Alert!</p>
                    </header>
                    <div class="card-content">
                        <div class="content"><h3 style="color: #485fc7">You really want delete this user?</h3></div>
                    </div>
                    <footer class="card-footer">
                        <a class="card-footer-item" @click="deleteUser">Delete</a>
                        <a class="card-footer-item" @click="hideModal">Cancel</a>
                    </footer>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="hideModal"></button>
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
                users: [],
                id: '',
                username: '',
                popUpModal: false,
                deleteUserId: -1,
                toast: '',
            };
        },
        created() {
            axios
                .get('http://localhost:3000/users', req)
                .then(res => {
                    console.log(res);
                    this.users = res.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        methods: {
            textRole(value) {
                if (value == 0) {
                    return 'Default';
                } else if (value == 1) {
                    return 'Admin';
                }
            },
            hideModal() {
                this.popUpModal = false;
            },
            showModal(id) {
                this.deleteUserId = id;
                this.popUpModal = true;
            },
            deleteUser() {
                axios
                    .delete('http://localhost:3000/user/' + this.deleteUserId, req)
                    .then(res => {
                        this.popUpModal = false;
                        this.toast = bulmaToast.toast({ message: res.data, type: 'is-success', animate: { in: 'fadeIn', out: 'fadeOut' }, position: 'top-center' });
                        axios
                            .get('http://localhost:3000/users', req)
                            .then(res => {
                                console.log(res);
                                this.users = res.data;
                            })
                            .catch(err => {
                                this.toast = bulmaToast.toast({ message: err.response.data, type: 'is-danger', animate: { in: 'fadeIn', out: 'fadeOut' }, position: 'top-center' });
                            });
                    })
                    .catch(err => {
                        this.toast = bulmaToast.toast({ message: err.response.data, type: 'is-danger', animate: { in: 'fadeIn', out: 'fadeOut' }, position: 'top-center' });
                    });
            },
        },
    };
</script>

<style scoped>
    h1 {
        text-align: start;
        font-size: 3rem;
        margin-bottom: 10px;
        color: #8e8dad;
    }

    table {
        width: 100vh;
        background-color: #343439;
        border-radius: 1rem;
    }

    td {
        color: #8e8dad !important;
        vertical-align: inherit;
    }

    button {
        width: 75px;
    }

    .card {
        background: #343439;
    }

    .card-footer-item:hover {
        transition: 500ms;
        background: grey;
    }
</style>
