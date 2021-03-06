<template>
  <v-container>
    <v-toolbar-title class="text text-center text-wrap">
      <span v-if="locations"
        >Select a Location To Place a Model
        <v-divider class="mt-1 mb-2"></v-divider
      ></span>
      <span v-else
        >No Model Locations Found
        <v-divider class="mt-1 mb-2"></v-divider>
        <v-container fluid>
          <v-col justify="start">
            <v-row justify="center">
              <a
                class="ios-badge"
                href="https://apps.apple.com/us/app/ar-earth/id1523587669"
                ><img alt="Get it on the AppStore" src="./images/iosBadge.svg"
              /></a>
            </v-row>
            <v-row justify="center">
              <a
                class="google-badge"
                href="https://play.google.com/store/apps/details?id=com.sdbh.arearth&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
                ><img
                  alt="Get it on Google Play"
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              /></a>
            </v-row>
          </v-col>
        </v-container>
      </span>
    </v-toolbar-title>
    <template v-for="(location, index) in locations" class="">
      <v-card
        @click.stop="selectLocation(index)"
        :class="{ selected: index === selectedLocation }"
        class="pa-2 ma-2"
        :key="index"
      >
        <v-container fluid class="pa-0">
          <v-col justify="start">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-row justify="center" rows="3" v-on="on">
                  <v-icon
                    class="mb-1 pa-0"
                    style="color: rgba(255, 255, 255, 0.5)"
                    >location_on</v-icon
                  >
                  <v-card-title class="primary--text text-wrap pa-0 ml-2">{{
                    location.locationName
                  }}</v-card-title>
                  <span class="ml-7"></span>
                </v-row>
              </template>
              <span>Location Info</span>
            </v-tooltip>
            <v-row justify="center">
              <v-card-subtitle class="pa-0 mb-2 text-wrap text--disabled">{{
                location.locationDesc
              }}</v-card-subtitle>
            </v-row>
            <v-divider></v-divider>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-row justify="center" class="mt-2" v-on="on">
                  <v-icon
                    class="mb-1 pa-0"
                    style="color: rgba(255, 255, 255, 0.5)"
                    >category</v-icon
                  >
                  <v-card-title
                    v-if="location.modelName"
                    class="green--text text-wrap darken-4 pa-0 ml-2"
                    >{{ location.modelName }}
                  </v-card-title>
                  <v-card-title v-else class="text--disabled pl-0 pr-0 ml-2"
                    >NONE
                  </v-card-title>
                  <span class="ml-7"></span>
                </v-row>
              </template>
              <span>Model Info</span>
            </v-tooltip>
            <v-row v-if="location.modelDesc" justify="center">
              <v-card-subtitle class="pa-0 text--disabled text-wrap"
                >{{ location.modelDesc }}
              </v-card-subtitle>
            </v-row>
          </v-col>
        </v-container>
        <!-- <v-card-actions class="pa-auto">
          <ul>
            <v-list-item>{{ location.locationDesc }}</v-list-item>
          </ul>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!urlsAtLocation(index)"
            @click.stop="previewLocation(index)"
            color="blue"
            >preview</v-btn
          >
        </v-card-actions> -->
      </v-card>
    </template>
    <v-dialog v-model="previewDialog" max-width="1000" fluid eager>
      <v-card>
        <v-card-title>{{ previewLocationName }}</v-card-title>
        <v-divider></v-divider>
        <v-container id="preview-viewer" fluid>
          <v-overlay
            absolute
            color="black"
            opacity="1"
            v-model="previewLoading"
          >
            <v-card-text v-model="previewLocationName">
              Loading: {{ previewLocationName }}
            </v-card-text>
          </v-overlay>
          <canvas
            class="fill-height fill-width"
            id="webgl-canvas-preview"
          ></canvas>
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
  CubeTextureLoader,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
  name: "Location",
  components: {},
  data: () => ({
    previewDialog: false,
    previewLoading: true,
    previewLocationName: "",

    renderer: null,
    camera: null,
    controls: null,
    scene: null,
    cubemapLoader: new CubeTextureLoader(),
  }),
  methods: {
    init() {
      let canvas = document.querySelector("#webgl-canvas-preview");
      let viewer = document.querySelector("#preview-viewer");
      this.scene = new Scene();
      let w = viewer.clientWidth;
      let h = viewer.clientHeight;
      this.camera = new PerspectiveCamera(70, w / h, 0.01, 10000);
      this.camera.position.set(2, 0, 2);
      this.renderer = new WebGLRenderer({ canvas: canvas, antialias: true });
      this.renderer.setClearColor(0x0, 1);
      this.renderer.outputEncoding = sRGBEncoding;
      this.renderer.setSize(w, h, false);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enablePan = false;
      this.controls.enableZoom = false;
      this.controls.autoRotate = true;
      this.controls.update();
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    },
    previewLocation(loc) {
      this.previewDialog = true;
      this.previewLocationName = this.locations[loc].name;
      this.$nextTick(() => {
        let viewer = document.querySelector("#preview-viewer");
        let w = viewer.clientWidth;
        let h = viewer.clientHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h, false);
        let urls = this.locations[loc]["urls"];
        if (!urls) {
          console.log("no preview available");
          return;
        }
        let texture = this.locations[loc]["texture"];
        if (!texture) {
          this.previewLoading = true;
          texture = this.cubemapLoader.load(
            [urls[0], urls[1], urls[2], urls[3], urls[4], urls[5]],
            () => {
              console.log("done loading texture");
              this.previewLoading = false;
              let payload = { location: loc, texture: texture };
              this.$store.commit("setLocationCubemapTexture", payload);
            }
          );
        }
        this.scene.background = texture;
      });
      console.log("preview location: ", loc);
    },
    selectLocation(loc) {
      this.$store.commit("setSelectedLocation", loc);
    },
    onWindowResize() {
      let viewer = document.querySelector("#preview-viewer");
      if (viewer) {
        let w = viewer.clientWidth;
        let h = viewer.clientHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h, false);
      }
    },
    urlsAtLocation(loc) {
      return "urls" in this.locations[loc];
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
      this.animate();
    });
    window.addEventListener("resize", this.onWindowResize, false);
  },
  computed: {
    locations() {
      return this.$store.getters.locations;
    },
    selectedLocation() {
      return this.$store.getters.selectedLocation;
    },
  },
};
</script>

<style>
.google-badge img {
  width: 8.5rem;
  height: 3.65rem;
}

.selected {
  background-color: rgba(255, 255, 255, 0.33) !important;
}

#preview-viewer {
  height: 600px;
  width: 1000px;
}
</style>
