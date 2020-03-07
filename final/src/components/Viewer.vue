<template>
  <v-container class="fill-height ma-0 pa-0" fluid>
      <v-app-bar app clipped-right>
          <v-toolbar-title id="project-name" class="font-weight-bold display-1 px-4">Project Name</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn large color="red" @click.stop="helpDialog = true">HELP<v-icon class="ml-2">mdi-help-circle-outline</v-icon></v-btn>
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
          <template v-slot:extension>
              <v-tabs centered background-color="#444444" grow color="lime accent-3" show-arrows >
                  <v-tab class="tab-hover font-weight-black" @click="currentTab = state" v-for="(state, key) in tabStates" :key="key">{{ state }}</v-tab>
              </v-tabs>
          </template>
      </v-app-bar>
      <v-content class="fill-height">
          <v-container id="viewer" class="fill-height ma-0 pa-0" fluid>
            <canvas id="webgl-canvas"></canvas>
          </v-container>
      </v-content>
      <v-navigation-drawer app right clipped disable-resize-watcher permanent width="400"  >
          <v-card>
              <v-card-title class="text-uppercase" v-model="currentTab">{{currentTab}}</v-card-title>
          </v-card>
          <v-container  v-if="currentTab==tabStates.UPLOAD" class="pa-4" fluid>
              <v-btn color="blue-grey" class="ma-2 white--text" @click="uploadDialog = true">
                  Upload Model
                  <v-icon right dark>mdi-cloud-upload</v-icon>
              </v-btn>
              <v-dialog v-model="uploadDialog" max-width="1200">
                  <v-card>
                      <v-card-title>Upload</v-card-title>
                      <v-divider class="my-4"></v-divider>
                      <v-card-subtitle>Supported model formats: glTF, glb, obj</v-card-subtitle>
                      <v-card-subtitle class="red--text" v-if="missingFiles.length > 0" v-model="missingFiles">Missing Files: {{missingFiles.toString().replace(/,/g, ", ")}}</v-card-subtitle>
                      <v-card-subtitle class="light-green--text" v-if="primaryFileName && missingFiles.length === 0">Success!</v-card-subtitle>
                      <vue-dropzone ref="dropzone" id="dropzone" :options="dropzoneOptions" @vdropzone-file-added="vFileAdded" @vdropzone-removed-file="vFileRemoved"></vue-dropzone>

                  <v-card-actions>
                      <v-btn color="error" @click="vRemoveAllFiles">Remove all files</v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="success" @click="uploadDialog = false">Done</v-btn>
                  </v-card-actions>
                  </v-card>
              </v-dialog>
              <v-divider class="my-4"></v-divider>
              <v-list>
                  <v-list-item>
                      <v-list-item-title>File Information goes below once loaded</v-list-item-title>
                      <v-list-item-content>Filetype: </v-list-item-content>
                  </v-list-item>
              </v-list>
          </v-container>
          <v-container  v-if="currentTab==tabStates.LOCATION" class="pa-4" fluid>
              <v-subheader>Select a library location:</v-subheader>
              <v-radio-group v-model="currentLocation">
                  <v-radio v-for="(location, key) in locations" :key="key" :label="location" :value="location" color="lime accent-3"></v-radio>
              </v-radio-group>
          </v-container>
          <v-container  v-if="currentTab==tabStates.SETTINGS" class="pa-4" fluid>
              <v-list>
                  <v-list-item>
                      settings options
                  </v-list-item>
              </v-list>
          </v-container>
          <v-container  v-if="currentTab==tabStates.CONTENT" class="pa-4" fluid>
              <v-list>
                  <v-list-item>
                      content options
                  </v-list-item>
              </v-list>
          </v-container>
          <v-container  v-if="currentTab==tabStates.FINISH" class="pa-4" fluid>
              <v-list>
                  <v-list-item>
                      finish options
                  </v-list-item>
              </v-list>
          </v-container>

      </v-navigation-drawer>
      <v-footer app inset>
          <v-row>
              <v-col>
                  cool info here
              </v-col>
          </v-row>
      </v-footer>
  </v-container>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

import vue2Dropzone from 'vue2-dropzone'

export default {
    name: 'Viewer',
    components: {
        vueDropzone: vue2Dropzone
    },
    data: () => ({
        tabStates: {
            UPLOAD: "upload",
            LOCATION: "location",
            SETTINGS: "object settings",
            CONTENT: "content",
            FINISH: "finish",
        },

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

        loaders: {
            manager: null,
            gltf: null,
            obj: null,
            mtl: null,
        },

        //uploadedFiles: [],
        fileMap: new Map(),
        primaryFileName: null,
        mtlFileName: "",
        fileExt: null,
        missingFiles: [],

        dropzoneOptions: {
            url: "no_post",
            autoProcessQueue: false,
            acceptedFiles: ".obj,.mtl,.gltf,.bin,.glb,image/png,image/jpeg,image/jpg",
            addRemoveLinks: true,
        },
    }),

    methods: {
        init() {
            let canvas = document.querySelector("#webgl-canvas")
            let viewer = document.querySelector("#viewer")
            let w = viewer.clientWidth
            let h = viewer.clientHeight
            this.camera = new THREE.PerspectiveCamera(70, w/h, 0.01, 10000)
            this.camera.position.set(2, 2, 2)
            this.scene = new THREE.Scene()
            let hemis = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
            this.scene.add(hemis);

            this.addListeners()
            this.setInitialTabState()
            this.instantiateLoaders()
            this.configureURLOverride()

            let geometry = new THREE.BoxGeometry(2, 2, 2)
            let material = new THREE.MeshPhongMaterial()
            this.primaryModel = new THREE.Mesh(geometry, material)
            this.scene.add(this.primaryModel)

            this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true})
            this.renderer.setClearColor(0x777799, 1);
            this.renderer.outputEncoding = THREE.sRGBEncoding;
            this.controls = new OrbitControls( this.camera, this.renderer.domElement )
            this.controls.update()
            this.renderer.setSize(w, h, false)

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
                    console.log("missing primary file")
                }
            })
        },
        vFileRemoved() {
            console.log("removed file")
        },
        vRemoveAllFiles() {
            this.$refs.dropzone.removeAllFiles()
            this.scene.remove(this.primaryModel)
        },
        instantiateLoaders() {
            this.loaders.manager = new THREE.LoadingManager()
            this.loaders.gltf = new GLTFLoader(this.loaders.manager)
            this.loaders.obj = new OBJLoader(this.loaders.manager);
            this.loaders.mtl = new MTLLoader(this.loaders.manager);

        },
        loadGLTF(url) {
            this.loaders.gltf.load(url, (gltf) => {
                this.scene.remove(this.primaryModel)
                this.primaryModel = gltf.scene
                this.scene.add(this.primaryModel)
            }, (xhr) => {
                console.log((xhr.loaded / xhr.total*100).toFixed(2)  + '% loaded');
            }, (error) => {
                console.log("Failed to load gltf model: " + error);
            });
        },
        loadOBJ(obj, mtl) {
            this.loaders.mtl.load(mtl, (mat) => {
                this.loaders.obj.setMaterials(mat);

                this.loaders.obj.load(obj, (model) => {
                    this.scene.remove(this.primaryModel)
                    this.primaryModel = model
                    this.scene.add(this.primaryModel)
                }, (xhr) => {
                    console.log((xhr.loaded / xhr.total*100).toFixed(2)  + '% loaded');
                }, (error) => {
                    console.log("Failed to load obj model: " + error);
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
                if(this.fileExt != "glb") {
                    this.missingFiles.push(filename)
                }
                return url
            })
        },
        setInitialTabState() {
            this.currentTab = this.tabStates.UPLOAD
        },
    },
    mounted() {
        //fixes canvas centering issue
        this.$nextTick(()=> {
            this.init()
            this.animate()
        })
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

#dragdrop {
    height: 400px;
    width: 100%;
    border: 1px solid white;
}

.dz-progress {
    display: none;
}

#dropzone {
    height: 50vh;
}

</style>
