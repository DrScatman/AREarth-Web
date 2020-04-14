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
            <v-btn color="yellow" @click="logout" class="black--text mx-4">logout</v-btn>
            <v-btn color="red" @click="helpDialog = !helpDialog">help</v-btn>
            <v-dialog v-model="helpDialog" max-width="1200">
                <v-card class="pa-4">
                    <v-card-title>Help Menu</v-card-title>
                    <v-card-text>
                        What do you need help with?
                    </v-card-text>
                    <v-expansion-panels accordion focusable inset>
                        <v-expansion-panel>
                            <v-expansion-panel-header>I am lost or confused</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <p>Follow this tutorial!</p>
                                <p>Could be a youtube video or a gif</p>
                                <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/ZvQEHLA1o8M" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel>
                            <v-expansion-panel-header>Uploading a model</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <p>Follow this tutorial!</p>
                                <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/2kWupMxAmDA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel>
                            <v-expansion-panel-header>Issue 3</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <p>Follow this tutorial!</p>
                                <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/L1S-RkuQxxo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel>
                            <v-expansion-panel-header>Issue 4</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <p>Follow this tutorial!</p>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <v-divider class="my-4"></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn large color="green" @click.stop="helpDialog = false">Done</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

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
                    <v-stepper-items class="">
                        <v-stepper-content step="1">
                            <Location />
                        </v-stepper-content>

                        <v-stepper-content class="pa-0 ma-0" step="2">
                            <v-container class="d-flex">
                                <v-container id="viewer">
                                    <canvas id="webgl-canvas" class=""></canvas>
                                </v-container>
                                <v-container class="sidebar">
                                    <v-card>
                                        <v-card-title>Upload</v-card-title>
                                        <v-divider></v-divider>
                                        <v-card-actions>
                                            <v-btn v-if="!fileUploaded" x-large class="glow ma-2 white--text" @click="uploadDialog = true">
                                                upload model
                                            </v-btn>
                                            <v-btn color="yellow" v-else x-large class="ma-2 black--text" @click="changeModel">
                                                change model
                                            </v-btn>
                                        </v-card-actions>
                                        <v-divider></v-divider>
                                        <v-card-text v-if="!fileUploaded">Please upload a model</v-card-text>
                                        <v-container v-else fluid>
                                            <v-card-subtitle>Model Information:</v-card-subtitle>
                                            <v-card-text class="py-0">
                                                File type: {{fileExt}}
                                            </v-card-text>
                                            <v-card-text class="py-0">
                                                File Uploaded: {{primaryFileName}}
                                            </v-card-text>
                                            <v-card-text class="py-0">
                                                Triangles: {{renderer.info.render.triangles}}
                                            </v-card-text>
                                        </v-container>
                                        <v-dialog v-model="uploadDialog" max-width="1200">
                                            <v-card>
                                                <v-overlay z-index="9999" absolute v-model="loadingModel">
                                                    <p class="pa-4 text-center black lime--text lighten-3 display-2  rounded-border">Loading assets please wait
                                                    <v-progress-circular indeterminate color="lime accent-3" width="15" size="100">
                                                    </v-progress-circular>
                                                    </p>
                                                </v-overlay>

                                                <v-card-title>Upload</v-card-title>
                                                <v-divider class="my-4"></v-divider>
                                                <v-card-subtitle>Supported model formats: glTF, glb, obj (obj + mtl), fbx</v-card-subtitle>
                                                <v-card-subtitle class="red--text" v-if="missingFiles.length > 0" v-model="missingFiles">Missing Files: {{missingFiles.toString().replace(/,/g, ", ")}}</v-card-subtitle>
                                                <v-card-subtitle class="light-green--text" v-if="fileUploaded && missingFiles.length === 0">Success!</v-card-subtitle>

                                                <vue-dropzone ref="dropzone" id="dropzone" :options="dropzoneOptions" @vdropzone-file-added="vFilesAdded" useCustomSlot>
                                                    <div class="dropzone-custom-content">
                                                        <h3 class="dropzone-custom-title">Drag and drop to upload content!</h3>
                                                        <div class="subtitle">...or click to select a file from your computer</div>
                                                    </div>
                                                </vue-dropzone>
                                                <v-card-actions>
                                                    <v-btn color="error" @click="removeAllFiles">Remove all files</v-btn>
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="success" @click="uploadDialog = false">Done</v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>

                                    </v-card>
                                    <v-card class="mt-4">
                                        <v-card-title>Controls:</v-card-title>
                                        <v-card-text>1. Click and hold viewport to rotate camera</v-card-text>
                                        <v-card-text>2. Scroll wheel to zoom in and out</v-card-text>
                                    </v-card>
                                </v-container>
                            </v-container>
                        </v-stepper-content>

                        <v-stepper-content step="3" class="pa-0 ma-0">
                            <v-container class="d-flex">
                                <v-container id="viewer-modify">
                                    <canvas id="webgl-canvas-modify" class=""></canvas>
                                </v-container>
                                <v-container class="sidebar">
                                    <v-card>
                                        <v-card-title>Modify</v-card-title>
                                        <v-divider class="my-0"></v-divider>
                                        <v-container class="px-4 pt-0" fluid>
                                            <v-switch class="py-0" label="Show Floor" v-model="showFloor" @click.stop="toggleFloor"></v-switch>
                                            <v-switch  class="py-0" label="Show Model Axes" v-model="showAxes" @click.stop="toggleAxes"></v-switch>
                                            <v-switch  class="py-0" label="Show Anchor Location" v-model="showAnchor" @click.stop="toggleAnchor"></v-switch>
                                            <v-switch  class="py-0" label="Show Person (~6ft)" v-model="showCharacter" @click.stop="toggleCharacter"></v-switch>
                                            <v-slider label="Model Scale" class="py-0" v-model="scale" min="1" max="1000"></v-slider>
                                            <v-slider label="Position X" class="py-0" v-model="positionX" min="-1000" max="1000" ></v-slider>
                                            <v-slider label="Position Y" class="py-0" v-model="positionY" min="-1000" max="1000" ></v-slider>
                                            <v-slider label="Position Z" class="py-0" v-model="positionZ" min="-1000" max="1000" ></v-slider>
                                            <v-slider label="Rotate X" class="py-0" v-model="rotationX" min="-180" max="180" ></v-slider>
                                            <v-slider label="Rotate Y" class="py-0" v-model="rotationY" min="-180" max="180" ></v-slider>
                                            <v-slider label="Rotate Z" class="py-0" v-model="rotationZ" min="-180" max="180" ></v-slider>
                                        </v-container>
                                    </v-card>
                                </v-container>
                            </v-container>
                        </v-stepper-content>

                        <v-stepper-content step="4">
                            <v-card class="pa-4">
                                <v-card-title>Almost there!</v-card-title>
                                <v-divider></v-divider>
                                <v-container class="pa-4" fluid>
                                    <v-form>
                                        <v-card-text>Give a meaningful name to the model:</v-card-text>
                                        <v-text-field label="Model Name" outlined v-model="userModelName"></v-text-field>
                                        <v-card-text>Give a description for users to read:</v-card-text>
                                        <v-textarea label="Model Description" outlined v-model="userModelDescription"></v-textarea>
                                        <v-card-text>When you are happy with your model click submit</v-card-text>
                                        <v-spacer></v-spacer>
                                        <v-btn color="green" @click="saveToDatabase">submit</v-btn>
                                    </v-form>
                                </v-container>
                                <v-overlay v-model="databaseOverlay" opacity="0.8">
                                    Saving to database please wait... {{uploadProgress}}%
                                </v-overlay>
                            </v-card>
                        </v-stepper-content>
                    </v-stepper-items>
                </v-stepper>
            </v-container>
        </v-content>
        <v-footer app height="75">
            <v-btn color="blue" @click="prevStep" x-large :disabled="step < 2">back</v-btn>
            <v-spacer></v-spacer>
            <v-btn :class="{ glow: !canNextStep }" x-large @click="nextStep" :disabled="canNextStep">continue</v-btn>
        </v-footer>
    </v-app>
</template>

<script>
import Location from './Location'

import { AppDB, Storage, AppAuth } from './db-init.js'

import {
    WebGLRenderer,
    PerspectiveCamera,
    BoxGeometry,
    MeshPhongMaterial,
    MeshStandardMaterial,
    Mesh,
    LoadingManager,
    CubeTextureLoader,
    HemisphereLight,
    sRGBEncoding,
    Box3,
    Sphere,
    Vector3,
    AxesHelper,
    Group,
    CanvasTexture,
    LinearFilter,
    ClampToEdgeWrapping,
    GridHelper,
} from 'three'

import character from './models/character.glb'
import { lobby_urls } from './cubemaps.js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

import vue2Dropzone from 'vue2-dropzone'

export default {
    name: 'Container',
    components: {
        Location,
        vueDropzone: vue2Dropzone,
    },
    data: () => ({
        step: 1,
        steps: ['Choose Location', 'Upload Model', 'Modify Model', 'Finish'],

        camera: null,
        renderer: null,
        controls: null,
        modifyRenderer: null,

        helpDialog: false,
        uploadDialog: false,
        loadingModel: false,
        databaseOverlay: false,

        loaders: {
            manager: null,
            gltf: null,
            obj: null,
            mtl: null,
            fbx: null,
            cubemap: null,
        },

        fileMap: new Map(),
        primaryModel: null,
        primaryFileName: null,
        mtlFileName: "",
        fileExt: null,
        missingFiles: [],
        fileUploaded: false,

        defaultCubemapTexture: null,
        character: character,
        showFloor: false,
        showAxes: false,
        showCharacter: false,
        showAnchor: false,
        floor: null,
        axes: null,
        anchor: null,
        scale: 100,
        modelHeight: 0,
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,

        userModelName: "",
        userModelDescription: "",
        uploadProgress: 0,

        dropzoneOptions: {
            url: "no_post",
            autoProcessQueue: false,
            //this method does not work in firefox as it doesn't infer the file type
            //acceptedFiles: ".obj,.mtl,.gltf,.bin,.glb,.fbx,.ma,image/png,image/jpeg,image/jpg",

            //this is the solution
            accept: (file, done) => {
                const acceptedExts = [
                    'jpeg', 'jpg', 'png', 'tga',
                    'obj', 'mtl', 'gltf', 'glb',
                    'fbx','bin', 'ma'
                ]
                let ext = file.name.split('.').pop()
                if(acceptedExts.includes(ext)) {
                    done()
                }
                else {
                    done("File type not accepted")
                }
            },
        }
    }),
    methods: {
        nextStep() {
            if(this.step === 1) {
                //check to see if a urls exists
                let loc = this.locations[this.selectedLocation]
                //console.log(this.locations)

                if(loc['texture']) {
                    console.log("texture is already loaded use that")
                    this.scene.background = this.locations[this.selectedLocation]['texture']
                }
                else {
                    if(loc['urls']) {
                        console.log("no texture but urls to load")
                        let texture = this.loaders.cubemap.load([
                            loc['urls'][0],
                            loc['urls'][1],
                            loc['urls'][2],
                            loc['urls'][3],
                            loc['urls'][4],
                            loc['urls'][5],
                        ], () => {
                            let payload = {location: this.selectedLocation, texture: texture}
                            this.$store.commit('setLocationCubemapTexture', payload)
                            this.scene.background = texture
                        })
                    }
                    else {
                        this.scene.background = null
                        console.log("no urls to use")
                    }
                }
            }
            if(this.step === 2) {
                this.clearFileMap()
            }
            if(this.step < this.steps.length) {
                this.step += 1
            }
        },
        prevStep() {
            if(this.step > 1) {
                this.step -= 1
            }
        },

        init() {
            this.addListeners()
            this.instantiateLoaders()
            this.configureURLOverride()
            this.setupScene()
            this.setupModifyScene()
            this.addDefaultCube()
            this.setDefaultCubemapTexture()
        },
        animate() {
            requestAnimationFrame(this.animate)
            this.controls.update()
            this.modifyControls.update()
            this.renderer.render(this.scene, this.camera)
            this.modifyRenderer.render(this.scene, this.camera)
        },
        setupModifyScene() {
            let canvas = document.querySelector("#webgl-canvas-modify")
            this.modifyRenderer = new WebGLRenderer({canvas: canvas, antialias: true})
            this.modifyRenderer.setClearColor(0x777799, 1);
            this.modifyRenderer.outputEncoding = sRGBEncoding;

            let viewer = document.querySelector("#viewer")
            let w = viewer.clientWidth
            let h = viewer.clientHeight

            //let geo = new PlaneGeometry(1000,1000);
            //geo.rotateX(-Math.PI/2)
            //let mat = new MeshBasicMaterial({color: 0x777777 , side: DoubleSide})
            //this.floor= new Mesh(geo, mat)
            this.axes = new AxesHelper(2)
            this.axes.visible = false
            this.anchor = new AxesHelper(100)
            //let sphereGeo = new SphereGeometry(0.1)
            //let sphereMat = new MeshBasicMaterial({color: 0xFF0000})
            //this.anchor = new Mesh(sphereGeo, sphereMat)
            this.anchor.visible = false
            //this.worldAxes.visible = false
            //this.scene.add(this.worldAxes)
            this.scene.add(this.anchor)
            //this.floor.visible = false
            //this.scene.add(this.floor)

            this.modifyControls = new OrbitControls(this.camera, this.modifyRenderer.domElement)
            this.modifyControls.update()
            this.modifyRenderer.setSize(w, h, false)
        },
        onWindowResize() {
            if(this.step === 2) {
                let viewer = document.querySelector("#viewer")
                let w = viewer.clientWidth
                let h = viewer.clientHeight
                this.camera.aspect = w/h
                this.camera.updateProjectionMatrix()
                this.renderer.setSize(w, h, false)
            }
            if(this.step == 3) {
                let modifyViewer = document.querySelector("#viewer-modify")
                let w = modifyViewer.clientWidth
                let h = modifyViewer.clientHeight
                this.camera.aspect = w/h
                this.camera.updateProjectionMatrix()
                this.modifyRenderer.setSize(w, h, false)
            }
        },
        addListeners() {
            window.addEventListener('resize', this.onWindowResize, false)
        },
        addDefaultCube() {
            let geometry = new BoxGeometry(2, 2, 2)
            let t = this.createTextTexture("N O    M O D E L", 'red')
            t.repeat.set(1.25, 2.0)
            t.offset.set(-0.125, -0.5)
            let material = new MeshPhongMaterial({map: t})
            this.primaryModel = new Mesh(geometry, material)
            this.scene.add(this.primaryModel)
        },
        instantiateLoaders() {
            this.loaders.manager = new LoadingManager()
            this.loaders.gltf = new GLTFLoader(this.loaders.manager)
            this.loaders.fbx = new FBXLoader(this.loaders.manager)
            this.loaders.obj = new OBJLoader(this.loaders.manager);
            this.loaders.mtl = new MTLLoader(this.loaders.manager);
            this.loaders.cubemap = new CubeTextureLoader();
        },
        setupScene() {
            let canvas = document.querySelector("#webgl-canvas")
            let viewer = document.querySelector("#viewer")
            let w = viewer.clientWidth
            let h = viewer.clientHeight
            this.camera = new PerspectiveCamera(70, w/h, 0.01, 10000)
            this.camera.position.set(2, 2, 2)
            let hemis = new HemisphereLight(0xffffbb, 0x080820, 1);
            this.scene.add(hemis);

            this.loadCharacter()

            this.renderer = new WebGLRenderer({canvas: canvas, antialias: true})
            this.renderer.setClearColor(0x777799, 1);
            this.renderer.outputEncoding = sRGBEncoding;
            this.renderer.setSize(w, h, false)

            this.controls = new OrbitControls(this.camera, this.renderer.domElement)
            this.controls.enablePan = false
            this.controls.update()
        },
        setDefaultCubemapTexture() {
            this.defaultCubemapTexture = this.loaders.cubemap.load([
                    lobby_urls[0],
                    lobby_urls[1],
                    lobby_urls[2],
                    lobby_urls[3],
                    lobby_urls[4],
                    lobby_urls[5],
            ])
        },
        vFilesAdded() {
            //this.$nextTick(() => {
            this.loadingModel = true
            setTimeout(() => {
                //handle it as a bundle if possible
                let files = this.$refs.dropzone.getQueuedFiles()
                files.forEach((f) => {
                    if(f.name.endsWith(".obj") ||
                        f.name.endsWith(".fbx") ||
                        f.name.endsWith(".gltf") ||
                        f.name.endsWith(".glb")) {

                        this.primaryFileName = f.name
                        this.fileExt = this.primaryFileName.split(".").pop()
                    }
                    if(f.name.endsWith(".mtl")) {
                        this.mtlFileName = f.name
                    }
                    let url = URL.createObjectURL(f)
                    this.fileMap.set(f.name, url)
                })
                if(this.primaryFileName) {
                    //clear missing files
                    this.missingFiles = []
                    if(this.fileExt === "gltf" || this.fileExt === "glb") {
                        this.loadGLTF(this.primaryFileName)
                    }
                    else if(this.fileExt === 'fbx') {
                        this.loadFBX(this.primaryFileName)
                    }
                    else {
                        this.loadOBJ(this.primaryFileName, this.mtlFileName)
                    }
                }
            }, 1000)
            //})
        },
        changeModel() {
            this.uploadDialog = true
            this.clearFileMap()
            this.$refs.dropzone.removeAllFiles()
        },
        loadGLTF(url) {
            this.loaders.gltf.load(url, (gltf) => {
                this.scene.remove(this.primaryModel)
                this.primaryModel = gltf.scene

                //adjust the model
                this.normalizeModel()
                this.setCameraToModel()
                this.centerModel()

                //layer it so that the geometry is centered
                let group = new Group()
                group.add(this.primaryModel)
                this.primaryModel = group
                this.scene.add(this.primaryModel)

                this.primaryModel.traverse((child) => {
                    if(child.isMesh) {
                        //sometimes a mesh has a basicmaterial which will cause it to
                        //be completely reflective which is incorrect
                        if(child.material instanceof MeshStandardMaterial) {
                            if(this.scene.background) {
                                child.material.envMap = this.locations[this.selectedLocation]['texture']
                            }
                            else {
                                child.material.envMap = this.defaultCubemapTexture
                            }
                        }
                    }
                })
                this.primaryModel.add(this.axes)
                this.uploadDialog = false
                this.fileUploaded = true
                this.loadingModel = false
            }, (xhr) => {
                let percentLoaded = (xhr.loaded / xhr.total*100).toFixed(2)
                console.log(percentLoaded  + '% loaded');
            }, (error) => {
                console.log("Failed to load gltf model: " + error);
                this.loadingModel = false
            });
        },
        loadOBJ(obj, mtl) {
            this.loaders.mtl.load(mtl, (mat) => {
                this.loaders.obj.setMaterials(mat);

                this.loaders.obj.load(obj, (model) => {
                    this.scene.remove(this.primaryModel)
                    this.primaryModel = model

                    //adjust the model
                    this.normalizeModel()
                    this.setCameraToModel()
                    this.centerModel()

                    //layer it so that the geometry is centered
                    let group = new Group()
                    group.add(this.primaryModel)
                    this.primaryModel = group
                    this.scene.add(this.primaryModel)

                    this.primaryModel.traverse((child) => {
                        if(child.isMesh) {
                            //sometimes a mesh has a basicmaterial which will cause it to
                            //be completely reflective which is incorrect
                            if(child.material instanceof MeshStandardMaterial) {
                                child.material.envMap = this.locations[this.selectedLocation]['texture']
                            }
                        }
                    })

                    //clears before finish using
                    //this.clearFileMap()
                    this.uploadDialog = false
                    this.loadingModel = false
                    this.fileUploaded = true
                    this.primaryModel.add(this.axes)
                    //this.$refs.dropzone.disable()
                }, (xhr) => {
                    let percentLoaded = (xhr.loaded / xhr.total*100).toFixed(2)
                    console.log(percentLoaded  + '% loaded');
                    this.loadingModel = true
                }, (error) => {
                    console.log("Failed to load obj model: " + error);
                    this.loadingModel = false
                });
            }, (xhr) => {
                console.log((xhr.loaded / xhr.total*100).toFixed(2)  + '% loaded');
            }, (error) => {
                console.log("Failed to load mtl: " + error);
            });
        },
        loadFBX(url) {
            this.loaders.fbx.load(url, (model) => {
                this.scene.remove(this.primaryModel)
                this.primaryModel = model
                this.scene.add(this.primaryModel)

                this.setCameraToModel()
                //this.primaryModel.geometry.center()
                this.centerModel()
                this.primaryModel.traverse((child) => {
                    if(child.isMesh) {
                        //sometimes a mesh has a basicmaterial which will cause it to
                        //be completely reflective which is incorrect
                        if(child.material instanceof MeshStandardMaterial) {
                            child.material.envMap = this.locations[this.selectedLocation]['texture']
                        }
                    }
                })
                //this.primaryModel.add(this.axes)
                //this.clearFileMap()
                this.uploadDialog = false
                this.loadingModel = false
                this.fileUploaded = true
                //this.$refs.dropzone.disable()
            }, (xhr) => {
                let percentLoaded = (xhr.loaded / xhr.total*100).toFixed(2)
                console.log(percentLoaded  + '% loaded');
                this.loadingModel = true
            }, (error) => {
                console.log("Failed to load fbx model: " + error);
                this.loadingModel = false
            })

        },
        getBoxDimensions() {
            let box = new Box3().setFromObject(this.primaryModel)
            return box.getSize(new Vector3)
        },
        normalizeModel() {
            let dim = this.getBoxDimensions()
            let max = Math.max(dim.x, dim.y, dim.z)
            let s = 1.0/max
            this.primaryModel.scale.set(s,s,s)

        },
        configureURLOverride() {
            this.loaders.manager.setURLModifier((url) => {
                let filename = url.split("/").pop()
                let override = this.fileMap.get(filename)
                if(override) {
                    return override
                }
                //a fix to a weird bug where the glb file will continue looking
                //for more files even though it has already loaded in
                //I suspect it has to do with the nexttick method
                //or the url gets split based on file size
                if(this.fileExt != "glb") {
                    this.missingFiles.push(filename)
                }
                return url
            })
        },
        setCameraToModel() {
            const box = new Box3().setFromObject(this.primaryModel);
            const radius = box.getBoundingSphere(new Sphere()).radius;
            this.camera.position.set(radius, radius/4, radius)
        },
        centerModel() {
            const box = new Box3().setFromObject(this.primaryModel);
            const center = box.getCenter(new Vector3());
            this.primaryModel.position.x += (this.primaryModel.position.x - center.x);
            this.primaryModel.position.y += (this.primaryModel.position.y - center.y);
            this.primaryModel.position.z += (this.primaryModel.position.z - center.z);
            this.modelHeight = box.getSize(new Vector3).y.toFixed(2)
        },
        removeAllFiles() {
            this.$refs.dropzone.removeAllFiles()
            this.resetUploadState()
            //this.$refs.dropzone.enable()
        },
        resetUploadState() {
            this.scene.remove(this.primaryModel)

            //resets default values
            this.primaryFileName = null
            this.fileUploaded = false
            this.primaryModel = null
            this.fileExt = null
            this.mtlFileName = ""
            this.missingFiles = []
            this.camera.position.set(2, 2, 2)

            this.addDefaultCube()
            //this.clearFileMap()
        },
        clearFileMap() {
            //console.log("clearing")
            this.fileMap.forEach((url) => {
                //console.log("revoking url: ", url)
                URL.revokeObjectURL(url)
            })
            this.fileMap.clear()
        },
        toggleFloor() {
            if(!this.showFloor) {
                this.floor = new GridHelper(100, 100)
                this.scene.add(this.floor)
                this.showFloor = true
            }
            else {
                this.scene.remove(this.floor)
                this.showFloor = false
            }
        },
        toggleAxes() {
            if(!this.showAxes) {
                this.showAxes = true
                this.axes.visible = true
            }
            else {
                this.showAxes = false
                this.axes.visible = false
            }
        },
        toggleAnchor() {
            if(!this.showAnchor) {
                this.showAnchor = true
                //this.worldAxes.visible = true
                this.anchor.visible = true
            }
            else {
                this.showAnchor = false
                //this.worldAxes.visible = false
                this.anchor.visible = false
            }
        },
        toggleCharacter() {
            if(!this.showCharacter) {
                this.showCharacter = true
                this.character.visible = true
            }
            else {
                this.showCharacter = false
                this.character.visible = false
            }
        },
        scaleUpdate() {
            let s = this.scale/100.0
            this.primaryModel.scale.set(s, s, s)
            const box = new Box3().setFromObject(this.primaryModel);
            let dimensions = box.getSize(new Vector3)
            this.modelHeight = dimensions.y.toFixed(2)
        },
        updatePosition() {
            this.primaryModel.position.set(this.positionX/100.0, this.positionY/100.0, this.positionZ/100.0)
        },
        updateRotationX() {
            this.primaryModel.rotation.x = (this.rotationX*Math.PI)/180
        },
        updateRotationY() {
            this.primaryModel.rotation.y = (this.rotationY*Math.PI)/180
        },
        updateRotationZ() {
            this.primaryModel.rotation.z = (this.rotationZ*Math.PI)/180
        },
        logout() {
            AppAuth.signOut().then(() => {
                console.log("Signed out");
            });
        },
        saveToDatabase() {
            this.databaseOverlay = true
            const uid = AppAuth.currentUser.uid
            AppDB.ref(`users/${uid}/locations/${this.selectedLocation}`).set({
                fileName: this.userModelName + ".glb",
                description: this.userModelDescription
            }).then(() => {
                this.exportToStorage(uid)
            }).catch((err) => {
                this.databaseOverlay = false
                console.log("Error writing to realtime DB: " + err.message)
            })
        },
        exportToStorage(useruid) {
            if(this.primaryFileName) {
                const exporter = new GLTFExporter()
                const options = {
                    trs: true,
                    binary: true,
                }
                exporter.parse(this.primaryModel, (gltf) => {
                    this.primaryModel.remove(this.axes)
                    this.scene.remove(this.character)
                    this.scene.remove(this.anchor)

                    let buffer = new Uint8Array(gltf)
                    let directory = useruid
                    let uploadTask = Storage.ref().child(`${directory}/${this.userModelName}.glb`).put(buffer)
                    uploadTask.on('state_changed', (snapshot) => {
                        this.uploadProgress = Math.floor(((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
                    }, (error) => {
                        console.log("Upload Failed!" + error.message)
                    }, () => {
                        console.log("Upload success!")
/*
                        if('modelName' in this.locations[this.selectedLocation]) {
                            let oldModelName = this.locations[this.selectedLocation]['modelName']
                            Storage.ref().child(`${useruid}/${oldModelName}.glb`).delete().then(() => {
                                console.log(`Successfully deleted: ${oldModelName}.glb`)
                            }).catch((err) => {
                                console.log("Delete Error: " + err.message)
                            })
                        }
                        */
                        //this.step = 1
                        //this.databaseOverlay = false
                        //works for now but now the best way to do this
                        location.reload()
                    })
                }, options)
            }
            else {
                console.log("You can't upload the default cube!")
            }
        },
        createTextLabelCanvas(size, text, color) {
            const borderSize = 2
            const ctx = document.createElement('canvas').getContext('2d')
            const font = `${size}px Arial`
            ctx.font = font
            const width = ctx.measureText(text).width + borderSize*2
            const height = size + borderSize*2
            ctx.canvas.width = width
            ctx.canvas.height = height
            ctx.font = font
            ctx.textBaseline = 'top'
            ctx.fillStyle = color
            ctx.fillRect(0,0,width,height)
            ctx.fillStyle = 'white'
            ctx.fillText(text, borderSize, borderSize)
            return ctx.canvas
        },
        createTextTexture(text, color) {
            let c = this.createTextLabelCanvas(64, text, color)
            let texture = new CanvasTexture(c)
            texture.minFilter = LinearFilter
            texture.wrapS = ClampToEdgeWrapping
            texture.wrapT = ClampToEdgeWrapping
            //let labelMaterial = new SpriteMaterial({
            //    map: texture,
            //    transparent: true,
            //})
            //let label = new Sprite(labelMaterial)
            return texture
        },
        loadCharacter() {
            this.loaders.gltf.load(character, (gltf) => {
                this.character = gltf.scene
                this.character.position.set(0,0,-10)
                this.character.visible = false
                this.scene.add(this.character)
                this.missingFiles = []
            }, (xhr) => {
                let percentLoaded = (xhr.loaded / xhr.total*100).toFixed(2)
                console.log(percentLoaded  + '% loaded');
            }, (error) => {
                console.log("Failed to load gltf model: " + error);
            });

        },
    },
    computed: {
        locations() {
            return this.$store.getters.locations
        },
        selectedLocation() {
            return this.$store.getters.selectedLocation
        },
        canNextStep() {
            //disabled if the location hasn't been selected yet
            if(this.step === 1 && !this.selectedLocation) {
                return true
            }
            if(this.step === 2 && !this.fileUploaded) {
                return true
            }
            if(this.step === this.steps.length) {
                return true
            }
            return false
        },
        scene() {
            return this.$store.getters.scene
        },
    },
    updated() {
        this.onWindowResize()
    },
    watch: {
        scale() {
            this.scaleUpdate()
        },
        positionX () {
            this.updatePosition()
        },
        positionY () {
            this.updatePosition()
        },
        positionZ () {
            this.updatePosition()
        },
        rotationX () {
            this.updateRotationX()
        },
        rotationY () {
            this.updateRotationY()
        },
        rotationZ () {
            this.updateRotationZ()
        }

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
                //console.log("viewer - is logged in as: " + u.uid)
                this.isLoggedIn = true
            }
        });

        AppDB.ref('/locations/').once('value').then((snapshot) => {
            let locations = snapshot.val()
            this.$store.commit('setLocations', locations)
        }).then(() => {
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
                        this.$set(this.locations[key], 'urls', urls)
                    }
                    this.$forceUpdate()
                }).catch((err) => {
                    console.log("Error: ", err)
                })

                const uid = AppAuth.currentUser.uid
                //console.log(`/users/${uid}/locations/${key}`)
                AppDB.ref(`/users/${uid}/locations/${key}`).once('value').then((snapshot) => {
                    let modelInfo = snapshot.val()
                    //removes the .glb extension
                    if(modelInfo) {
                        //console.log(modelInfo)
                        let modelName = modelInfo.fileName
                        modelName = modelName.substring(0, modelName.length-4)
                        this.$set(this.locations[key], 'modelName', modelName)
                        console.log(this.locations[key])
                    }
                })
            })
        })
    },
    mounted() {
        this.init()
        this.animate()

    },
}
</script>

<style>

::-webkit-scrollbar {
    display: none;
}

.fill-width {
    width: 100%;
}

#viewer {
    max-height: 800px;
}

#webgl-canvas {
    width: 100%;
    height: 600px;
}

#webgl-canvas-modify {
    width: 100%;
    height: 600px;
}

canvas {
    width: 100%;
    height: 600px;
    outline: none;
}

.sidebar {
    max-width: 400px;
    min-width: 300px;
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

.small-textfield {
    width: 40px;
}

@keyframes glowing {
    0% { background-color: rgba(51, 204, 51, 1); }
    50% { background-color: rgba(31, 122, 31, 1); }
    100% { background-color: rgba(51, 204, 51, 1); }
}

.glow {
    animation: glowing 1s infinite;
}

</style>
