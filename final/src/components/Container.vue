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
            <v-btn color="blue" @click="prevStep">Back</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="blue" @click="nextStep">Continue</v-btn>
        </v-footer>
    </v-app>
</template>

<script>
import Location from './Location'

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
    },
}
</script>

<style>
.fill-width {
    width: 100%;
}

</style>
