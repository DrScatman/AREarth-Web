<template>
    <v-container fluid>
        <v-toolbar-title class="text-uppercase font-weight-bold">Select a Location</v-toolbar-title>
        <template v-for="(location,index) in locations" class="">
            <v-card @click.stop="selectLocation(index)" :class="{selected: index === selectedLocation}" class="pa-2 ma-2" :key="index">
                <v-card-title>{{location.name}}</v-card-title>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-card-text>{{location.description}}</v-card-text>
                    <v-spacer></v-spacer>
                    <v-btn @click.stop="previewLocation(index)" color="blue">Preview</v-btn>
                </v-card-actions>
            </v-card>
        </template>
        <v-dialog v-model="previewDialog" max-width="1000" fluid eager>
            <v-card>
                <v-card-title>{{previewLocationName}}</v-card-title>
                <v-divider></v-divider>
                <v-container id="viewer" fluid>
                    <canvas class="fill-height fill-width" id="webgl-canvas"></canvas>
                </v-container>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="previewDialog = false" color="blue">done</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>

import {
    WebGLRenderer,
    PerspectiveCamera,
    sRGBEncoding,
    Scene,
    BoxGeometry,
    //MeshPhongMaterial,
    Mesh,
    HemisphereLight,
    MeshNormalMaterial
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
    name: 'Location',
    components: {
    },
    data: () => ({
        previewDialog: false,
        previewLocationName: "",

        renderer: null,
        camera: null,
        controls: null,
        scene: null,
    }),
    methods: {
        init() {
            let canvas = document.querySelector("#webgl-canvas")
            let viewer = document.querySelector("#viewer")
            this.scene = new Scene()

            let hemis = new HemisphereLight(0xffffbb, 0x080820, 1);
            this.scene.add(hemis);
            let geometry = new BoxGeometry(2, 2, 2)
            let material = new MeshNormalMaterial()
            let cube = new Mesh(geometry, material)
            this.scene.add(cube)

            let w = viewer.clientWidth
            let h = viewer.clientHeight
            this.camera = new PerspectiveCamera(70, w/h, 0.01, 10000)
            this.camera.position.set(3, 3, 3)
            this.renderer = new WebGLRenderer({canvas: canvas, antialias: true})
            this.renderer.setClearColor(0x0, 1);
            this.renderer.outputEncoding = sRGBEncoding;
            this.renderer.setSize(w, h, false)
            this.controls = new OrbitControls(this.camera, this.renderer.domElement)
            this.controls.enablePan = false
            this.controls.enableZoom = false
            this.controls.autoRotate = true
            this.controls.update()
        },
        animate() {
            requestAnimationFrame(this.animate)
            this.controls.update()
            this.renderer.render(this.scene, this.camera)
        },
        previewLocation(loc) {
            this.previewDialog = true
            this.previewLocationName = this.locations[loc].name
            this.$nextTick(() => {
                let viewer = document.querySelector("#viewer")
                let w = viewer.clientWidth
                let h = viewer.clientHeight
                this.camera.aspect = w/h
                this.camera.updateProjectionMatrix()
                this.renderer.setSize(w, h, false)
                console.log(this.locations)
                //this.scene.background = 
            })
            console.log("preview location: ", loc)
        },
        selectLocation(loc) {
            this.$store.commit('setSelectedLocation', loc)
            console.log(this.selectedLocation)
        },
        onWindowResize() {
            let viewer = document.querySelector("#viewer")
            if(viewer) {
                let w = viewer.clientWidth
                let h = viewer.clientHeight
                this.camera.aspect = w/h
                this.camera.updateProjectionMatrix()
                this.renderer.setSize(w, h, false)
            }
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.init()
            this.animate()
        })
        window.addEventListener('resize', this.onWindowResize, false)
    },
    computed: {
        locations() {
            return this.$store.getters.locations
        },
        selectedLocation() {
            return this.$store.getters.selectedLocation
        },
    },
}
</script>

<style>

.selected {
    background-color: lightblue !important;
    color: black !important;
}

#viewer {
    height: 600px;
    width: 1000px;
}

</style>
