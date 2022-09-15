const scene = new THREE.Scene();


// shape
const boxGeometry= new THREE.BoxGeometry();
// color or texture
const boxMaterial  = new THREE.MeshBasicMaterial({color: "red"});

// Mesh box Object
const box = new THREE.Mesh(boxGeometry, boxMaterial);
// Added box to the scene
scene.add(box);

//Camera
const fov = 75;
const aspectRatio = window.innerWidth/window.innerHeight;
const minRender = 1;
const maxRenderDistance = 100;

const camera = new THREE.PerspectiveCamera(fov, aspectRatio, )
scene.add(camera);

/* 
Move camera
 Object have
 * position
 * rotation
 * scale
 * 
 * Forward and backward axis is the z axes, considered by WebGL
*/
camera.position.z = 3;

//scene renderer
const canvasElement = window.document.querySelector(".webgl");
const canvasRenderer = new THREE.WebGLRenderer({
    canvas: canvasElement
});
canvasRenderer.setSize(window.innerWidth, window.innerHeight)
// render the picture
canvasRenderer.render(scene, camera);
