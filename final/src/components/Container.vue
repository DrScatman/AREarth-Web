<template>
    <v-app>
        <v-app-bar app height="100" src="./images/showcase.jpg">
            <template v-slot:img="{ props }">
                <v-img v-bind="props" position="center" gradient="to top right, rgba(20,20,100,0.8), rgba(100,200,200,1.0)"></v-img>
            </template>
            <v-toolbar-title class="text-uppercase display-1 font-weight-bold">
                Extended Reality Gallery
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="yellow" class="black--text mx-4">logout</v-btn>
            <v-btn color="red">help</v-btn>
        </v-app-bar>
        <v-content>
            <v-container class="fill-height">
                <v-stepper class="fill-height fill-width" v-model="step">
                    <v-stepper-header>
                        <template v-for="index in steps.length">
                            <v-stepper-step :key="`key-${index}`" :complete="step > index" :step="index">{{ steps[index-1] }}</v-stepper-step>
                            <v-divider :key="index"></v-divider>
                        </template>
                    </v-stepper-header>
                    <v-stepper-items >
                        <v-stepper-content step="1">
                            <Location />
                        </v-stepper-content>

                        <v-stepper-content step="2">
                            Viewer Component here
                        </v-stepper-content>

                        <v-stepper-content step="3">
                            step 3
                        </v-stepper-content>

                        <v-stepper-content step="4">
                            step4
                        </v-stepper-content>
                    </v-stepper-items>
                </v-stepper>
            </v-container>
        </v-content>
        <v-footer app height="75">
            <v-btn color="blue" @click="prevStep" :disabled="step < 2">Back</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="blue" @click="nextStep" :disabled="step === steps.length">Continue</v-btn>
        </v-footer>
    </v-app>
</template>

<script>
import Location from './Location'
import { AppDB, Storage } from './db-init.js'

export default {
    name: 'Container',
    components: {
        Location,
    },
    data: () => ({
        step: 1,
        steps: ['Choose Location', 'Upload Model', 'Modify Model', 'Finish'],
    }),
    methods: {
        nextStep() {
            if(this.step < this.steps.length) {
                this.step += 1
            }
        },
        prevStep() {
            if(this.step > 1) {
                this.step -= 1
            }
        }
    },
    mounted() {
        //logged in out listeners
        /*
        AppAuth.onAuthStateChanged((u) => {
            if (u == null) {
                console.log("viewer - not logged in")
                this.$router.push({ name: "Login" }).catch(e => {
                    console.log('viewer push error:' + e);
                })
            }
            else {
                console.log("viewer - is logged in as: " + u.uid)
                this.isLoggedIn = true
            }
        });
        */

        AppDB.ref('/locations/').once('value').then((snapshot) => {
            let locations = snapshot.val()
            this.$store.commit('setLocations', locations)
        }).then(() => {
            console.log("ignore", Storage)
            /*
            const locations = this.$store.getters.locations
            const keys = Object.keys(locations)
            keys.forEach((key) => {
                let p1 = Storage.ref().child(`cubemaps/${key}/px.png`).getDownloadURL()
                let p2 = Storage.ref().child(`cubemaps/${key}/nx.png`).getDownloadURL()
                let p3 = Storage.ref().child(`cubemaps/${key}/py.png`).getDownloadURL()
                let p4 = Storage.ref().child(`cubemaps/${key}/ny.png`).getDownloadURL()
                let p5 = Storage.ref().child(`cubemaps/${key}/pz.png`).getDownloadURL()
                let p6 = Storage.ref().child(`cubemaps/${key}/nz.png`).getDownloadURL()
                Promise.all([p1, p2, p3, p4, p5, p6]).then((urls) => {
                    if(urls.length == 6) {
                        let payload = { location: key, urls: urls }
                        this.$store.commit('setLocationCubemap', payload)
                    }
                }).catch((err) => {
                    console.log("Error: ", err)
                })
            })
            */
        })
    },
}
</script>

<style>
.fill-width {
    width: 100%;
}

</style>
