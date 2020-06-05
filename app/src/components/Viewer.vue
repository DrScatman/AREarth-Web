<template>
    <v-container class="fill-height" fluid>
        <v-container id="viewer" class="fill-height ma-0 pa-0" fluid>
            <canvas id="webgl-canvas"></canvas>
        </v-container>
        <v-container>
            sidebar
        </v-container>
    </v-container>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
//import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

import {
    WebGLRenderer,
    PerspectiveCamera,
    BoxGeometry,
    MeshPhongMaterial,
    Mesh,
    LoadingManager,
    CubeTextureLoader,
//    MeshStandardMaterial,
    HemisphereLight,
    Scene,
    //sRGBEncoding,
} from 'three'

//import vue2Dropzone from 'vue2-dropzone'

import { Storage, AppAuth } from './db-init.js'

export default {
    name: 'Viewer',
    components: {
        //vueDropzone: vue2Dropzone
    },
    data: () => ({
        primaryModel: null,

        scene: null,
        camera: null,
        renderer: null,
        controls: null,

        currentTab: null,
        currentLocation: null,
        helpDialog: false,
        uploadDialog: false,
        loadingModel: false,

        loaders: {
            manager: null,
            gltf: null,
            obj: null,
            mtl: null,
            cubemap: null,
        },

        fileMap: new Map(),
        primaryFileName: null,
        mtlFileName: "",
        fileExt: null,
        missingFiles: [],

        currentCubemap: null,

        storageRef: Storage.ref(),

        dropzoneOptions: {
            url: "no_post",
            autoProcessQueue: false,
            acceptedFiles: ".obj,.mtl,.gltf,.bin,.glb,image/png,image/jpeg,image/jpg",
        },
    }),

    methods: {
        init() {
            this.addListeners()
            this.instantiateLoaders()
            this.setupScene()
            this.addDefaultCube()
        },
        animate() {
            requestAnimationFrame(this.animate)
            this.controls.update()
            this.renderer.render(this.scene, this.camera)
        },
        onWindowResize() {
            console.log('resized')
            let viewer = document.querySelector("#viewer")
            let w = viewer.clientWidth
            let h = viewer.clientHeight
            this.camera.aspect = w/h
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(w, h, false)
        },
        addListeners() {
            window.addEventListener('resize', this.onWindowResize, false)
        },
        addDefaultCube() {
            let geometry = new BoxGeometry(2, 2, 2)
            let material = new MeshPhongMaterial()
            this.primaryModel = new Mesh(geometry, material)
            this.camera.position.set(2, 2, 2)
            this.scene.add(this.primaryModel)
        },
        instantiateLoaders() {
            this.loaders.manager = new LoadingManager()
            this.loaders.gltf = new GLTFLoader(this.loaders.manager)
            this.loaders.obj = new OBJLoader(this.loaders.manager);
            this.loaders.mtl = new MTLLoader(this.loaders.manager);
            this.loaders.cubemap = new CubeTextureLoader();
        },
        setupScene() {
            let canvas = document.querySelector("#webgl-canvas")
            console.log('canvas',canvas)
            let viewer = document.querySelector("#viewer")
            console.log('viewer',viewer)
            let w = 400 //viewer.clientWidth
            let h = 400 //viewer.clientHeight
            console.log(w,h)
            this.camera = new PerspectiveCamera(70, w/h, 0.01, 10000)
            this.camera.position.set(2, 2, 2)
            this.scene = new Scene()
            let hemis = new HemisphereLight(0xffffbb, 0x080820, 1);
            this.scene.add(hemis);

            this.renderer = new WebGLRenderer({canvas: canvas, antialias: true})
            this.renderer.setClearColor(0x777799, 1);
            this.renderer.outputEncoding = THREE.sRGBEncoding;
            this.renderer.setSize(w, h, false)

            this.controls = new OrbitControls(this.camera, this.renderer.domElement)
            this.controls.enablePan = false
            this.controls.update()
        },
        setCameraToModel() {
            const box = new THREE.Box3().setFromObject(this.primaryModel);
            const radius = box.getBoundingSphere(new THREE.Sphere()).radius;
            this.camera.position.set(radius, radius/4, radius)
        },
        centerModel() {
            const box = new THREE.Box3().setFromObject(this.primaryModel);
            const center = box.getCenter(new THREE.Vector3());
            this.primaryModel.position.x += (this.primaryModel.position.x - center.x);
            this.primaryModel.position.y += (this.primaryModel.position.y - center.y);
            this.primaryModel.position.z += (this.primaryModel.position.z - center.z);
        },
    },
    mounted() {
        //fixes canvas centering issue
        console.log("before update called")
        this.$nextTick(() => {
            this.init()
            this.animate()
        })
    },
    created() {
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
    },
    computed: {
        selectedLocation() {
            let viewer = document.querySelector("#viewer")
            console.log("selcted location")
            console.log(viewer.clientWidth)
            console.log(viewer.clientHeight)
            return this.$store.getters.selectedLocation
        },
    },
}
</script>

<style>

::-webkit-scrollbar {
    display: none;
}

.tab-hover:hover::before {
    background-color: #C6FF00;
}

.v-tab:hover {
    /* I don't know how else to get it to color the font black */
    color: black !important;
    background-color: #C6FF00;
}

.v-tab {
    border: 1px solid grey;
}

.v-expansion-panel-content__wrap {
    background-color: #333333;
}

.v-expansion-panel p {
    margin-top: 12px;
}

.dz-progress {
    display: none;
}

#dropzone {
    min-height: 50vh;
}

.dz-drag-hover {
    background-color: lightgreen !important;
}

.rounded-border {
    border-radius: 10px;
}

.dropzone-custom-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.dropzone-custom-title {
    margin-top: 0;
    color: #00b782;
}

.subtitle {
    color: #314b5f;
}

</style>
