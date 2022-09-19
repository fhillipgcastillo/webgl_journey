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
We'll be working with the viewport which refer to the canvas size and the page size

Steps
1. How to remove the blue outline fromt he screen
    ```css
    .webgl {
        outline: none;
        position: fixed;
    }
    ```
2. To fit the canvas to the viewpoint we need to set the canvas sizes to the window inner width and inner height
3. To handle the resize, we need to add an event on resize for the windows and reajust the sizes
4. We also need to update the camera aspect ratio, 
5. But to be able to reflect the changes on the screen we need to udpate the projection matrix, after changing the aspect ration and also update the rendered size

Here is the results
```javascript
// step 1
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}
// step 2 - addEventListener
window.addEventListener('resize', (e) => {
    // step 3 - update the sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // step 4 - Update the camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // step 5 - update renderer
    renderer.setSize(sizes.width, sizes.height);
});
```

## Pixel Ratio
When we're seing steps or blurryness effect on the meshes and/or on te edges, we need to reajust the pixel ratio
This happen when pixel ratio is greater than 1

pixel ratio of 2, means 4 more pixel because it's rendering the 2 by 2 pixel ratio
pixel ratio of 3, means 9 times more pixels


Handle the pixel ratio

We can use to get the actual window pixel ratio
```javascript
windows.devicePixelRatio
```

For usage, we need to se the new pixel ratio to the renderer by
```javascript
renderer.setPixelRatio(window.devicePixelRatio);
```

To prevent/limite the limit of aspect ratio
```javascript

```

## Fullscreen
list to the do to list

Adding full screen with double clieck event `dbclick` and requestin full screen `canvas.requestFullscreen();`.
```javascript
window.addEventListener('dblclick', (e) => {
    if(!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
       document.exitFullscreen();
    }
});
```

## Geometries
A geometry is compose of vertices, a vertice coordinates in spaces and faces . 
Geometries are use to create meshes or marticles.

For particles, each vertice (coordinate) and each one will be a particle
Particles doesn't have faces

### Built in geometries 
* Box
* Plan
* Circle
* Cone
* Cilinder
* Ring
* Torus
* TorusKnot
* Dodecahedron
* OCtahedron
* Tetrahedrom
* Icosahedrom
* Sphere
* Shape
* Tube 
* Extrude
* Lathe 
* Text

Each one have Geometry at the end of the name, inside the ThreeJS
We can create advace meshes by combining multiple geometries

### Params
* width: the size on the x axis
* height: size on the y axis
* dept: size on x axis
* widthSegments: amount of subdivision in the x axis
* heightSsegments: amount of subdivision in the x axis
* deptSegments: amount of subdivision in the z axis

Those subdivision will be devided ontriangles for each segment (subdivision)
The way to see the segments, we need to enalbe wireframe on the mesh material

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
```

### Crete our own geometry
Suggestion, when a geometry is too complex, it's recomended to used a 3D software
to do a custom geometry, just use the empty Geometry class

He have it session to create custom buffer geomeries :palm-face:
## Custom Geometries with Buffer Geometry
### Float 32 Array
First to understand how to store buffer geometry data and it's not from THREEJS
* They are handle as `Float32Array`
* Float32Array are typed arrays, which only accept 1 type of values
* Easy to handle by the computer

```javascript
// Buffer geometry is the current base class for the Geometries
const geometry = new THREE.BufferGeometry();

// THis are the vertices that will make all the faces and coordinates of each point in space
const vertices = new Float32Array([
 0,0,0,
 0,1,0,
 1,0,0
])

// Here the attribute position is updated by the new BUffer attribute, have the vertices]
// BufferAttribute( array : TypedArray, itemSize : Integer, normalized : Boolean )
const attributeValue =  new THREE.BufferAttribute(vertices, 3);
geometry.setAttribute('position', attributeValue);

const material = new THREE.MeshBasicMaterial({ color: 0x990000, wireframe: true});
// Here we use the geometry normally for mesh
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
```

## Index
It is used to improve the geometries performances by specifying the geometry vertex that is being shared by other and reused those. But that is a bit more complex and we have to handle all that.

## Debug UI
Libraries to help with the ui
* dat.GUI
* control-panel
* ControlKit
* Guify
* Oui

### dat.GUI
its one of the more popular out there

Example:
https://bruno-simon.com/#debug

**Instalation**
```bash
npm i --save dat.gui
```

**Import and initialization**
```javascript
import * as dat from 'dat.gui';

const gui = new dat.GUI();
```

**Types of elements a panel can have**
* Range - for number with min and max value
* color - colors of various formats
* text - for simple texts
* Checkbox - for booleans
* Select - for a choid from a list of values
* Button - to trigger a function
* Folder - to ORganize the panel

### How to add elments
`gui.add(...)`

**`.add` arguments**
object
objectProperty as string
min (optional)
max (optional)
precision (optional)

```javascript
gui.add(mesh.position, 'x', -3, 3, 0.01);
```

**Another way to modify the min, max, and step**
```javascript
gui.add(mesh.position, 'y')
    .min(3)
    .max(2)
    .step(0.01)
```

**To change the gui label**
```javascript
gui.add(...)
    .name('elevation')
```
**Handling boolean**
dat.gui auto detects the values type, so it just need to be added and it will handle it
```javascript
gui.add(mesh, 'visible');
```

**Handling colors**
To add colors we need to use `gui.addColor` and to modify the ojects color we need to have some objects with the values somewhere because the color objects are not handling the same and can't be auto-recognized by dat.gui.

```javascript
const objectParameters = {
    color: 0xff0000
};
gui.addColor(objectParameters, 'color')
```

But wee need to trigger something to change the material color everytime we change the color by the method `onChange` after the `addColor`
```javascript
gui.addColor(objectParameters, 'color')
    .onChange((value) => {
        material.color.set(value);
        // or
        material.color.set(objectParameters.color);
    });
```

**Changing functions**
Let say we want a button ro something to run an animation

we need to add the function inside an object
```javascript
const parameters = {
    spin: () => {}
}

gui.add(parameters, 'spin');
```

Toggle hide pannel or show panel with `h` key.

We can also defined it as default as follow
```javascript
gui.hide();
```

We can toggle the panel to contract or full open by
```javascript
const gui = new dat.GUI({ closed: true });
```

We can also modify the width of the column by dragin it edge or by manually specifying it on the gui instance create
```javascript
const gui = new dat.GUI({ width: 300 });
```

**Recomended**, add each gui as you go, that way it goes progresivelly as you go.


## Textures
Texture are based on images, that will cover the surface fo the geometries.
There are many types with differents effects.

Example link: https://3dtextures.me/2019/04/16/door-wood-001/

**Images texture contains:**
* Color (or albedo)
  * the one that will be actually applied to the geometry
  * the most simple one
* alpha
  * gray scale image that will show what will be shown or not (black = noe, white = visible)
* Height (or displacement)
  * grayscale image
  * move the vertices to create some relief
  * need enough subdivision
* Normal
  * Add details about lighting
  * doesn't need subdivision
  * the vertices won't move
  * lure the ligh about the face orientation
  * better performances thatn adding a height texture with a lot of subdivisions
* Ambient occlusion
  * gayscale image
  * add fake shadows in crevides
  * not physically accuerate
  * helps to create constras and see details
* Metalness
  * gayscale image
  * white is metallic
  * black is non-metallic
  * mostly for reflection
* Roughness
  * gayscale image
  * in duo with the metalness
  * white is rough
  * black is smooth
  * mostly for light dissipation - Remove reflection for surface
* PBR principle
  For all those textures (especially the metalness and the roughness) follow this principles
  * Physically base rendering
  * Many tecnics hat tend to follow real-life directions to get realistic results
  * becoming the standard of realistic renders
  * many software, engines and libraries are using it
  * > [https://marmoset.co/posts/basic-theory-of-physically-based-rendering] 

### How to load textures
**differents ways to load a image**
* By putting textures into the src folder and import them directly
* By adding them into the `/static/` path of the project and calling them directly

**How to get the image**
From `/static/` path

```javascript
const image = new Image();
const texture = new THREE.Texture(image);
image.addEventListener('load', (e) =>{
    console.log('image loaded')
    texture.needsUpdate = true;
});
image.src = '/textures/door/color.jpg';

const material = new THREE.MeshBasicMaterial({ map: texture});
```

A better way to do this, is by using a loader
```javascript
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/textures/door/color.jpg');
```
Note: one texture loader can load multiple textures.

When loading a texture, we can provided 3 callback, after the texture path
* load - when the image loaded successfully
* progress - when the loading is progressing
* error - if somethign went wrong
```javascript
const texture = textureLoader.load('/textures/door/color.jpg', () => success, () => progress, () => error);
```
### **LoadingManager**
handle multiple events
```javascript
const textureManager = new THREE.LoadingManager();
textureManager.onStart = (e) =>{console.log("start", e || undefined)}
textureManager.onProgress = (e) =>{console.log("progress", e || undefined)}
textureManager.onError = (e) =>{console.log("error", e || undefined)}

const textureLoader = new THREE.TextureLoader(textureManager);
const colorTexture = textureLoader.load('/textures/door/color.jpg');
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
```

### UV Unwrapping
* It's used whent he geometry is not completely ment to that texture and the texture is not looking good or unstrech
* It's like unwrapping an origami
* IT'll be like a 2D map of the 3D object

**Transforming Textures**
It utilize the `texture.repeat` and it's a vector2 object, with `x` and `y` properties.

```javascript
// Transforming
colorTexture.repeat.x = 2;
colorTexture.repeat.y = 3;

// to fix the displacement
colorTexture.wrapS = THREE.RepeatWrapping;
colorTexture.wrapT = THREE.RepeatWrapping;
```
There's also a mirroring repeat wrapping
```javascript
colorTexture.wrapS = THREE.MirroredRepeatWrapping;
```
**Offset** 
It will transform the offset values on x and y

```javascript
texture.offset.x = 0.5;
texture.offset.y = 0.5;
```

Pibot point
Is the point of the mesh where the modification will be apply
let's say we want to rotate the texture, and its doing it on the botton left corner of a face and we want to move that pibot point ot he cente
```javascript
texture.center.x = 1;
texture.center.y = 1;
```
## Filtering and mipmaping
Mip mapping is a technique of creating half a smaller version of the texture until it's get `1x1`;
It's automatically used by ThreeJS to improve GPU performance

**minification filter**
It go reducing the texture pixels as the object get smaller

It can be handled by using the minFilter of the texture
```javascript
colorTexture.minFilter = THREE.NearestFilter;
```

**List of filters**
* THREE.NearestFilter
* THREE.LinearFilter
* THREE.NearestMipmapNearestFilter
* THREE.NearestMipmapLinearFilter
* THREE.LinearMipMapNearestFilter
* THREE.LinearMipMapLinearFilter
* 

By using differents material images we can clearly vizualice the effects
add the texture 
```javascript
const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png');
```
And you will be able to see it clearly

> When using `mipMapping` and `NearestFilter` we not need `mipmaps`
```javascript
texture.generateMipmaps = false;
```

**Magnification Filter**
It's used when the texture iamge is too small

MagFilter have 2 values
* THREE.NearestFilter - Gives better looking results and more sharp 
* THREE.LinearFilter - seems to be the default - more blurry

> **THREE.NearestFilter**
>  
> Give better performance thatn the others

```javascript
const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png');
colorTexture.magFilter = THREE.NearestFilter;
```

When preparing the texture, 3 crusials elements to keep in mind
* the weight
* the size (the resolution)
* the data

Th weight
how many MBs the iamge have

We need to choose the right image type
* `.jpg` loosy compression but usually lighter
* `.png` loosless compression but usually heavier

There are compression websites like TinyPNG

WHen choosing the resolution, try having resolution on power of 2, means, we can device the res by 2.

## Materials
It holds all the color information of the geomeotry.

Shaders are the algoritms that handle colors of the pixels of te material.

Have in mind that some values when being passed on the initialization can be set later but may be with different data types, for example color.

### Mesh Basic Material



Alpha maps need to have the `transparency = true` fro the materials when being used
```javascript
material.transparent = true;
material.alphaMap = doorAlphaTexture;
```


### **Show something behine the planes properties**
`material.side`

**Side possible values:**
* THREE.FrontSide
* THREE.BackSide
* THREE.DoubleSide

> `DoubleSite` can cause lower performance

### Mesh Normal Material
This are better looking than Basic Materials.

NOrmals are abot lighting, reflection, refraction,etc.

Normals are like pointings, which goes in a direction, and if the light comes from that direction it means it need to show.

New prperty the NormalMaterial have in comparizon with the BasicMaterial is `flatShading` property.

> `Basic`, `Normal` and `Matcap` materials are great to be used without lights

Where to find matcaps https://github.com/nidorx/matcaps

### Mesh Dept Material
The closest to the camera, the whitest the value.


## Materials that need Lights
