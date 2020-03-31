<template>
    <v-container fluid>
        <v-content class="fill-height">
            <v-container id="viewer" class="fill-height ma-0 pa-0" fluid>
                <canvas id="webgl-canvas"></canvas>
            </v-container>
        </v-content>
    </v-container>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

//import vue2Dropzone from 'vue2-dropzone'

import { Storage, AppAuth } from './db-init.js'


import {
    lobby1,
    lobby2,
    hallway1
} from './cubemaps.js';



export default {
    name: 'Viewer',
    components: {
        //vueDropzone: vue2Dropzone
    },
    data: () => ({
        tabStates: {
            UPLOAD: "upload",
            LOCATION: "location",
            SETTINGS: "object settings",
            CONTENT: "content",
            FINISH: "finish",
        },

        cubemaps: [
            lobby1,
            lobby2,
            hallway1,
        ],

        //depends on what firebase has
        locations: [
            "location1",
            "location2",
            "location3",
            "location4",
            "location5",
        ],

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
            this.setInitialTabState()
            this.instantiateLoaders()
            this.configureURLOverride()
            this.setupScene()
            this.addDefaultCube()
        },
        animate() {
            requestAnimationFrame(this.animate)
            this.controls.update()
            this.renderer.render(this.scene, this.camera)
        },
        onWindowResize() {
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
        vFileAdded() {
            this.$nextTick(()=> {
                //handle it as a bundle if possible
                let files = this.$refs.dropzone.getQueuedFiles()
                files.forEach((f) => {
                    if(f.name.endsWith(".obj") ||
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
                    else {
                        this.loadOBJ(this.primaryFileName, this.mtlFileName)
                    }
                }
                else {
                    //console.log("missing primary file")
                }
            })
        },
        vFileRemoved() {
            console.log("removed file")
        },
        removeAllFiles() {
            this.$refs.dropzone.removeAllFiles()
            this.resetUploadState()
            this.addDefaultCube()
        },
        resetUploadState() {
            this.scene.remove(this.primaryModel)

            //resets default values
            this.primaryFileName = null
            this.primaryModel = null
            this.fileExt = null
            this.mtlFileName = ""
            this.missingFiles = []

            this.clearFileMap()
        },
        addDefaultCube() {
            let geometry = new THREE.BoxGeometry(2, 2, 2)
            let material = new THREE.MeshPhongMaterial()
            this.primaryModel = new THREE.Mesh(geometry, material)
            this.camera.position.set(2, 2, 2)
            this.scene.add(this.primaryModel)
        },
        instantiateLoaders() {
            this.loaders.manager = new THREE.LoadingManager()
            this.loaders.gltf = new GLTFLoader(this.loaders.manager)
            this.loaders.obj = new OBJLoader(this.loaders.manager);
            this.loaders.mtl = new MTLLoader(this.loaders.manager);
            this.loaders.cubemap = new THREE.CubeTextureLoader();
        },
        loadGLTF(url) {
            this.loaders.gltf.load(url, (gltf) => {
                this.scene.remove(this.primaryModel)
                this.primaryModel = gltf.scene
                this.scene.add(this.primaryModel)

                this.setCameraToModel()
                this.centerModel()

                this.primaryModel.traverse((child) => {
                    if(child.isMesh) {
                        //sometimes a mesh has a basicmaterial which will cause it to
                        //be completely reflective which is incorrect
                        if(child.material instanceof THREE.MeshStandardMaterial) {
                            child.material.envMap = this.currentCubemap
                        }
                    }
                })

                this.clearFileMap()
                this.uploadDialog = false
                this.loadingModel = false

            }, (xhr) => {
                let percentLoaded = (xhr.loaded / xhr.total*100).toFixed(2)
                console.log(percentLoaded  + '% loaded');
                this.loadingModel = true
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
                    this.scene.add(this.primaryModel)

                    this.setCameraToModel()
                    this.centerModel()

                    this.primaryModel.traverse((child) => {
                        if(child.isMesh) {
                            //sometimes a mesh has a basicmaterial which will cause it to
                            //be completely reflective which is incorrect
                            if(child.material instanceof THREE.MeshStandardMaterial) {
                                child.material.envMap = this.currentCubemap
                            }
                        }
                    })

                    //clears before finish using
                    //this.clearFileMap()
                    this.uploadDialog = false
                    this.loadingModel = false
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
        setInitialTabState() {
            this.currentTab = this.tabStates.UPLOAD
        },
        setupScene() {
            let canvas = document.querySelector("#webgl-canvas")
            let viewer = document.querySelector("#viewer")
            let w = viewer.clientWidth
            let h = viewer.clientHeight
            this.camera = new THREE.PerspectiveCamera(70, w/h, 0.01, 10000)
            this.camera.position.set(2, 2, 2)
            this.scene = new THREE.Scene()
            let hemis = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
            this.scene.add(hemis);

            this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true})
            this.renderer.setClearColor(0x777799, 1);
            this.renderer.outputEncoding = THREE.sRGBEncoding;
            this.renderer.setSize(w, h, false)

            this.controls = new OrbitControls(this.camera, this.renderer.domElement)
            this.controls.enablePan = false
            this.controls.update()
            this.loadCubemap(this.cubemaps[2])
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
        loadCubemap(cubemap) {
            this.currentCubemap = this.loaders.cubemap.load([
                cubemap[0],
                cubemap[1],
                cubemap[2],
                cubemap[3],
                cubemap[4],
                cubemap[5],
            ])
            this.currentCubemap.encoding = THREE.sRGBEncoding;
            this.scene.background = this.currentCubemap
        },
        clearFileMap() {
            this.fileMap.forEach((url) => {
                console.log("revoking url: ", url)
                URL.revokeObjectURL(url)
            })
            this.fileMap.clear()
        },
        exportToStorage() {
            if(this.primaryFileName) {
                const exporter = new GLTFExporter()
                const options = {
                    trs: true,
                    binary: true,
               }
                exporter.parse(this.primaryModel, (gltf) => {
                    let buffer = new Uint8Array(gltf)
                    //let filename = this.primaryFileName.split('.')[0]
                    let filename = this.primaryFileName.split('.')[0]
                    let directory = ""
                    let uploadTask = this.storageRef.child(directory + filename + ".glb").put(buffer)
                    uploadTask.on('state_changed', (snapshot) => {
                        let progress = Math.floor(((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
                        console.log("Upload progress: " + progress + "%")
                    }, (error) => {
                        console.log("Upload Failed!" + error.message)

                    }, () => {
                        console.log("Upload success!")
                    })
                }, options)
            }
            else {
                console.log("You can't upload the default cube!")
            }
        },
        downloadFromStorage() {
            this.storageRef.child("alien.glb").getDownloadURL().then((url) => {
                this.loadGLTF(url)
                console.log("firebase url download success")
            }).catch((error) => {
                console.log("failed to download: " + error.message)
            })
        },
        logout() {
            AppAuth.signOut().then(() => {
                console.log("Signed out");
            });
        },

    },
    mounted() {
        //fixes canvas centering issue
        this.$nextTick(()=> {
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
    updated() {
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
