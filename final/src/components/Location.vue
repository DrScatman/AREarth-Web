<template>
    <v-container fluid>
        <v-toolbar-title class="text-uppercase font-weight-bold">Select Location</v-toolbar-title>
        <template v-for="(location,index) in locations" class="">
            <v-card @click="selected = location" :class="{selected: location === selected}" class="pa-2 ma-2" :key="index">
                <v-card-title>{{location}}</v-card-title>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-card-text>Description: {{location}}</v-card-text>
                    <v-spacer></v-spacer>
                    <v-btn @click="previewLocation(location)" color="blue">Preview</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-container>
</template>

<script>

export default {
    name: 'Location',
    components: {
    },
    data: () => ({
        locations: ['l1', 'l2', 'l3', 'l4', 'l5'],
        selected: "",
    }),
    methods: {
        previewLocation(loc) {
            console.log("preview location: " + loc)
        }
    },
    mounted() {
    },
}
</script>

<style>

.selected {
    background-color: lightblue !important;
    color: black !important;
}
</style>
