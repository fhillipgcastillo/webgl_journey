import * as THREE from 'three';
import Experience from "../Experience";
import Environment from './Environment';
import Floor from './Floor';


export default class World {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        // test mesh
        const testMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial()
        );
        this.scene.add(testMesh);
        
        this.resources.on('ready', () => {
            this.floor = new Floor();
            this.environment = new Environment();
        })
    }
}