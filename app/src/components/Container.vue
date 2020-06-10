<template>
  <v-app>
    <v-app-bar app height="70" src="./images/cartoonEarth.jpg">
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          position="center"
          gradient="to top right, rgba(255,255,255,0), rgba(100,200,255,1.0)"
        ></v-img>
      </template>
      <v-toolbar-title class="text display-1 font-italic font-weight-light">
        AREarth
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        class="black--text"
        color="rgba(255, 255, 255, 0.5)"
        @click="helpDialog = !helpDialog"
        >help</v-btn
      >
      <v-dialog v-model="helpDialog" max-width="1200">
        <v-card class="pa-4">
          <v-card-title>Help Menu</v-card-title>
          <v-card-text>
            What do you need help with?
          </v-card-text>
          <v-expansion-panels accordion focusable inset>
            <v-expansion-panel>
              <v-expansion-panel-header
                >I am lost or confused</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <p>Follow this tutorial!</p>
                <iframe
                  width="560"
                  height="315"
                  src=""
                  frameborder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header
                >Uploading a model</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <p>Follow this tutorial!</p>
                <iframe
                  width="560"
                  height="315"
                  src=""
                  frameborder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-divider class="my-4"></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn large color="green" @click.stop="helpDialog = false"
              >Done</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn color="" @click="logout" class="mx-4">logout</v-btn>
    </v-app-bar>
    <v-content>
      <v-container class="fill-height">
        <v-stepper class="fill-height fill-width" v-model="step">
          <v-stepper-header>
            <template v-for="index in steps.length">
              <v-stepper-step
                :key="`key-${index}`"
                :complete="step > index"
                :step="index"
                >{{ steps[index - 1] }}</v-stepper-step
              >
              <v-divider :key="index"></v-divider>
            </template>
          </v-stepper-header>
          <v-stepper-items class="">
            <v-stepper-content step="1">
              <Location />
            </v-stepper-content>

            <v-stepper-content class="pa-0 ma-0" step="2">
              <v-container class="d-flex flex-column">
                <v-container class="sidebar">
                  <v-card>
                    <v-card-actions class="ml-2 mb-4">
                      <v-btn
                        v-if="!fileUploaded"
                        x-large
                        class="glow white--text mt-3"
                        @click="uploadDialog = true"
                      >
                        Upload Model
                      </v-btn>
                      <v-btn
                        color="primary"
                        v-else
                        x-large
                        class="mt-3"
                        @click="changeModel"
                      >
                        Change Model
                      </v-btn>
                    </v-card-actions>
                    <v-divider></v-divider>
                    <v-card-text v-if="!fileUploaded" class="disabled--text"
                      >Extract/Unzip Folder Before Uploading!</v-card-text
                    >
                    <v-container v-else fluid>
                      <v-card-title class="pa-1">Model Info:</v-card-title>
                      <ul>
                        <li v-if="!currFileSizeMB || currFileSizeMB == 0">
                          <v-card-text class="py-1 yellow--text">
                            File Size: Converting...
                          </v-card-text>
                        </li>
                        <li v-else-if="withinMaxFileSize()">
                          <v-card-text class="py-1 green--text">
                            File Size:
                            {{ currFileSizeMB.toFixed(2) + " MB" }}
                          </v-card-text>
                        </li>
                        <li v-else>
                          <v-card-text class="py-1 red--text">
                            File Size:
                            {{
                              currFileSizeMB.toFixed(2) +
                                ` MB / ${maxFileSizeMB} MB`
                            }}
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-icon class="pb-1 pl-1" v-on="on"
                                  >error_outline</v-icon
                                >
                              </template>
                              <span>{{
                                "Max Model Size Exceded - " +
                                  maxFileSizeMB +
                                  " MB"
                              }}</span>
                            </v-tooltip>
                          </v-card-text>
                        </li>
                        <li>
                          <v-card-text class="py-1">
                            Triangles: {{ renderer.info.render.triangles }}
                          </v-card-text>
                        </li>
                        <!-- <li>
                          <v-card-text class="py-1">
                            Type: {{ fileExt }}
                          </v-card-text>
                        </li> -->
                      </ul>
                    </v-container>
                    <v-dialog v-model="uploadDialog" max-width="1200">
                      <v-card>
                        <v-overlay
                          z-index="9999"
                          absolute
                          v-model="loadingModel"
                        >
                          <p
                            class="pa-4 text-center black lime--text lighten-3 display-2  rounded-border"
                          >
                            Loading...
                            <v-progress-circular
                              indeterminate
                              color="lime accent-3"
                              width="15"
                              size="100"
                            >
                            </v-progress-circular>
                          </p>
                        </v-overlay>

                        <v-card-title style="justify-content: center"
                          >Model Upload</v-card-title
                        >
                        <v-card-subtitle
                          style="text-align: center"
                          class="text--disabled ma-0"
                          >Supported Model Types - .glTF, .glb, .fbx, .obj [.obj
                          + .mtl]</v-card-subtitle
                        >
                        <v-card-subtitle
                          style="text-align: center"
                          class="red--text ma-0"
                          v-if="missingFiles.length > 0"
                          v-model="missingFiles"
                          >Missing Files -
                          {{
                            missingFiles.toString().replace(/,/g, ", ")
                          }}</v-card-subtitle
                        >
                        <v-card-subtitle
                          style="text-align: center"
                          class="light-green--text"
                          v-if="fileUploaded && missingFiles.length === 0"
                          >SUCCESS</v-card-subtitle
                        >

                        <vue-dropzone
                          ref="dropzone"
                          id="dropzone"
                          :options="dropzoneOptions"
                          @vdropzone-file-added="vFilesAdded"
                          useCustomSlot
                        >
                          <div class="dropzone-custom-content">
                            <h3 class="dropzone-custom-title primary--text">
                              Drag {{ "&" }} Drop To Upload
                            </h3>
                            <v-card-subtitle
                              class="subtitle mt-2 pa-0 white--text text--darken-2"
                            >
                              Or Click Icon To Select A Folder
                            </v-card-subtitle>
                            <button v-on:click="openDirectorySelection()">
                              <v-icon>cloud_upload </v-icon>
                            </button>
                            <input
                              id="dirInput"
                              type="file"
                              webkitdirectory="true"
                              multiple="true"
                              style="display: none"
                              accept="image/* .jpeg, .jpg, .png, .tga, .obj, .mtl, .gltf, .glb, .fbx, .bin, .ma"
                              v-on:input="vFilesAdded"
                            />
                          </div>
                        </vue-dropzone>
                        <v-card-actions>
                          <v-btn color="error" @click="removeAllFiles"
                            >Remove All Files</v-btn
                          >
                          <v-spacer></v-spacer>
                          <v-btn color="success" @click="uploadDialog = false"
                            >Done</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-card>
                  <v-card class="mt-4" v-if="fileUploaded">
                    <v-card-title class="pb-1">Controls:</v-card-title>
                    <ul class="pl-9">
                      <li>
                        <v-card-text class="py-1">
                          Click {{ "&" }} Hold: Rotate camera
                        </v-card-text>
                      </li>
                      <li>
                        <v-card-text class="pt-1 pb-4">
                          Scroll-Wheel: Zoom in/out
                        </v-card-text>
                      </li>
                    </ul>
                  </v-card>
                </v-container>
                <v-container id="viewer">
                  <canvas id="webgl-canvas" class=""></canvas>
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
                    <v-card-title
                      >Modify
                      <v-col class="text-right">
                        <v-btn
                          color="primary"
                          medium
                          class="py-0"
                          @click="resetModel"
                          >Reset
                        </v-btn>
                      </v-col>
                    </v-card-title>
                    <v-divider class="my-0"></v-divider>
                    <v-container class="px-4 pt-0" fluid>
                      <v-switch
                        class="py-0 mb-0"
                        label="Show Person [~6ft]"
                        v-model="showCharacter"
                        @click.stop="toggleCharacter"
                      ></v-switch>
                      <v-switch
                        class="py-0 my-0"
                        label="Show Floor"
                        v-model="showFloor"
                        @click.stop="toggleFloor"
                      ></v-switch>
                      <v-switch
                        class="py-0 my-0"
                        label="Show Axis"
                        v-model="showAxes"
                        @click.stop="toggleAxes"
                      ></v-switch>
                      <!-- <v-switch
                        class="py-0 my-0"
                        label="Show Anchor Location"
                        v-model="showAnchor"
                        @click.stop="toggleAnchor"
                      ></v-switch> -->
                      <v-slider
                        label="Model Scale"
                        class="py-0 my-0"
                        v-model="scale"
                        min="1"
                        max="1500"
                      ></v-slider>
                      <v-slider
                        label="X Position"
                        class="py-0"
                        v-model="positionX"
                        min="-1000"
                        max="1000"
                      ></v-slider>
                      <v-slider
                        label="Y Position"
                        class="py-0"
                        v-model="positionY"
                        min="-1000"
                        max="1000"
                      ></v-slider>
                      <v-slider
                        label="Z Position"
                        class="py-0"
                        v-model="positionZ"
                        min="-1000"
                        max="1000"
                      ></v-slider>
                      <v-slider
                        label="X Rotate"
                        class="py-0"
                        v-model="rotationX"
                        min="-180"
                        max="180"
                      ></v-slider>
                      <v-slider
                        label="Y Rotate"
                        class="py-0"
                        v-model="rotationY"
                        min="-180"
                        max="180"
                      ></v-slider>
                      <v-slider
                        label="Z Rotate"
                        class="py-0"
                        v-model="rotationZ"
                        min="-180"
                        max="180"
                      ></v-slider>
                    </v-container>
                  </v-card>
                </v-container>
              </v-container>
            </v-stepper-content>

            <v-stepper-content step="4">
              <v-card class="pa-4">
                <v-card-title>Almost There!</v-card-title>
                <v-divider></v-divider>
                <v-container class="pa-4" fluid>
                  <v-form>
                    <v-card-subtitle class="pl-0"
                      >Name Your Model File:</v-card-subtitle
                    >
                    <v-text-field
                      label="Model Name"
                      outlined
                      v-model="userModelName"
                    ></v-text-field>
                    <v-card-subtitle class="pl-0"
                      >Describe Your Model:</v-card-subtitle
                    >
                    <v-textarea
                      label="Model Description"
                      outlined
                      v-model="userModelDescription"
                    ></v-textarea>
                    <v-card-subtitle class="pl-0"
                      >Allow Others To Use This Model:
                    </v-card-subtitle>
                    <v-switch
                      id="privateSwitch"
                      class="py-0 my-0"
                      v-bind:label="privacyStr"
                      v-model="isPublic"
                      @change="togglePrivacy"
                    ></v-switch>
                  </v-form>
                </v-container>
                <v-overlay v-model="databaseOverlay" opacity="0.8">
                  Saving to database please wait... {{ uploadProgress }}%
                </v-overlay>
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-container>
    </v-content>
    <v-footer app height="70">
      <v-btn color="blue" @click="prevStep" x-large :disabled="step < 2"
        >back</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn
        :class="{ glow: canNextStep }"
        x-large
        @click="nextStep"
        :disabled="!canNextStep"
        >{{ step === 4 ? "SUBMIT" : "CONTINUE" }}</v-btn
      >
    </v-footer>
  </v-app>
</template>

<script>
import Location from "./Location";

import { AppDB, Storage, AppAuth } from "./db-init.js";

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
} from "three";

import character from "./models/character.glb";
import { lobby_urls, showcase_urls } from "./cubemaps.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

import vue2Dropzone from "vue2-dropzone";
import { debounce } from "vue-debounce";

export default {
  name: "Container",
  components: {
    Location,
    vueDropzone: vue2Dropzone,
  },
  data: () => ({
    step: 1,
    steps: ["Choose Location", "Upload Model", "Modify Model", "Finish"],
    maxFileSizeMB: 20,

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
    isPublic: true,
    privacyStr: "Public",
    uploadProgress: 0,

    dropzoneOptions: {
      url: "no_post",
      autoProcessQueue: false,
      addRemoveLinks: true,
      uploadMultiple: true,
      clickable: false,

      //this method does not work in firefox as it doesn't infer the file type
      //acceptedFiles: ".obj,.mtl,.gltf,.bin,.glb,.fbx,.ma,image/png,image/jpeg,image/jpg",

      //this is the solution
      accept: (file, done) => {
        const acceptedExts = [
          "jpeg",
          "jpg",
          "png",
          "tga",
          "obj",
          "mtl",
          "gltf",
          "glb",
          "fbx",
          "bin",
          "ma",
        ];
        let ext = file.name.split(".").pop();
        if (acceptedExts.includes(ext)) {
          done();
        } else {
          done("File type not accepted");
        }
      },
    },
  }),
  methods: {
    nextStep() {
      if (this.step === 1) {
        //check to see if a urls exists
        let loc = this.locations[this.selectedLocation];
        //console.log(this.locations)

        if (loc["texture"]) {
          console.log("texture is already loaded use that");
          this.scene.background = this.locations[this.selectedLocation][
            "texture"
          ];
        } else {
          if (loc["urls"]) {
            console.log("no texture but urls to load");
            let texture = this.loaders.cubemap.load(
              [
                loc["urls"][0],
                loc["urls"][1],
                loc["urls"][2],
                loc["urls"][3],
                loc["urls"][4],
                loc["urls"][5],
              ],
              () => {
                let payload = {
                  location: this.selectedLocation,
                  texture: texture,
                };
                this.$store.commit("setLocationCubemapTexture", payload);
                this.scene.background = texture;
              }
            );
          } else {
            //this.scene.background = null;
            console.log("no urls to use");
          }
        }
      }
      if (this.step === 2) {
        this.clearFileMap();
        this.toggleCharacter();
        this.toggleFloor();
      }
      if (this.step === 4) {
        this.saveToDatabase();
      }
      if (this.step < this.steps.length) {
        this.step += 1;
      }
    },
    prevStep() {
      if (this.step > 1) {
        this.step -= 1;
      }
    },

    init() {
      this.addListeners();
      this.instantiateLoaders();
      this.configureURLOverride();
      this.setupScene();
      this.setupModifyScene();
      this.addDefaultCube();
      this.setDefaultCubemapTexture();
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.controls.update();
      this.modifyControls.update();
      this.renderer.render(this.scene, this.camera);
      this.modifyRenderer.render(this.scene, this.camera);
    },
    setupModifyScene() {
      let canvas = document.querySelector("#webgl-canvas-modify");
      this.modifyRenderer = new WebGLRenderer({
        canvas: canvas,
        antialias: true,
      });
      this.modifyRenderer.setClearColor(0x777799, 1);
      this.modifyRenderer.outputEncoding = sRGBEncoding;

      let viewer = document.querySelector("#viewer");
      let w = viewer.clientWidth;
      let h = viewer.clientHeight;

      //let geo = new PlaneGeometry(1000,1000);
      //geo.rotateX(-Math.PI/2)
      //let mat = new MeshBasicMaterial({color: 0x777777 , side: DoubleSide})
      //this.floor= new Mesh(geo, mat)
      this.axes = new AxesHelper(2);
      this.axes.visible = false;
      this.anchor = new AxesHelper(100);
      //let sphereGeo = new SphereGeometry(0.1)
      //let sphereMat = new MeshBasicMaterial({color: 0xFF0000})
      //this.anchor = new Mesh(sphereGeo, sphereMat)
      this.anchor.visible = false;
      //this.worldAxes.visible = false
      //this.scene.add(this.worldAxes)
      this.scene.add(this.anchor);

      this.floor = new GridHelper(100, 100);
      this.scene.add(this.floor);
      this.floor.visible = false;

      this.modifyControls = new OrbitControls(
        this.camera,
        this.modifyRenderer.domElement
      );
      this.modifyControls.update();
      this.modifyRenderer.setSize(w, h, false);
    },
    onWindowResize() {
      if (this.step === 2) {
        let viewer = document.querySelector("#viewer");
        let w = viewer.clientWidth;
        let h = viewer.clientHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h, false);
      }
      if (this.step === 3) {
        let modifyViewer = document.querySelector("#viewer-modify");
        let w = modifyViewer.clientWidth;
        let h = modifyViewer.clientHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.modifyRenderer.setSize(w, h, false);
      }
    },
    addListeners() {
      window.addEventListener("resize", this.onWindowResize, false);
    },
    addDefaultCube() {
      let geometry = new BoxGeometry(2, 2, 2);
      let t = this.createTextTexture("N O N E", "black");
      t.repeat.set(1.25, 2.0);
      t.offset.set(-0.125, -0.5);
      let material = new MeshPhongMaterial({ map: t });
      this.primaryModel = new Mesh(geometry, material);
      this.scene.add(this.primaryModel);
    },
    instantiateLoaders() {
      this.loaders.manager = new LoadingManager();
      this.loaders.gltf = new GLTFLoader(this.loaders.manager);
      this.loaders.fbx = new FBXLoader(this.loaders.manager);
      this.loaders.obj = new OBJLoader(this.loaders.manager);
      this.loaders.mtl = new MTLLoader(this.loaders.manager);
      this.loaders.cubemap = new CubeTextureLoader();
    },
    setupScene() {
      let canvas = document.querySelector("#webgl-canvas");
      let viewer = document.querySelector("#viewer");
      let w = viewer.clientWidth;
      let h = viewer.clientHeight;
      this.camera = new PerspectiveCamera(70, w / h, 0.01, 10000);
      this.camera.position.set(2, 2, 2);
      let hemis = new HemisphereLight(0xffffbb, 0x080820, 1);
      this.scene.add(hemis);

      this.loadCharacter();

      this.renderer = new WebGLRenderer({ canvas: canvas, antialias: true });
      this.renderer.setClearColor(0x777799, 1);
      this.renderer.outputEncoding = sRGBEncoding;
      this.renderer.setSize(w, h, false);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enablePan = false;
      this.controls.update();
    },
    setDefaultCubemapTexture() {
      this.defaultCubemapTexture = this.loaders.cubemap.load(
        Math.round(Math.random()) === 0
          ? [
              lobby_urls[0],
              lobby_urls[1],
              lobby_urls[2],
              lobby_urls[3],
              lobby_urls[4],
              lobby_urls[5],
            ]
          : [
              showcase_urls[0],
              showcase_urls[1],
              showcase_urls[2],
              showcase_urls[3],
              showcase_urls[4],
              showcase_urls[5],
            ],
        () => {
          this.scene.background = this.defaultCubemapTexture;
        }
      );
    },
    openDirectorySelection() {
      document.getElementById("dirInput").click();
    },
    vFilesAdded() {
      //this.$nextTick(() => {
      this.removeAllFiles();
      this.loadingModel = true;
      setTimeout(() => {
        //handle it as a bundle if possible
        let files = document.getElementById("dirInput").files;
        if (!files || files.length === 0) {
          files = this.$refs.dropzone.getQueuedFiles();
        }
        files.forEach((f) => {
          if (
            f.name.endsWith(".obj") ||
            f.name.endsWith(".fbx") ||
            f.name.endsWith(".gltf") ||
            f.name.endsWith(".glb")
          ) {
            this.primaryFileName = f.name;
            this.fileExt = this.primaryFileName.split(".").pop();
          }
          if (f.name.endsWith(".mtl")) {
            this.mtlFileName = f.name;
          }
          let url = URL.createObjectURL(f);
          this.fileMap.set(f.name, url);
        });
        if (this.primaryFileName) {
          //clear missing files
          this.missingFiles = [];
          if (this.fileExt === "gltf" || this.fileExt === "glb") {
            this.loadGLTF(this.primaryFileName);
          } else if (this.fileExt === "fbx") {
            this.loadFBX(this.primaryFileName);
          } else {
            this.loadOBJ(this.primaryFileName, this.mtlFileName);
          }
        }
      }, 1000);
      //})
    },
    changeModel() {
      this.uploadDialog = true;
      this.clearFileMap();
      this.$refs.dropzone.removeAllFiles();
    },
    loadGLTF(url) {
      this.loaders.gltf.load(
        url,
        (gltf) => {
          this.scene.remove(this.primaryModel);
          this.primaryModel = gltf.scene;

          //adjust the model
          this.normalizeModel();
          this.setCameraToModel();
          this.centerModel();

          //layer it so that the geometry is centered
          let group = new Group();
          group.add(this.primaryModel);
          this.primaryModel = group;
          this.scene.add(this.primaryModel);

          this.primaryModel.traverse((child) => {
            if (child.isMesh) {
              //sometimes a mesh has a basicmaterial which will cause it to
              //be completely reflective which is incorrect
              if (child.material instanceof MeshStandardMaterial) {
                if (this.scene.background) {
                  child.material.envMap = this.locations[this.selectedLocation][
                    "texture"
                  ];
                } else {
                  child.material.envMap = this.defaultCubemapTexture;
                }
              }
            }
          });
          this.primaryModel.add(this.axes);
          this.uploadDialog = false;
          this.fileUploaded = true;
          this.loadingModel = false;
        },
        (xhr) => {
          let percentLoaded = ((xhr.loaded / xhr.total) * 100).toFixed(2);
          console.log(percentLoaded + "% loaded");
        },
        (error) => {
          console.log("Failed to load gltf model: " + error);
          this.loadingModel = false;
        }
      );
    },
    loadOBJ(obj, mtl) {
      this.loaders.mtl.load(
        mtl,
        (mat) => {
          this.loaders.obj.setMaterials(mat);

          this.loaders.obj.load(
            obj,
            (model) => {
              this.scene.remove(this.primaryModel);
              this.primaryModel = model;

              //adjust the model
              this.normalizeModel();
              this.setCameraToModel();
              this.centerModel();

              //layer it so that the geometry is centered
              let group = new Group();
              group.add(this.primaryModel);
              this.primaryModel = group;
              this.scene.add(this.primaryModel);

              this.primaryModel.traverse((child) => {
                if (child.isMesh) {
                  //sometimes a mesh has a basicmaterial which will cause it to
                  //be completely reflective which is incorrect
                  if (child.material instanceof MeshStandardMaterial) {
                    child.material.envMap = this.locations[
                      this.selectedLocation
                    ]["texture"];
                  }
                }
              });

              //clears before finish using
              //this.clearFileMap()
              this.uploadDialog = false;
              this.loadingModel = false;
              this.fileUploaded = true;
              this.primaryModel.add(this.axes);
              //this.$refs.dropzone.disable()
            },
            (xhr) => {
              let percentLoaded = ((xhr.loaded / xhr.total) * 100).toFixed(2);
              console.log(percentLoaded + "% loaded");
              this.loadingModel = true;
            },
            (error) => {
              console.log("Failed to load obj model: " + error);
              this.loadingModel = false;
            }
          );
        },
        (xhr) => {
          console.log(((xhr.loaded / xhr.total) * 100).toFixed(2) + "% loaded");
        },
        (error) => {
          console.log("Failed to load mtl: " + error);
        }
      );
    },
    loadFBX(url) {
      this.loaders.fbx.load(
        url,
        (model) => {
          this.scene.remove(this.primaryModel);
          this.primaryModel = model;
          this.scene.add(this.primaryModel);

          this.setCameraToModel();
          //this.primaryModel.geometry.center()
          this.centerModel();
          this.primaryModel.traverse((child) => {
            if (child.isMesh) {
              //sometimes a mesh has a basicmaterial which will cause it to
              //be completely reflective which is incorrect
              if (child.material instanceof MeshStandardMaterial) {
                child.material.envMap = this.locations[this.selectedLocation][
                  "texture"
                ];
              }
            }
          });
          this.primaryModel.add(this.axes);
          //this.clearFileMap()
          this.uploadDialog = false;
          this.loadingModel = false;
          this.fileUploaded = true;
          //this.$refs.dropzone.disable()
        },
        (xhr) => {
          let percentLoaded = ((xhr.loaded / xhr.total) * 100).toFixed(2);
          console.log(percentLoaded + "% loaded");
          this.loadingModel = true;
        },
        (error) => {
          console.log("Failed to load fbx model: " + error);
          this.loadingModel = false;
        }
      );
    },
    getBoxDimensions() {
      let box = new Box3().setFromObject(this.primaryModel);
      return box.getSize(new Vector3());
    },
    normalizeModel() {
      let dim = this.getBoxDimensions();
      let max = Math.max(dim.x, dim.y, dim.z);
      let s = 1.0 / max;
      this.primaryModel.scale.set(s, s, s);
    },
    configureURLOverride() {
      this.loaders.manager.setURLModifier((url) => {
        let filename = url.split("/").pop();
        let override = this.fileMap.get(filename);
        if (override) {
          return override;
        }
        //a fix to a weird bug where the glb file will continue looking
        //for more files even though it has already loaded in
        //I suspect it has to do with the nexttick method
        //or the url gets split based on file size
        if (this.fileExt != "glb") {
          this.missingFiles.push(filename);
        }
        return url;
      });
    },
    setCameraToModel() {
      const box = new Box3().setFromObject(this.primaryModel);
      const radius = box.getBoundingSphere(new Sphere()).radius;
      this.camera.position.set(radius, radius / 4, radius);
    },
    centerModel() {
      const box = new Box3().setFromObject(this.primaryModel);
      const center = box.getCenter(new Vector3());
      this.primaryModel.position.x += this.primaryModel.position.x - center.x;
      this.primaryModel.position.y += this.primaryModel.position.y - center.y;
      this.primaryModel.position.z += this.primaryModel.position.z - center.z;
      this.modelHeight = box.getSize(new Vector3()).y.toFixed(2);
    },
    removeAllFiles() {
      this.$refs.dropzone.removeAllFiles();
      this.missingFiles = [];
      this.resetUploadState();
      //this.$refs.dropzone.enable()
    },
    resetUploadState() {
      this.scene.remove(this.primaryModel);

      //resets default values
      this.primaryFileName = null;
      this.fileUploaded = false;
      this.primaryModel = null;
      this.fileExt = null;
      this.mtlFileName = "";
      this.missingFiles = [];
      this.camera.position.set(2, 2, 2);

      this.addDefaultCube();
      //this.clearFileMap()
    },
    clearFileMap() {
      //console.log("clearing")
      this.fileMap.forEach((url) => {
        //console.log("revoking url: ", url)
        URL.revokeObjectURL(url);
      });
      this.fileMap.clear();
    },
    async toggleFloor() {
      if (!this.showFloor) {
        // this.floor = new GridHelper(100, 100);
        // this.scene.add(this.floor);
        this.floor.visible = true;
        this.showFloor = true;
      } else {
        // this.scene.remove(this.floor);
        this.floor.visible = false;
        this.showFloor = false;
      }
    },
    async toggleAxes() {
      if (!this.showAxes) {
        this.showAxes = true;
        this.axes.visible = true;
      } else {
        this.showAxes = false;
        this.axes.visible = false;
      }
    },
    async toggleAnchor() {
      if (!this.showAnchor) {
        this.showAnchor = true;
        //this.worldAxes.visible = true
        this.anchor.visible = true;
      } else {
        this.showAnchor = false;
        //this.worldAxes.visible = false
        this.anchor.visible = false;
      }
    },
    async toggleCharacter() {
      if (!this.showCharacter) {
        this.showCharacter = true;
        this.character.visible = true;
      } else {
        this.showCharacter = false;
        this.character.visible = false;
      }
    },
    async updateScale() {
      let s = this.scale / 100.0;
      this.primaryModel.scale.set(s, s, s);
      const box = new Box3().setFromObject(this.primaryModel);
      let dimensions = box.getSize(new Vector3());
      this.modelHeight = dimensions.y.toFixed(2);
    },
    async updatePosition() {
      this.primaryModel.position.set(
        this.positionX / 100.0,
        this.positionY / 100.0,
        this.positionZ / 100.0
      );
    },
    async updateRotationX() {
      this.primaryModel.rotation.x = (this.rotationX * Math.PI) / 180;
    },
    async updateRotationY() {
      this.primaryModel.rotation.y = (this.rotationY * Math.PI) / 180;
    },
    async updateRotationZ() {
      this.primaryModel.rotation.z = (this.rotationZ * Math.PI) / 180;
    },
    async resetModel() {
      this.showFloor = false;
      this.showAxes = false;
      this.showCharacter = false;
      this.showAnchor = false;
      this.scale = 100;
      this.modelHeight = 0;
      this.positionX = 0;
      this.positionY = 0;
      this.positionZ = 0;
      this.rotationX = 0;
      this.rotationY = 0;
      this.rotationZ = 0;

      this.axes.visible = false;
      this.anchor.visible = false;
      this.toggleCharacter();
      this.toggleFloor();
      this.updateScale();
      this.updatePosition();
    },
    logout() {
      AppAuth.signOut().then(() => {
        console.log("Signed out");
      });
    },
    saveToDatabase() {
      this.databaseOverlay = true;
      const uid = AppAuth.currentUser.uid;

      // Remove the old model file
      AppDB.ref(`users/${uid}/locations/${this.selectedLocation}`)
        .once("value")
        .then((snapshot) => {
          let modelData = snapshot.val();
          if (modelData) {
            let oldFilePath = modelData.filePath;
            if (oldFilePath && oldFilePath.split("/")[0] === uid) {
              this.removeFromStorage(oldFilePath);
            }
          }
        })
        // Add the new model file
        .then(() => {
          let fileName = this.userModelName + ".glb";
          AppDB.ref(`users/${uid}/locations/${this.selectedLocation}`)
            .update({
              fileName: fileName,
              filePath: this.isPublic
                ? `${uid}/public/${fileName}`
                : `${uid}/private/${fileName}`,
              fileDesc: this.userModelDescription,
            })
            .then(() => {
              this.exportToStorage(uid);
            })
            .catch((err) => {
              this.databaseOverlay = false;
              console.log("Error writing to realtime DB: " + err.message);
            });
        })
        .catch((err) => {
          this.databaseOverlay = false;
          console.log("Error reading from realtime DB: " + err.message);
        });
    },
    removeFromStorage(filePath) {
      Storage.ref()
        .child(filePath)
        .delete()
        .then(() => {
          console.log("Previous File Deleted: " + filePath);
        })
        .catch((err) => {
          console.log(
            "Failed to delete previous file at path: " +
              filePath +
              "\nError: " +
              err.message
          );
        });
    },
    exportToStorage(useruid) {
      this.primaryModel.remove(this.axes);
      this.scene.remove(this.character);
      this.scene.remove(this.anchor);

      if (this.primaryFileName) {
        const exporter = new GLTFExporter();
        const options = {
          trs: true,
          binary: true,
        };
        exporter.parse(
          this.primaryModel,
          (gltf) => {
            let buffer = new Uint8Array(gltf);

            let directory = useruid;
            let uploadTask = Storage.ref()
              .child(
                `${directory}/${this.isPublic ? "public" : "private"}/${
                  this.userModelName
                }.glb`
              )
              .put(buffer);
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                this.uploadProgress = Math.floor(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
              },
              (error) => {
                console.log("Upload Failed!" + error.message);
              },
              () => {
                console.log("Upload success!");
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
                location.reload();
              }
            );
          },
          options
        );
      } else {
        console.log("You can't upload the default cube!");
      }
    },
    createTextLabelCanvas(size, text, color) {
      const borderSize = 2;
      const ctx = document.createElement("canvas").getContext("2d");
      const font = `${size}px Arial`;
      ctx.font = font;
      const width = ctx.measureText(text).width + borderSize * 2;
      const height = size + borderSize * 2;
      ctx.canvas.width = width;
      ctx.canvas.height = height;
      ctx.font = font;
      ctx.textBaseline = "top";
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "white";
      ctx.fillText(text, borderSize, borderSize);
      return ctx.canvas;
    },
    createTextTexture(text, color) {
      let c = this.createTextLabelCanvas(64, text, color);
      let texture = new CanvasTexture(c);
      texture.minFilter = LinearFilter;
      texture.wrapS = ClampToEdgeWrapping;
      texture.wrapT = ClampToEdgeWrapping;
      //let labelMaterial = new SpriteMaterial({
      //    map: texture,
      //    transparent: true,
      //})
      //let label = new Sprite(labelMaterial)
      return texture;
    },
    loadCharacter() {
      this.loaders.gltf.load(
        character,
        (gltf) => {
          this.character = gltf.scene;
          this.character.position.set(0, 0, -1);
          this.character.scale.set(0.24, 0.24, 0.24);
          this.character.visible = false;
          this.scene.add(this.character);
          this.missingFiles = [];
        },
        (xhr) => {
          let percentLoaded = ((xhr.loaded / xhr.total) * 100).toFixed(2);
          console.log(percentLoaded + "% loaded");
        },
        (error) => {
          console.log("Failed to load gltf model: " + error);
        }
      );
    },
    withinMaxFileSize() {
      return this.currFileSizeMB && this.currFileSizeMB <= this.maxFileSizeMB;
    },
    togglePrivacy() {
      this.privacyStr = this.privacyStr === "Private" ? "Public" : "Private";
    },
  },
  asyncComputed: {
    async currFileSizeMB() {
      if (this.fileUploaded && this.primaryFileName) {
        const exporter = new GLTFExporter();
        const options = {
          trs: true,
          binary: true,
        };
        return new Promise((resolve) => {
          exporter.parse(
            this.primaryModel,
            (gltf) => {
              resolve(new Uint8Array(gltf).byteLength / 1000000);
            },
            options
          );
        }).catch((err) => {
          console.error(err);
        });
      }
    },
  },
  computed: {
    locations() {
      return this.$store.getters.locations;
    },
    selectedLocation() {
      return this.$store.getters.selectedLocation;
    },
    canNextStep() {
      //disabled if the location hasn't been selected yet
      if (this.step === 1 && !this.selectedLocation) {
        return false;
      }
      if (
        this.step === 2 &&
        (!this.fileUploaded || !this.withinMaxFileSize())
      ) {
        return false;
      }
      if (
        this.step === 4 &&
        (this.userModelName == "" || !this.withinMaxFileSize())
      ) {
        return false;
      }
      return true;
    },
    scene() {
      return this.$store.getters.scene;
    },
  },
  updated() {
    this.onWindowResize();
  },
  watch: {
    scale() {
      this.debouncedUpdateScale();
    },
    positionX() {
      this.debounceUpdatePosition();
    },
    positionY() {
      this.debounceUpdatePosition();
    },
    positionZ() {
      this.debounceUpdatePosition();
    },
    rotationX() {
      this.debounceUpdateRotationX();
    },
    rotationY() {
      this.debounceUpdateRotationY();
    },
    rotationZ() {
      this.debounceUpdateRotationZ();
    },
  },
  created() {
    this.debouncedUpdateScale = debounce(this.updateScale, 250);
    this.debounceUpdatePosition = debounce(this.updatePosition, 250);
    this.debounceUpdateRotationX = debounce(this.updateRotationX, 250);
    this.debounceUpdateRotationY = debounce(this.updateRotationY, 250);
    this.debounceUpdateRotationZ = debounce(this.updateRotationZ, 250);

    AppAuth.onAuthStateChanged((u) => {
      if (u == null) {
        console.log("viewer - not logged in");
        this.$router.push({ name: "Login" }).catch((e) => {
          console.log("viewer push error:" + e);
        });
      } else {
        //console.log("viewer - is logged in as: " + u.uid)
        this.isLoggedIn = true;
      }
    });

    const uid = AppAuth.currentUser.uid;
    AppDB.ref(`/users/${uid}/locations`)
      .once("value")
      .then((snapshot) => {
        let locations = snapshot.val();
        this.$store.commit("setLocations", locations);
      })
      .then(() => {
        const locations = this.$store.getters.locations;
        if (!locations) {
          console.log("No locations found for user");
          return;
        }

        const keys = Object.keys(locations);
        keys.forEach((key) => {
          // let p1 = Storage.ref()
          //   .child(`cubemaps/${key}/px.png`)
          //   .getDownloadURL();
          // let p2 = Storage.ref()
          //   .child(`cubemaps/${key}/nx.png`)
          //   .getDownloadURL();
          // let p3 = Storage.ref()
          //   .child(`cubemaps/${key}/py.png`)
          //   .getDownloadURL();
          // let p4 = Storage.ref()
          //   .child(`cubemaps/${key}/ny.png`)
          //   .getDownloadURL();
          // let p5 = Storage.ref()
          //   .child(`cubemaps/${key}/pz.png`)
          //   .getDownloadURL();
          // let p6 = Storage.ref()
          //   .child(`cubemaps/${key}/nz.png`)
          //   .getDownloadURL();
          // Promise.all([p1, p2, p3, p4, p5, p6])
          //   .then((urls) => {
          //     if (urls.length == 6) {
          //       this.$set(this.locations[key], "urls", urls);
          //     }
          //     this.$forceUpdate();
          //   })
          //   .catch((err) => {
          //     console.log("Error: ", err);
          //   });

          const uid = AppAuth.currentUser.uid;
          AppDB.ref(`/users/${uid}/locations/${key}`)
            .once("value")
            .then((snapshot) => {
              let location = snapshot.val();
              //removes the .glb extension
              if (location && location.fileName) {
                //console.log(modelInfo)
                let modelName = location.fileName;
                modelName = modelName.substring(0, modelName.length - 4);
                this.$set(this.locations[key], "modelName", modelName);
                this.$set(this.locations[key], "modelDesc", location.fileDesc);
              }
            });
        });
      });
  },
  mounted() {
    this.init();
    this.animate();
  },
};
</script>

<style>
::-webkit-scrollbar {
  display: none;
}

.fill-width {
  width: 100%;
}

#viewer {
  max-height: 50rem;
}

#webgl-canvas {
  width: 100%;
  height: 37.5rem;
}

#webgl-canvas-modify {
  width: 100%;
  height: 37.5rem;
}

canvas {
  width: 100%;
  height: 37.5rem;
  outline: none;
}

.sidebar {
  max-width: 100%;
  min-width: 12.5rem;
}

.dz-progress {
  display: none;
}

#dropzone {
  min-height: 50vh;
  background-color: rgba(255, 255, 255, 0.5);
  border: 2px solid rgba(0, 0, 0, 0.33);
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
  width: 2.5rem;
}

@keyframes glowing {
  0% {
    background-color: rgba(51, 204, 51, 1);
  }
  50% {
    background-color: rgba(31, 122, 31, 1);
  }
  100% {
    background-color: rgba(51, 204, 51, 1);
  }
}

.glow {
  animation: glowing 1s infinite;
}
</style>
