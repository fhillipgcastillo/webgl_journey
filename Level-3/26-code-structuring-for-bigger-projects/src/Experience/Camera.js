import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from "./Experience";

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.size = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.setInstance();

        // controls
        this.setOrbitControls();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.size.width / this.size.height, 0.1, 100);
        this.instance.position.set(6, 4, 8);
        this.scene.add(this.instance);
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
    }
    resize(){
        this.instance.aspect = this.size.width / this.size.height;
        this.instance.updateProjectionMatrix();
    }
    update() {
        this.controls.update();
    }
}