<template>
    <v-container class="pa-0 ma-0" fluid>
        <v-app-bar app prominent>
            <v-container fluid>
                <v-row>
                    <v-col class="text-center">
                        <h1>Extended Reality Gallery</h1>
                    </v-col>
                </v-row>
            </v-container>
        </v-app-bar>
        <v-content>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="8" class="text-center">
                        <v-card>
                            <v-toolbar>
                                <v-toolbar-title>Login</v-toolbar-title>
                            </v-toolbar>
                            <v-container class="pa-8">
                                <v-card-text>
                                    <v-form>
                                        <v-text-field label="GVSU Email" v-model="email" placeholder="user@gvsu.edu"></v-text-field>
                                        <v-text-field label="Password" v-model="password" type="password"></v-text-field>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer />
                                        <v-btn v-if="!isLoggedIn" @click="login" color="blue" class="px-8" :disabled="!email || !password" required>Login</v-btn>
                                        <v-btn v-if="isLoggedIn" @click="logout" color="blue" required>Signout</v-btn>
                                    <v-spacer />
                                    </v-card-actions>
                                </v-container>
                                <v-divider />
                                <v-card-text>
                                    <v-btn @click="createDialog = true" color="green">Create new account</v-btn>
                                    <v-dialog v-model="createDialog">
                                        <v-card>
                                            <v-toolbar>
                                                <v-toolbar-title>Create new account</v-toolbar-title>
                                            </v-toolbar>
                                            <v-container class="pa-8">
                                                <v-card-text>
                                                    <v-form>
                                                        <v-text-field label="First name" v-model="firstName" required></v-text-field>
                                                        <v-text-field label="Last name" v-model="lastName" required></v-text-field>
                                                        <v-text-field label="GVSU Email" v-model="newAccountEmail" placeholder="user@gvsu.edu" required></v-text-field>
                                                        <v-text-field label="Password" v-model="newAccountPassword" type="password"></v-text-field>
                                                        <v-text-field label="Confirm Password" v-model="confirmPassword" type="password"></v-text-field>
                                                    </v-form>
                                                </v-card-text>
                                                <v-card-actions>
                                                    <v-btn @click="createDialog = false" color="red">Cancel</v-btn>
                                                    <v-spacer />
                                                    <v-btn @click="createAccount" color="green">Create Account</v-btn>
                                                </v-card-actions>
                                            </v-container>
                                        </v-card>
                                    </v-dialog>
                                </v-card-text>
                                <v-divider />
                                <v-card-text>
                                    <v-btn @click="forgotPassword" color="yellow" class="black--text">Forgot my password</v-btn>
                                </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-container>
</template>


<script>
import { AppDB, AppAuth } from './db-init.js'

export default {
    name: 'Login',
    data: () => ({
        email: "",
        password: "",
        newAccountEmail: "",
        newAccountPassword: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",

        isLoggedIn: false,
        createDialog: false,

        emailRules: [
            v => !!v || 'Email is required',
            v => (v.endsWith("@gvsu.edu")) || 'Must be a valid gvsu email',
        ],

        nameRules: [
            v => !!v || 'Name is required',
        ],

    }),
    methods: {
        login() {
            AppAuth.signInWithEmailAndPassword(this.email, this.password)
                .then((u) => {
                    console.log("You logged in as " + u.user.email);
                })
                .catch((err) => {
                    console.log("Error: " + err.message);
                });
        },
        createAccount() {
            AppAuth.createUserWithEmailAndPassword(this.newAccountEmail, this.newAccountPassword)
                .then((u) => {
                    console.log("User created with UID " + u.user.uid);
                    AppDB.ref('users/' + u.user.uid).set({
                        firstName: this.firstName,
                        lastName: this.lastName,
                    })
                    this.createDialog = false
                })
                .catch((err) => {
                    console.log("Error: " + err.message);
                });
        },
        forgotPassword() {
            console.log("Send email to reset password")
        },
        logout() {
            AppAuth.signOut().then(() => {
                console.log("Signed out");
            });
        },
    },
    mounted() {
        AppAuth.onAuthStateChanged((u) => {
            if (u == null) {
                console.log("not logged in")
                this.isLoggedIn = false
            }
            else {
                console.log("is logged in as: " + u.uid)
                this.isLoggedIn = true
                this.$router.push({ path: "/" })
            }
        });
    },
}
</script>
