import "./css/styles.css";

//cubemaps
import {
    lobby1,
    lobby2,
    hallway1
} from './cubemaps.js';

//models
import {
    helmet,
    fox,
    duck,
    robot
} from './models.js';

//threejs
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

//firebase db
import { AppDB } from "./db-init.js";

var camera, scene, renderer, controls;

var loaders = {
    gltf: null,
    cubeMap: null
}

var model = {
    name: '',
    model: null,
    envMap: null,
    light: null,
};

var settings = {
    scale: 1.0,
    axes: null,
    boundingBox: {
        box: null,
        helper: null
    },
    grid: null,
    cubemap: lobby2,
    rotate: false,
    animation: false,
}

var currentMenu = null;
var currentSidebar = null;

init();
animate();

function init() {
    let canvas = document.querySelector("canvas");
    let viewer = document.querySelector("#viewer");
    let w = viewer.clientWidth;
    let h = viewer.clientHeight;
	camera = new THREE.PerspectiveCamera(70, w/h, 0.01, 1000);

	scene = new THREE.Scene();
    loaders.gltf = new GLTFLoader();
    loaders.cubeMap = new THREE.CubeTextureLoader();
    //adds lighting to non-physically based materials
    model.light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(model.light);

    //loads default models
    loadModel(helmet);
    loadCubemap(settings.cubemap);
    addListeners();

	renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
    controls = new OrbitControls( camera, renderer.domElement );
    camera.position.set(2, 2, 2);
    controls.update()
    renderer.setSize(w, h, false);
}

function animate() {
	requestAnimationFrame( animate );
    controls.update()
	renderer.render( scene, camera );
}

function onWindowResize() {
    let viewer = document.querySelector("#viewer");
    let w = viewer.clientWidth;
    let h = viewer.clientHeight;
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
}

function loadModel(file) {
    loaders.gltf.load(file, (gltf) => {
        model.model = gltf.scene.children[0];
        scene.add(model.model);
        if('material' in model.model) {
            model.model.material.envMap = model.envMap;
        }

        //center local axes based on geometry
        //doesn't always work
        //let geo = model.model.children[1].geometry;
        //geo.center();

        //normalize scale
        //get bounding box size
        //var box = new THREE.Box3().setFromObject(model.model);
        //let size = box.getSize();
        //model.model.scale.set(1.0/size.z, 1.0/size.z, 1.0/size.z);

    }, (xhr) => {
        console.log((xhr.loaded / xhr.total*100).toFixed(2)  + '% loaded');
    }, (error) => {
        console.log("Failed to load default model: " + error);
    });
}

function changeScale(event) {
    settings.scale = event.target.value/25.0;
    model.model.scale.set(settings.scale, settings.scale, settings.scale);
    let label = document.querySelector("#scale-label");
    label.textContent = settings.scale;
}

function addListeners() {
    window.addEventListener('resize', onWindowResize, false);
    let scaler = document.querySelector("#scale-slider");
    scaler.addEventListener('input', changeScale, false);
    let axes = document.querySelector("#axes-checkbox");
    axes.addEventListener('change', toggleAxes, false);
    let grid = document.querySelector("#grid-checkbox");
    grid.addEventListener('change', toggleGrid, false);

    //navbar buttons
    let items = document.querySelectorAll(".navbar-item");
    items.forEach((menuItem) => {
        menuItem.addEventListener('click', selectMenu, false);
    });
    //first menu item is always upload and is default
    currentSidebar = document.querySelector("#" + items[0].id + "-menu");
    currentMenu = items[0];
    let header = document.querySelector("#current-sidebar");
    header.textContent = currentMenu.textContent;
}


function selectMenu(event) {
    //this is kinda hacky
    //probably a better way if we use Vue
    let ele = event.target;
    let id = ele.id;
    currentMenu.classList.remove("selected");
    currentSidebar.classList.add("hidden");
    ele.classList.add("selected");
    currentMenu = ele;
    let newSidebar = document.querySelector("#" + ele.id + "-menu");
    newSidebar.classList.remove("hidden");
    currentSidebar = newSidebar;

    //set sidebar header
    let header = document.querySelector("#current-sidebar");
    header.textContent = currentMenu.textContent;
}

function loadCubemap(cubemap) {
    let texture = loaders.cubeMap.load([
        settings.cubemap[0],
        settings.cubemap[1],
        settings.cubemap[2],
        settings.cubemap[3],
        settings.cubemap[4],
        settings.cubemap[5],
    ]);
    scene.background = texture;
    model.envMap = texture;
}

function toggleAxes(event) {
    let enableAxes = event.target.checked;
    if(enableAxes) {
        settings.axes = new THREE.AxesHelper(2);
        scene.add(settings.axes);
    }
    else {
        scene.remove(settings.axes);
        settings.axes = null;
    }
}

function toggleGrid(event) {
    let enableGrid = event.target.checked;
    if(enableGrid) {
        settings.grid = new THREE.GridHelper(20, 20);
        scene.add(settings.grid);
    }
    else {
        scene.remove(settings.grid);
        settings.grid = null;
    }
}
