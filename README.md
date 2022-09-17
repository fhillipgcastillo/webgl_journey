# ThreeJS Journy
## 00 - Base ThreeJS
for node instalation
for web as cdn
bundler/webpack and its configurations
where to find the documentation, examples and tools to use with it

**note:** Go through each `script.js` file and check the comments

**To Do**
- [x] Pending
- [ ] Done
- [ ] Create a full pending script list to review

## Basic usage
### node three package install
```
npm install three
```

### How to import it
```javascript
import * as THREE from 'three';
```
<br />
<br />

### How to create a Mesh (visual object)

A mesh is kind of a visual object. Every three 'component' inherites from Object3D.

**A mesh is componse of**:
1. **Geometry:** Is the form of the mesh or object
2. **Material:** Is the texture/color/external visually structure of the mesh
    And hey both are required by the mesh
<br />
<br />

<h4 style="font-size: 1.15em">Geometry</h4>

A mesh neeeds to specify the form of it, threejs have a few primitives geometries or forms.

Lets say we want a box
```javascript
const boxGeometry = new THREE.BoxGeometry()
```

A geometry can receive it dimenssions as arguments, for example:
```javascript
const boxGeometry = new THREE.BoxGeometry(1, 2, 1);
```
<br />
<br />

#### Material

ThreeJS have a few Mesh materials that can be used depending on the context we need.


Here are 2 examples of it
```javascript
const boxMaterial = new THREE.MeshBasicMaterial();
```

It also can receive a color
```javascript
const blueBoxMaterial = new THREE.MeshStandardMaterial(0xFFFF00);
```

### Mesh Creation
```javascript
const box = new THREE.Mesh(boxGeometry, boxMaterial);
```


## 05 - Transforming an object
To be able to animate an object, we need to know how to transforme it<br/>

### There are 4 properties to transform objects
* position
* scale
* rotation
* quaternion - similar to rotation

All classes injerit from Object3d
the properties will be compile in matrices

Object3D position inherits from `Vector3` which have a bunch of property we can use later

### Position
* x, y, y are the main positions
* length method
* distance method tells the distance between that oject position and other object position or another vector
* normalize, is like reseting the vector value, until it's 1 again
* set : changes all 3 axes values received inside an array like `mesh.position.set([x,y,z])`

### Axes helper
this helps us to set a positioning of a mesh better

### Quatenion 
is the solution for the rotation order issue

Look a this
we can make anything to look at anything
lookAt method requires a vector3 which every object have as position property
Fro example we can make our camera to look at an exact position:
```javascript
camera.lookAt(new THREE.Vector3(0,0,4))
```
Or we can make it look at the mesh or any object we have created like so
```javascript
camera.lookAt(mesh.position)
```

### Scne graph
We can group to alter all of them simultaneously

We can add a group as simple as followed
```javascript
const group = new THREE.Group();
```

we can add it normally to the scene, so then all the children we only need to add them to the group, and if that group was added to the scene, so all the childrem object will be also rendered

TO add achildre to the group just use the `.add` method, same as we use on scene
```javascript
group.add(boxMesh1, circleMesh1, ...)
```

## Animation
Animation work as same as stop motion, but at high frame rates, let say 60fps and each one it render to the scene
To be able to do this we need to do the `window.requestAnimationFrame(...)` which in threejs have it own method to do this.

Request animationFrame is in charge to call a function once on the next frame

### Example of an animation defining a tick/loop/etc. 
```javascript
const tick = () => {
    // udpate objects
    mesh.rotation.y += 0.0025;

    // Render
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick);
};

tick();

```
## Tick/Loop issue & Solutions

Note: This previously tick will vary depending of the computer franerate.
### To fix this we need to add a time metter to calculate a delta between each frame, so we can have a more similar results
```javascript

let time = Date.now();

// Animations
const tick = () => {
    //time
    const currentTime = Date.now();
    const deltaTime = currentTime - time;
    time = currentTime;

    // udpate objects
    mesh.rotation.y += 0.0006  * deltaTime;
    // Render
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick);
};

tick();
```
### Using Clock
Three have a clock method/class that hadles this, called `Clock`
```javascript
const clock = new THREE.Clock()l

const tick = () => {
   const elapseTime = clock.getElapsedTime()

    // udpate objects
    mesh.rotation.y += 0.0006  * deltaTime;
    // Render
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick);
};

tick();
```

Using math cos and sin
This behaves like wave, one work contrary to te other

Note:
Avoid using getDelta, because it used to have errors or misbehaviors

## Using a Library
Libraries give us the advantage to create more advance animation
A popular algorithm is `GSAP`.

### How to install gsap
```bash
npm install --save gsap
```
### Usage
```javascript
import gasp from 'gasp';

gasp.to(mesh.position, {duration: 1, delay: 1, x: 1})
```

## Cameras
### Camera
Camera is an abstract class. Should not be used directly

### Array Camera

This is used to have like a splitted screen with different perspective or different cameras displayed

### Stereo Camera
Scelent for VRs and create paralax effect

### cube camera
Renders 6 cameras, facing differents directopm. Can render the surrounding for things like environment map, reflection or shadow map

### Perspective Camera

Render scene with perspective.

To Create a perspective camera
```javascript
const camera3d = new THREE.PerspectiveCamera(fov, aspectRatio, nearRenderDistance, farRenderDistance);
``` 
**Note:** Rememer to add it to the scene with `scene.add(camera3d)` to vizualize it<br /><br />

We can change it position as any other Object3D
```javascript
camera3d.position.set(2, 2, 2);
```

We can make it look a our mesh
```javascript
camera3d.lookAt(mesh.position);
```
Parameters
* FOV - Vertical Field of View, specified as degrees
* Aspect Ratio - Aspect ratio of the render size, which is done by deviding the width by the height of the canvas or render size
* Near - Is the minimal distance the camera can handle/render/show on the screen - Min value is 0.0001
* Far - IS the maximun distance the camera could render or vizualize an object to the scene - maximun value is `9999999`

> Note:
> 
> Try avoiding a OpenGL glitch when using the minimal near value within the maximun far values, where the camera have issues to identify which object is closer or farer fromt he camera and glitch out how it will look like.

### Orthographic Camera

Render the scene without perspective, great for 2D. Object will apeare the same size no matter the distance from the camera

#### Usage
```javascript
const lelft = -1;
const right = 1;
const top = 1;
const bottom = -1;
const near = 0.1;
const far = 15;

const camera = new THREE.OrthographicCamera(lelft, right, top, bottom, near, far);

```

#### **Notes:**
> The canvas size will alter the look of the image, and it can distor the final image
> Solution for the camera distorion is by calculating the canvas aspect ratio.

Aspect ratio calculation
```javascript
const sizes = {
    width: 800,
    height: 600,
};

const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.OrthographicCamera(lelft* aspectRatio, right * aspectRatio, top, bottom, near, far);

```

## Camera control
For testing, remove the animation of the camera (the rotation, let say)

a way to track mouse control is by adding an window event listener and store what we need from thhere into a global variable and use that variable later. For example, on mouseMove, rotate or move the camera.

```javascript
const cursor = {
    x: 0,
    y: 0,
};

window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY/ sizes.height - 0.5;
    console.log(cursor);
});

//...
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    
    mesh.rotation.y = -(Math.PI * cursor.x * 2);
    mesh.rotation.x = -(Math.PI * cursor.y * 2);

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
```

### Builtin Controls
#### Device Orientation Controls
use the gyro to move the camera

#### Fly control
Like a flying camera, and can see all the axes and turn on all direction, up down left right

#### Fist Person control
Similar to Fly control but can only see horizontal, it can't see up or down

### POinter lok control
Hide the mouse control, but the mouse get inside, like games

Trackball control
infinite movement loops

#### Transform control
Let up move the object in the space by selecting its axes

#### Drag Control
It lets move object (no related to the camera)

### Orbit Control 

#### Import
The OrbitControls are inside the jsm example folder, so we need to import it like so:
```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
```

### Create OrbitControls
To create a control we need to create a new instance of it, and give it the target camera and the dom element, let say the canvas

```javascript
const controls = new OrbitControls(camera, canva);
```

We can also update its position using target as followed
```javascript
control.target.y = 3;
```

After udpate the controls, we need to make it update the visual state 
```javascript
controls.update();
```


OrbitControl have something called Damping, which add some kind of aceleration and friction to the camera

#### Enabling Damping
```javascript
controls.enableDamping = true;
```

An important note with Damping, is tha we need to update the the controls on each tick/loop cycle.

Just add the following into the tick function or game animation cycle
```javascript
controls.update();
```

## Fullscreen and Resizing

