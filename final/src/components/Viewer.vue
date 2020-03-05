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
                      <v-card-subtitle>Drag and Drop</v-card-subtitle>
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
                  <v-list-item-title>File Information goes below once loaded</v-list-item-title>
                  <!--
                  <v-list-item>
                      <v-list-item-content>Filetype: </v-list-item-content>
                  </v-list-item>
                  -->
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

        scene: null,
        camera: null,
        renderer: null,
        controls: null,

        currentTab: null,
        currentLocation: null,
        helpDialog: false,
        uploadDialog: false,

        uploadedFiles: [],

        dropzoneOptions: {
            url: "noPost",
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
            this.camera = new THREE.PerspectiveCamera(70, w/h, 0.01, 1000)
            this.camera.position.set(2, 2, 2)
            this.scene = new THREE.Scene()

            this.currentTab = this.tabStates.UPLOAD
            this.addListeners()

            let geometry = new THREE.BoxGeometry(2, 2, 2)
            let material = new THREE.MeshNormalMaterial()
            let mesh = new THREE.Mesh( geometry, material )
            this.scene.add( mesh )

            this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true})
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
        vFileAdded(file) {
            this.uploadedFiles.push(file)
            this.$nextTick(()=> {
                console.log("accepted", this.$refs.dropzone.getQueuedFiles())
            })
        },
        vFileRemoved(file, error, xhr) {
            console.log(error, xhr)
            let index = this.uploadedFiles.indexOf(file)
            this.uploadedFiles.splice(index, 1)
        },
        vRemoveAllFiles() {
            this.$refs.dropzone.removeAllFiles()
            this.uploadedFiles = []
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
