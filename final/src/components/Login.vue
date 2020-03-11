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
                                <v-toolbar-title>Login/Signup</v-toolbar-title>
                            </v-toolbar>
                            <v-container class="pa-8">
                                <v-card-text>
                                    <v-form>
                                        <v-text-field label="Login" v-model="email"></v-text-field>
                                        <v-text-field label="Password" v-model="password" type="password"></v-text-field>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer />
                                        <v-btn color="blue">Login</v-btn>
                                    <v-spacer />
                                    </v-card-actions>
                                </v-container>
                                <v-divider />
                                <v-card-text>
                                    <v-btn color="green">Create new account</v-btn>
                                </v-card-text>
                                <v-divider />
                                <v-card-text>
                                    <v-btn color="yellow" class="black--text">Forgot my password</v-btn>
                                </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-container>
</template>


<script>
export default {
    name: 'Login',
    components: {
    },
    data: () => ({
        email: "",
        password: "",
    }),
}
</script>
