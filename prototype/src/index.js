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
    robot,
    pyramid,
    pymtl
} from './models.js';

//threejs
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

//dropzone
import { SimpleDropzone } from 'simple-dropzone';

//firebase db
import { AppDB } from "./db-init.js";

var camera, scene, renderer, controls;

var loaders = {
    manager: null,
    gltf: null,
    obj: null,
    mtl: null,
    cubeMap: null
}

var dropzone = {
    dropzone: null,
    filetype: "none",
}

var model = {
    name: '',
    model: null,
    envMap: null,
    light: null,
    mat: null
};

var settings = {
    scale: 1.0,
    axes: null,
    boundingBox: {
        box: null,
        helper: null
    },
    grid: null,
    cubemap: lobby1,
    rotate: false,
    animation: false,
}

var menuState = {
    currentMenu: null,
    currentSidebar: null
}

var filesBundle = {
    filemap: null,
    mainFile: null
}

init();
animate();

function init() {
    setInitialMenuState()
    let canvas = document.querySelector("canvas");
    let viewer = document.querySelector("#viewer");
    let w = viewer.clientWidth;
    let h = viewer.clientHeight;
	camera = new THREE.PerspectiveCamera(70, w/h, 0.01, 1000);

	scene = new THREE.Scene();
    loaders.manager = new THREE.LoadingManager();
    loaders.gltf = new GLTFLoader(loaders.manager);
    loaders.obj = new OBJLoader(loaders.manager);
    loaders.mtl = new MTLLoader(loaders.manager);
    loaders.cubeMap = new THREE.CubeTextureLoader();
    filesBundle.filemap = new Map();
    //adds lighting to non-physically based materials
    model.light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(model.light);

    //loads default models
    setLoaderOptions();
    loadGLTFModel(helmet);
    //loadOBJModel(pyramid, pymtl);
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

function loadGLTFModel(file) {
    //need to distinguish between gltf, glb, or obj
    loaders.gltf.load(file, (gltf) => {
        scene.remove(model.model);
        model.model = gltf.scene;
        scene.add(model.model);
        model.model.traverse((child) => {
            if(child instanceof THREE.Mesh) {
                child.material.envMap = model.envMap;
            }
        })

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
        console.log("Failed to load gltf model: " + error);
    });
}


function loadOBJModel(file, mtl) {
    loaders.mtl.load(mtl, (mat) => {
        model.mat = mat;
        loaders.obj.setMaterials(model.mat);

        loaders.obj.load(file, (obj) => {
            scene.remove(model.model);
            model.model = obj;
            scene.add(model.model);

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
}

function userUpload(event) {
    let files = event.target.files;
    console.log("files", files);
    filesBundle.filemap.clear();

    //single file
    if(files.length == 1) {
        if(files[0].name.endsWith(".glb")) {
            let url = URL.createObjectURL(files[0]);
            loadGLTFModel(url);
        }
    }
    if(files.length > 0) {
        //multiple files?
        let gltf= null;
        for(let i = 0; i < files.length; i++) {
            let f = files[i];
            if(f.name.endsWith(".gltf")) {
                gltf = f.name;
            }
            let url = URL.createObjectURL(f);
            filesBundel.filemap.set(f.name, url);
        }
        loadGLTFModel(gltf);
    }
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
    //let fileUpload = document.querySelector("#input");
    //fileUpload.addEventListener('change', userUpload, false);

    const dropEl = document.querySelector("#dropzone");
    const inputEl = document.querySelector("#input");
    dropzone.dropzone = new SimpleDropzone(dropEl, inputEl);

    //dropzone.dropzone.on('drop', ({files}) => {
    //    console.log(files);
    //});
    dropzone.dropzone.on('drop', loadModel);

    //dropzone.dropzone.on('dropstart', () => {
    //    console.log("Processing dropped files");
    //});

    //navbar buttons
    let items = document.querySelectorAll(".navbar-item");
    items.forEach((menuItem) => {
        menuItem.addEventListener('click', selectMenu, false);
    });
}

function loadModel({files}) {
    console.log("dropped", files);
    setFileType(files);
    mapFilesToURL(files);
    if(dropzone.filetype === "gltf") {
        loadGLTFModel(filesBundle.mainFile);
    }
    if(dropzone.filetype === "obj") {
        //loadOBJModel(filesBundle.mainFile, need mtl file somehow);
    }
}

function mapFilesToURL(files) {
    console.log("mapping to url", files);
    files.forEach((file) => {
        let url = URL.createObjectURL(file);
        filesBundle.filemap.set(file.name, url);
    });
    console.log("mapping complete", filesBundle.filemap);
}


function setFileType(files) {
    dropzone.filetype = "none";
    files.forEach((file) => {
        console.log(file.name);
        if(file.name.endsWith(".obj")) {
            dropzone.filetype = "obj";
            filesBundle.mainFile = file.name;
        }
        if(file.name.endsWith(".gltf")) {
            dropzone.filetype = "gltf";
            filesBundle.mainFile = file.name;
        }
        if(file.name.endsWith(".glb")) {
            dropzone.filetype = "glb";
            filesBundle.mainFile = file.name;
        }
    });
}

function setInitialMenuState() {
    let items = document.querySelectorAll(".navbar-item");
    //first menu item is always upload and is default
    menuState.currentSidebar = document.querySelector("#" + items[0].id + "-menu");
    menuState.currentMenu = items[0];
    let header = document.querySelector("#current-sidebar");
    header.textContent = menuState.currentMenu.textContent;
}

function setLoaderOptions() {
    loaders.manager.setURLModifier((url) => {
        let name = url.split("/").pop()
        let bloburl = filesBundle.filemap.get(name);
        if(bloburl) {
            return bloburl;
        }
        else {
            return url;
        }
    });
}


function selectMenu(event) {
    //this is kinda hacky
    //probably a better way if we use Vue
    let ele = event.target;
    let id = ele.id;
    menuState.currentMenu.classList.remove("selected");
    menuState.currentSidebar.classList.add("hidden");
    ele.classList.add("selected");
    menuState.currentMenu = ele;
    let newSidebar = document.querySelector("#" + ele.id + "-menu");
    newSidebar.classList.remove("hidden");
    menuState.currentSidebar = newSidebar;

    //set sidebar header
    let header = document.querySelector("#current-sidebar");
    header.textContent = menuState.currentMenu.textContent;
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
