<template>
    <v-app>
        <v-app-bar app height="300" src="./images/showcase.jpg">
            <template v-slot:img="{ props }">
                <v-img v-bind="props" position="center" gradient="to top right, rgba(20,20,100,0.8), rgba(100,200,200,1.0)"></v-img>
            </template>
            <v-container>
                <v-row>
                    <v-col class="text-center">
                        <v-toolbar-title class="text-uppercase display-3 font-weight-bold">
                            Extended Reality Gallery
                        </v-toolbar-title>
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
                                    <v-dialog v-model="createDialog" max-width="1000">
                                        <v-card>
                                            <v-toolbar>
                                                <v-toolbar-title>Create new account</v-toolbar-title>
                                            </v-toolbar>
                                            <v-container class="pa-8">
                                                <v-card-text>
                                                    <v-form ref="form">
                                                        <v-text-field label="First name" v-model="firstName" required :rules="requiredRules"></v-text-field>
                                                        <v-text-field label="Last name" v-model="lastName" required :rules="requiredRules"></v-text-field>
                                                        <v-text-field label="GVSU Email" v-model="newAccountEmail" placeholder="user@gvsu.edu" required ></v-text-field>
                                                        <v-text-field label="Password" v-model="newAccountPassword" type="password" :rules="requiredRules"></v-text-field>
                                                        <v-text-field label="Confirm Password" v-model="confirmPassword" type="password" :rules="[confirmPass]"></v-text-field>
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
                                    <v-dialog v-model="notifDialog" max-width="600">
                                        <v-card>
                                            <v-toolbar>
                                                <v-toolbar-title v-model="notifTitle">{{notifTitle}}</v-toolbar-title>
                                            </v-toolbar>
                                            <v-container class="pa-8">
                                                <v-card-text v-model="notifMsg">{{notifMsg}}</v-card-text>
                                                <v-card-actions>
                                                    <v-spacer />
                                                    <v-btn @click="notifDialog = false" color="green">ok</v-btn>
                                                </v-card-actions>
                                            </v-container>
                                        </v-card>
                                    </v-dialog>
                                    <v-dialog v-model="forgotDialog" max-width="600">
                                        <v-card>
                                            <v-toolbar>
                                                <v-toolbar-title>Password Reset</v-toolbar-title>
                                            </v-toolbar>
                                            <v-container class="pa-8">
                                                <v-card-text class="pl-0">
                                                    Enter your email address below to get password reset email:
                                                </v-card-text>
                                                <v-text-field label="user@gvsu.edu" v-model="forgotEmail"></v-text-field>
                                                <v-card-actions>
                                                    <v-btn @click="forgotDialog = false" color="red">cancel</v-btn>
                                                    <v-spacer />
                                                    <v-btn @click="forgotPassword" color="green">send</v-btn>
                                                </v-card-actions>
                                            </v-container>
                                        </v-card>
                                    </v-dialog>
                                </v-card-text>
                                <v-divider />
                                <v-card-text>
                                    <v-btn @click="forgotDialog = true" color="yellow" class="black--text">Forgot my password</v-btn>
                                </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
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
        forgotEmail: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",

        isLoggedIn: false,
        createDialog: false,
        notifDialog: false,
        forgotDialog: false,

        notifTitle: "notification title",
        notifMsg: "notification message",

        requiredRules: [
            v => !!v || 'Field is required',
        ],
        emailRules: [
            v => !!v || 'Email is required',
            v => (v.endsWith("@gvsu.edu")) || 'Must be a valid gvsu email',
        ],
    }),
    methods: {
        login() {
            AppAuth.signInWithEmailAndPassword(this.email, this.password)
                .then((u) => {
                    //console.log("You logged in as ", u.user);
                    if(!u.emailVerified) {
                        this.notifTitle = "Verify Account"
                        this.notifMsg = "You need to verify your account via email first."
                        this.notifDialog = true
                    }
                })
                .catch((err) => {
                    this.notifTitle = "Login Failed"
                    this.notifMsg = err.message
                    this.notifDialog = true
                });
        },
        createAccount() {
            if(this.$refs.form.validate()) {
                AppAuth.createUserWithEmailAndPassword(this.newAccountEmail, this.newAccountPassword)
                    .then((user) => {
                        //console.log("User created with UID " + user.user.uid)
                        AppDB.ref('users/' + user.user.uid).set({
                            firstName: this.firstName,
                            lastName: this.lastName,
                        })
                        this.createDialog = false
                    }).then(() => {
                        let user = AppAuth.currentUser;
                        user.sendEmailVerification().then(() => {
                            this.notifTitle = "Verify Account"
                            this.notifMsg = "An email has been sent to your GVSU email. Please click the link in the sent email to verify your account before logging in."
                            this.notifDialog = true
                        }).catch((err) => {
                            alert("failed to send email: " + err)
                        })
                    })
                    .catch((err) => {
                        this.notifTitle = "Account Creation Error"
                        this.notifMsg = err.message
                        this.notifDialog = true
                        //console.log("Error: " + err.message);
                    });
            }
        },
        forgotPassword() {
            AppAuth.sendPasswordResetEmail(this.forgotEmail).then(() => {
                this.notifTitle = "Password Reset Request"
                this.notifMsg = "An email for a password reset request has been sent to " + this.forgotEmail
                this.forgotDialog = false
            }).catch((err) => {
                this.notifTitle = "Password Reset Error"
                this.notifMsg = err.message
            }).finally(() => {
                this.notifDialog = true
            })
        },
        logout() {
            AppAuth.signOut().then(() => {
                console.log("Signed out");
            });
        },
    },
    computed: {
        confirmPass() {
            return () => (this.newAccountPassword === this.confirmPassword) || 'Password does not match'
        },
    },
    mounted() {
        AppAuth.onAuthStateChanged((u) => {
            if (u == null) {
                console.log("not logged in")
                this.isLoggedIn = false
            }
            else if(!u.emailVerified) {
                console.log("Email not verified")
                this.logout()
            }
            else {
                //console.log(u)
                //console.log("is logged in as: " + u.uid)
                this.isLoggedIn = true
                this.$router.push({ name: "Viewer" }).catch((e) => {
                    console.log('login router error: ', e);
                })
            }
        });
    },
}
</script>
