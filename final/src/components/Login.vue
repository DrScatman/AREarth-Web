<template>
  <v-app>
    <v-app-bar app height="70" src="./images/cartoonEarth.jpg">
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          position="center"
          gradient="to top right, rgba(255,255,255,0), rgba(100,200,255,1.0)"
        ></v-img>
      </template>
      <v-container>
        <v-row>
          <v-col class="text-center">
            <v-toolbar-title
              class="text display-3 font-weight-regular font-italic"
            >
              AREarth
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
                    <v-text-field
                      label="Email"
                      v-model="email"
                      placeholder="example@mail.com"
                    ></v-text-field>
                    <v-text-field
                      label="Password"
                      v-model="password"
                      type="password"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    v-if="!isLoggedIn"
                    @click="login"
                    color="blue"
                    class="px-8"
                    :disabled="!email || !password"
                    required
                    >Login</v-btn
                  >
                  <v-btn v-if="isLoggedIn" @click="logout" color="blue" required
                    >Signout</v-btn
                  >
                  <v-spacer />
                </v-card-actions>
              </v-container>
              <v-divider />
              <v-card-text>
                <v-btn @click="createDialog = true" color="green"
                  >Create new account</v-btn
                >
                <v-dialog v-model="createDialog" max-width="1000">
                  <v-card>
                    <v-toolbar>
                      <v-toolbar-title>Create new account</v-toolbar-title>
                    </v-toolbar>
                    <v-container class="pa-8">
                      <v-card-text>
                        <v-form ref="form">
                          <v-text-field
                            label="Username"
                            v-model="newUsername"
                            placeholder="username"
                            :rules="requiredRules"
                          ></v-text-field>
                          <v-text-field
                            label="Email"
                            v-model="newAccountEmail"
                            placeholder="example@mail.com"
                            :rules="requiredRules"
                          ></v-text-field>
                          <v-text-field
                            label="Password"
                            v-model="newAccountPassword"
                            type="password"
                            :rules="requiredRules"
                          ></v-text-field>
                          <v-text-field
                            label="Confirm Password"
                            v-model="confirmPassword"
                            type="password"
                            :rules="[confirmPass]"
                          ></v-text-field>
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn @click="createDialog = false" color="red"
                          >Cancel</v-btn
                        >
                        <v-spacer />
                        <v-btn @click="createAccount" color="green"
                          >Create Account</v-btn
                        >
                      </v-card-actions>
                    </v-container>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="notifDialog" max-width="600">
                  <v-card>
                    <v-toolbar>
                      <v-toolbar-title v-model="notifTitle">{{
                        notifTitle
                      }}</v-toolbar-title>
                    </v-toolbar>
                    <v-container class="pa-8">
                      <v-card-text v-model="notifMsg">{{
                        notifMsg
                      }}</v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn @click="notifDialog = false" color="green"
                          >ok</v-btn
                        >
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
                        Enter your email address below to get password reset
                        email:
                      </v-card-text>
                      <v-text-field
                        label="example@mail.com"
                        v-model="forgotEmail"
                      ></v-text-field>
                      <v-card-actions>
                        <v-btn @click="forgotDialog = false" color="red"
                          >cancel</v-btn
                        >
                        <v-spacer />
                        <v-btn @click="forgotPassword" color="green"
                          >send</v-btn
                        >
                      </v-card-actions>
                    </v-container>
                  </v-card>
                </v-dialog>
              </v-card-text>
              <v-divider />
              <v-card-text>
                <v-btn
                  @click="forgotDialog = true"
                  color="yellow"
                  class="black--text"
                  >Forgot my password</v-btn
                >
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import { AppDB, AppAuth } from "./db-init.js";
export default {
  name: "Login",
  data: () => ({
    email: "",
    password: "",
    newUsername: "",
    newAccountEmail: "",
    newAccountPassword: "",
    forgotEmail: "",
    confirmPassword: "",

    isLoggedIn: false,
    createDialog: false,
    notifDialog: false,
    forgotDialog: false,

    notifTitle: "notification title",
    notifMsg: "notification message",

    usernames: new Set(),
    requiredRules: [(v) => !!v || "Field is required"],
    emailRules: [(v) => !!v || "Email is required"],
  }),
  methods: {
    login() {
      AppAuth.signInWithEmailAndPassword(this.email, this.password)
        .then((u) => {
          //console.log("You logged in as ", u.user);
          if (!u.emailVerified) {
            this.notifTitle = "Verify Account";
            this.notifMsg = "You need to verify your account via email first.";
            this.notifDialog = true;
          }
        })
        .catch((err) => {
          this.notifTitle = "Login Failed";
          this.notifMsg = err.message;
          this.notifDialog = true;
        });
    },
    createAccount() {
      if (this.$refs.form.validate()) {
        if (this.usernames.has(this.newUsername)) {
          alert("Username taken");
          return;
        }
        AppAuth.createUserWithEmailAndPassword(
          this.newAccountEmail,
          this.newAccountPassword
        )
          .then((user) => {
            //console.log("User created with UID " + user.user.uid)
            AppDB.ref("users/" + user.user.uid)
              .set({
                email: AppAuth.currentUser.email,
                username: this.newUsername,
              })
              .catch((err) => {
                alert("Failed to add user info to database: " + err);
              });
            this.createDialog = false;
          })
          .then(() => {
            let user = AppAuth.currentUser;
            user
              .sendEmailVerification()
              .then(() => {
                this.notifTitle = "Verify Account";
                this.notifMsg =
                  "An email has been sent to your email. Please click the link in the sent email to verify your account before logging in.";
                this.notifDialog = true;
              })
              .catch((err) => {
                alert("Failed to send email: " + err);
              });
          })
          .catch((err) => {
            this.notifTitle = "Account Creation Error";
            this.notifMsg = err.message;
            this.notifDialog = true;
            console.log("Error: " + err.message);
          });
      }
    },
    forgotPassword() {
      AppAuth.sendPasswordResetEmail(this.forgotEmail)
        .then(() => {
          this.notifTitle = "Password Reset Request";
          this.notifMsg =
            "An email for a password reset request has been sent to " +
            this.forgotEmail;
          this.forgotDialog = false;
        })
        .catch((err) => {
          this.notifTitle = "Password Reset Error";
          this.notifMsg = err.message;
        })
        .finally(() => {
          this.notifDialog = true;
        });
    },
    logout() {
      this.$store.commit("clearAll");
      AppAuth.signOut().then(() => {
        console.log("Signed out");
      });
    },
    onUserAdded(snapshot) {
      var u = snapshot.val();
      if (u) {
        this.usernames.add(u.username);
      }
    },
  },
  computed: {
    confirmPass() {
      return () =>
        this.newAccountPassword === this.confirmPassword ||
        "Password does not match";
    },
    isUsernameTaken(username) {
      return () => this.usernames.has(username);
    },
  },
  mounted() {
    AppAuth.onAuthStateChanged((u) => {
      if (u == null) {
        console.log("not logged in");
        this.isLoggedIn = false;
      } else if (!u.emailVerified) {
        console.log("Email not verified");
        this.logout();
      } else {
        this.isLoggedIn = true;
        this.$router.push({ name: "Container" }).catch((e) => {
          console.log("login router error: ", e);
        });
      }
    });

    AppDB.ref("users").on("child_added", this.onUserAdded);
  },
};
</script>
