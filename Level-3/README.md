# Level 3 - Advanced techniques (#lvl3)

## 22 - Light (#22)
Library for physics
  
  If it's no necesary to have 3d physics, use a 2d physic library

**3D Libraries**
* ammo - most used
* cannon - easy to used than ammo.js
* oimo
* PhysicJS


**2D Physics libraries**
* Matter.js
* P2.js
* Planck.js
* box2d.js

Install
```
npm install --save cannon
```

import 
```javascript
import CANNON from 'cannon';
```

### Setup
Add a worlds
```javascript
const world = new CANNON.World();
```
**Add gravity**
```javascript
const EARTH_GRAVITY = -9.82;
world.gravity.set(0, EARTH_GRAVITY, 0);
```

**Add object inside the physics worlds**

> We need to create a Body. Bodies are object tht will fall and collide with other bodies

Body Shapes
* BOx 
* Cylinder
* Plane
* Sphere
* etc.

**First, we need a body shape**
```javascript
const sphereShape = new CANNON.Sphere(0.5);
```

**Create the body**

```javascript
const sphereBody = new CANNON.Body(
    {
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: sphereShape,
    }
)
world.addBody(sphereBody);
```

Now we need ot update the cannon js world for each frame

**hard and more direct wya**
```javascript
const clock = new THREE.Clock()
const oldElapsedTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    // update phycis world
    world.step(1/60, deltaTime, 3)
    // ...
}
```

Nw update the mesh  position with the body position
```javascript
 // copy sphere coording to new physics
sphere.position.x = sphereBody.position.x;
sphere.position.y = sphereBody.position.y;
sphere.position.z = sphereBody.position.z;
```

eeasy way
```javascript
sphere.position.copy(sphereBody.position);
```

**Now add a plane body**

```javascript
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();

floorBody.mass = 0;
floorBody.addShape(floorShape);

world.addBody(floorBody)
```

**Rotate plane body**

For this we need cotanion

```javascript
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
```

### Contact material
**Materials**

On cannon a material is jsut a reference for each type of material, like plastic, concrete, jelly, etc.

This changes the friction and bouncing of a body

**Contact Material**
Now we'll need a contoact material

Is the combination of two materials and how they should collide or behave by each other.

**Parameters**
* 1st and 2nd are materials
* 3rd object with the collition properties like:
  * friction (how much does it rub)
  * restitution (how much does it bounce)
  * default values of both is `0.3`

```javascript
const concretePlasticContactMaterial  = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
        friction: 0.1,
        restitution: 0.7,
    }
)
```

Now we need to add the contact material to the physics world
```javascript
world.addContactMaterial(concretePlasticContactMaterial);
```

Now to make it work, lets add them to the bodies

```javascript
const sphereBody = new CANNON.Body(
    {
        // ...
        material: plasticMaterial,
    }
)
```
Or the following way

```javascript
floorBody.material = concreteMaterial;
```

### Simply
We can also add a defautlContact material to the physic world

```javascript
world.defautlContactMaterial = defaultContactMaterial;
```

ANd we need to create the mterial acording to the defaults values we need.

```javascript
const defaultMaterial = new CANNON.Material('default');

const defaultContactMaterial  = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7,
    }
);

world.addContactMaterial(defaultContactMaterial);
```
note: remember to change the bodies materials


**ANother simpler way**
First remove the material from the bodies and add this

```javascript
world.defaultContactMaterial = defaultContactMaterial;
```

## Applying forces

**4 ways**
* applyForce
  * apply force from a specified point in space (not necessarily on the body's surface) like the wind, etc.
* applyImpulse
  * similar to `apply force` but instead of adding the force, will add tto the volicity.
* applyLocalForce
  * same as `applyForce` but the coordinates are local to the body where (0, 0, 0) will be the center of the body.
* applyLocalImpulse
  * apply impulse locally as `applyLocalForce`


**Apply force**

```javascript
const sphereForce = new CANNON.Vec3(250, 0, 0);
const sphereForceCoords = new CANNON.Vec3(0,0,0);
sphereBody.applyForce(sphereForce, sphereForceCoords);
```

### mimic the wind
on the tick and before updating the physics world

```javascript
// update phycis world
sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)
```

## Handling multple objects physics
First remove the sphere body related code and the sphere meshes related code.

create an array that will hold the body and mesh information for each object:

```javascript
const objects = [];
```

create a utils function to create the physic body and the mesh in the same place:

```javascript
const createSphere = (radius, position) => {
    // mesh
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 20, 20),
        new THREE.MeshStandardMaterial({
            metalness: 0.3,
            roughness: .4,
            envMap: environmentMapTexture,
        })
    );
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    // Cannon Body
    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        material: defaultMaterial,
        shape,
    });
    body.position.copy(position); 
    world.addBody(body);
    objects.push({
        mesh,
        body
    })
};
```

Then update each mesh position from the body position
```javascript
objects.forEach(object => 
    object.mesh.position.copy(object.body.position)
);
```

### Add gui

create an debugObject for the gui

```javascript
const debugObject = {
    createSphere: () => {}
}
```

**ADd it to the debug**
```javascript
gui.add(debugObject, 'createSphere')
```

**Now add the create sphere function with is encesary parameters**
```javascript
const debugObject = {
    createSphere: () => {
        createSphere(0.5, {x: 0, y: 3, z: 0});
    }
};
```

**Now add some randomness**
```javascript
const debugObject = {
    createSphere: () => {
        createSphere(
            Math.random() * 0.5, 
            {
                x: (Math.random() - 0.5) * 3,
                y: 3,
                z: (Math.random() - 0.5) * 3
            }
        );
    }
};
```
### Optimize
Extrat the mesh geometry and material,as they are only 1, so we can change only the scale having an standard, or defaults one.

```javascript
const meshGeometry = new THREE.SphereGeometry(1, 20, 20);
const meshMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: .4,
    envMap: environmentMapTexture,
});
const createSphere = (radius, position) => {
    const mesh = new THREE.Mesh(
        meshGeometry,
        meshMaterial
    );
    mesh.scale.set(radius, radius, radius);
    // rest of code ...
}
```

### Adding boxes
My own implementation

```javascript
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const createBox = (width, height, dept, position) => {
    const mesh = new THREE.Mesh(
        boxGeometry, meshMaterial,
    );
    mesh.scale.set(width, height, dept);
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);
    const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, dept/2))
    const body = new CANNON.Body({
        mass: 1,
        position: position,
        material: defaultMaterial,
        shape,
    });
    body.position.copy(position);
    world.addBody(body);

    objectsToUpdate.push({ mesh, body });
}
```

THe gui part
```javascript
createBox: () => {
    createBox(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        {
            x: (Math.random() - 0.5) * 2,
            y: 3,
            z: (Math.random() - 0.5) * 2,
        }
    )
}
```

### How to rotate on collision
It work similar to position but with quatonion

```javascript
object.mesh.quaternion.copy(object.body.quaternion);
```
### Fixing performances issues
**boadphase**

AN issue with cannon is that each body try to see if it's colliding with the others, and that same way each object try to verify if they have colliden with the others.

THere differents broadphase options to fix this issue
* NaiveBroadphase - test every BOdies against every other Bodies (Default)
* GridBroadphase - quadrilles the world and only tests BOdies against other Bodies in the same drid box or the neightBoards's drid boxes
* SAPBroadphase ( Sweep And Prune) - tests Bodies on arbitrary axes during multiples steps


To use the broadphase we need to change what the world.broadphase have with a new instance of CANNON and the broadphase option, and passing as parameter the world.
```javascript
world.broadphase = new CANNON.SAPBroadphase(world);
```

### Make te object Sleep
```javascript
world.allowSleep = true;
```
We can also change the `sleepSpeedLimit` and `sleepTImeLimit`

* sleepSPeedLimit
    * is what max speed will be considered as seeping

* sleepTimeLimit
    * Amount of time to be considered sleeping within the sleepSpeedLimit

## Events
Bodies have events we can attach to and listen to, like `collide`, `sleep` and `wakeup`.

We're going to add a sound when the event collide accur. Note: the sound can be prevented if we're not intereacting with the page.

Load sound
```javascript
const hitSound = new Audio('/sounds/hit.mp3');

const playHitSOund = () => {
    hitSound.play();
};
```

Subscribe into collide event fo rthe box

```javascript
    body.addEventListener('collide', playHitSOund);
```
A little solution that the sound soudns bad is by changing the currentTime to 0
```javascript
const playHitSOund = () => {
    hitSound.currentTime = 0;
    hitSound.play();
};
```

Only play the sound if there is enough interactions
```javascript
const playHitSOund = (collition) => {
    if(collition.contact.getImpactVelocityAlongNormal() > 0.5) {
        hitSound.currentTime = 0;
        hitSound.play();
    }
};
```
Add randomeness to the sound

```javascript
const playHitSOund = (collition) => {
    if(collition.contact.getImpactVelocityAlongNormal() > 0.5) {
        hitSound.volume = Math.random();
        hitSound.currentTime = 0;
        hitSound.play();
    }
};
```

Now on the createBox lets add the following to run the playHitSound when exist a collision
```javascript
body.addEventListener('collide', playHitSOund);
```

## Removing things
Remove everything fromt he scene and the world

```javascript
debugObject.reset = () => {
    objectsToUpdate.forEach(object => {
        // removing body
        object.body.removeEventListener("collide", playHitSOund);
        world.remove(object.body);

        // remove mesh
        scene.remove(object.mesh);
    })
};
gui.add(debugObject, "reset");
```
## Constrains
Can create constrants betweeWn 2 bodies
* HingeConstraint - acts ike a door hinge
* DistanceConstraint - Forces the bodies to keep a distance between each other (move together)
* LockContrant - merges the bodies like if htey were one piece
* POintTOPOintCOntraint - glues the bodies to a specific point

## Classe, Methods, properties and events
recommended to read the documentation

Examples:
https://schteppe.github.io/cannon.js

## Workers
The componetn of the computer doing the physics is the cpu.

Currently, everything is done by the same thread in the cpu.

Workers help us to creat multiple threads.

Example can be that one worker handle the physics world and the other the objects.

## Cannon-es
it's outdated
* github.com/pmndrs/cannon-es
* npmjs.com/package/cannon-es

but there are soe other folks alts

Lets try it
* first remove the cannon package `npm uninstall --save cannon`
* Note install the cannon-es `npm i --save cannon-es@0.15.1`
* Import `cannon-es` as `import * as CANNON from 'cannon-es'`

Recommended: 
> Find the folks alternatives

## Ammo.js
Is harder to use adn to implement and with more features

I'ts better and more popular, with better performance and better written.

It's based on a verry c++ popular physic engine called Bullet.

## PhysiJS
 It combines cannon js and threeJs in a simple way.

 For example
 ```javascript
 box = new Physijs.BoxMesh(
    new THREE.CubeGeometry(5, 5, 5),
    new THREE.MeshBasicMaterial{color: "red"},
 );
 scene.add(box)
 ```
 
 ## 23 - imported models (#23)

Popular formats
* OBJ
* FBX
* STL
* PLY
* COLLADA
* 3DS
* GLTF 

### GLTF
- (GL Transmission Format) made by Khronos group for OpenGl, WEwbGL, Vulkan, etc.
- Support set of data like geometries, materials, cameras, lights, scene graph, animations, skeletons, morphings, etc.
- File formats: json, binary, embed textures.
- Have became the stadars for much 3D softwres

### Where to find models
GLTF team provides models for testing at https://github.com/KhronosGroup/glTF-Sample-Models

**glTF formats**
- glTF
- glTF-Binary
- glTF-Draco
- glTF-Embedded

### **.glTF**

If you open them, they are a json-like file content with details for cameras, lghts,s cenes, materials, objects transformation, but not geometries nor textures

Also contains information about the rest files, like texture, etc.

**.bin files**

contains data like geometries (vertices positions, UV coordinates, normals, colors, etc)

**.png files**

is the texture


**Binary files**
* Contains all the same as the other
* it's easier to load
* More difficult to modify

### **Draco files**
Compress version of the data

### **Embedded**
One file as JSOn data and it contains the texture and geometry is embedded inside the file data

* Thes Most heavies of all
* 

## GLTF Loader
Import it as
```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
```
Initialization
```javascript
const gltfLoader = new GLTFLoader();

```
Load models
```javascript
gltfLoader.load(
    "path/to/the/file.gltf",
    (gltf) => {/* Loaded */},
    (progress) => {},
    (error) => {},
)
```

The gltf object received when loaded contains a lot of data. for example for the Duck we're using the mesh is inside `scene.children[0].children[1]`.

But we can add it as simple as 
```javascript
scene.add(gltf.scene.children[0])
```

After we add any object fromt he childre of the scene imported to the scene we are using, it auto pop that from the children array. so we need to copy it into a new array.

```javascript
const children = [...gltf.scene.children];

for( const child of children){
    scene.add(child)
}
```

Even simpler solution
```javascript
scene.add(gltf.scene)
```

### Draco files

website: https://google.github.io/draco/
git repo: https://github.com/google/draco

We need to provide the Draco Loader
```javascript
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
```

Note: initialize it before GLTF loader, that way the gltf use it
```javascript
const dracoLoader = new DRACOLoader();
const gltfLoader = new GLTFLoader();
```

The decoder is available in Web Assembly, and it can be run in a worker to improve performances.

ThreeJS provided it in the `node_modules/three/examples/js/libs/` folder.

> * it recommends to copy the draco folder that is inside that libs folder and copy it into the `/static` folder, that way ti can load the decoder.wasm and other it need.
> * And after that, set the decoder to `/draco/`
> ```javascript
> dracoLoader.setDecoderPath('/draco/');
> ```

Then set the draco loader to the gltf loader
```
gltfLoader.setDRACOLoader(dracoLoader);
```
here's a full example of using the draco loader
```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
```

### Animations 
- The gltf object contains an `array` of animation clips. SO we'll need to create an AnimationMixer.
- AnimationMixer is like a player associated with an object that can contain one or many animationClips

Create the mixer
```javascript
const mixer = new THREE.AnimationMixer(gltf.scene);
```
The parameter it receives is the object we're going to animate

To add the animationt ot he mixer, and we receive the action
```javascript
const action = mixer.clipAction(gltf.animations[0]);
action.play();
```
After adding the action adn play the action, we need to tell the mixer to update it.

```javascript
let mixer = null;

/* on the gltf loader*/
mixer = new THREE.AnimationMixer(gltf.scene);


/*on the ticket, near to the update controls*/
if(mixer){
    mixer.update(deltaTime);
}
```

### ThreeJS Editor
Is a online 3D software
https://threejs.org/editor/


## 24 - Custom models with blender

### Interface
each section of the screen are called *Areas* which can be change their positions.

we can split areas
* To do that so, we need to hover the mouse on the left top corner of an area, then left click, drag and drop to devide the area into a new sub areas
* we can also un-split areas, by dragin and frop a little from above the area we want t otake over the other, then drag it into the other one.

### Shortcuts
* find cheatsheet and memorize them
* shortcuts are area sensitive, so they will react to the selected/hovered aread
* mode sensitive
* os sensitive

shortcuts:
* https://docs.blender.org/manual/en/latest/interface/keymap/introduction.html
* https://www.republicworld.com/technology-news/apps/blender-shortcut-keys-list-of-all-the-blender-commands-that-come-handy.html


### View
Reccommended to use mouse with middle wheel
if not, use the 2 fingers as the same alternative

### *Orbit rotate*
we can rotate the camera with the orbit rotate with middle mouse or 2 fingers on touch pad

### Truck and pedestal
* Truck is horizontal (left and right)
* pedestal is vertical (up and down)

This is used by adding shift to the middle mouse/double fingers

### Dolly
with the whill to dolly, similar to zoom in and out
but dolly with scroll wheel or equivalente, have a limit of zoom
to surpase that we use `shipt + control + middle mouse  + mouse forward or backward`

### Tilt and pan
To use this we need to change the viewport mode to `Walk Mode` or also called `Fly mode`
To activate the walk mode the shortcut is `shift + back quote` ( ` )

To exit te walk mode use `esc` or `enter`

If doesn't have the backtick (back quote) we cant modify it on `Edit > Preferences`, Keymap, View navigation and change theView navigation (walk/fly). and choose someting like `shipt + f`.

This let us navigate like fly mode on games with awsd or the arrows keys and with shift it moves faster.

### Perspective / Orthographic
we can switch between them with `numpad 5`

### Axes
we can change between them by pressing numpad 1, 3 and 7, which change the x y or z axes for the camera

By pressing control and tha number it goes into the opposive view

Default axes going upward is the `z` axe, like in treeJs

### Camera view
by presing numpad 0 we get the camera view

with `shift + c` we get back into the scene

### Reset
if we want to set the view into an object, first select iwth with left click then hit `numpad ,` and it will feel the screen with that object and it also change the point of view for the rotations.

## focus and hide
Use `numpad /` will focus on that obect and hide everything else
Can also select multiple objects
To get back to normal select it back


### Selecting
left click let us select
to multi select use `shipt + left click` 

ACtive object
the brighter outlined object is the active one
we cna only have one active object

### Notes
* we can undo selections with `ctrl +z`
* We can unselect by `shift + left click` the active object
* Select everything with `A`
* unselect everything with double A
* select a rectagle are with `B`
* select like painting with `C` (use wheel to change the size)
  * By pressing shift and selecting it will unselectd then (with B and C shortcuts)

### Create objects
* move the mouse over a section of the viewport then press `shift + A` and it will load a menu
* After creating the object we'll be able to visualize a tab ont he botton left corner of that viewport that will let us change properties of the new create object
* Also to see those properties if we lose then by pressing `F9`

**Remove object**

by pressing `X`


**Hide an object**
* We can hide an object by selecting `H`
* to show everything that have been hiden with `alt + H`
* Hide Non Selected object with `shift + H`

### Transforming objects
* Position `G`
* Rotation `R`
* Scale `S`

Press `T` to show or hide the menu on the left of the VIewpart - THis menu have the transforming options

After selecting the transforming option, by pressing `shipt + axes` it will only move on that axes, for example: pressing `G` for changing the possition then pressing `shift + z` will only move the object on the Z axes.


### Modes
To change the modes, there are 2 main options, one is on the view port theres is a select dropdown on the top left part of the 3d viewport and the 2nd option is by pressing `CTRL + tab`

Also we can shange from object to edit mode just by pressing `tab`.

**Edit mode** is based to change the vertices, edges and faces.

To switch between edit modes:
* THere options on the top left corner section of the 3d viewport
* Or just by pressing one of the 3 first numbers `1`, `2` and `3`.

### Shading
* its how we see the objects on the `3d view port`
* the default is `Solid` and it's based on performance
* Can change the shading modes from the top right corner of the `3D view port`
  * or by pressing `z`

**Shading modes**
* Solid - default
* Material - show a preview of the material  no realistic
* Wireframe
* Renderer - low quality render and more realistinc than material
  * shades, textures, and more.

### Properties
This is one of the panels/menus
it shows 
* render properties, 
* enviroment prperties 
* and active objects properties

**Object properties**
* have the properties we can change with g, r, s and more.
Object Modifyer
* this have non destructive modifiers.

**Material properties (redish circle icon)**
* Default material is `Principled BSDF`
  * which is similar to Mesh on used with ThreeJS

### Render Engines
We need to hange the mode to renderer

**Types**
* Eevvee - default - 
  * realtime render engine
  * uses GPU
  * Very eprformante
  * Limitation like realism, light bounce, refrection and refraction
* workbench
  * Legacy render
  * not used a lot
  * Performant
  * not verry realistic
* Cycles
  * Ray tracing engine / path tracing
  * very realistic rendering
  * Handles light bounce, deep reflection, deep refraction,etc.
  * Can be tremendouslyt long/time consuming

### Rendering
Press F12 to render through the camera
then we can save the render.
set rendered mode with `Z`

### Search
Press `F3` then it open the search panel.

### Save Our Setup
File -> defaults -0> save setup file
then it will save a defauylt setup witht he current default

### Hhamburger time
First deside on unit scale
its based on.
we can change it fromt the scene properties, and on the units section change the Unit System 

### Bottom bun
* need to be on solid mode
Note: always scale on edit mode so the scale never change

**add modifier**
Subdivision modifier, this help us create new shapes from a base shape, like having a cube and converting into a sphere
What this does is having a base shape and then subdividing it into smaller shapes
Note: This can help us to have like surface spacing based on a cube for collitions and so on.

we can cut an object to subdivide it to generate new shapes based on adding new faces or edges.
to do that so we use the `loop cut` which can be searched by `F3` or by pressing `ctrl + r`.

**Save file**
when saving we can use `ctrl + s`.
but after the first time we save a file, when we save again Blender will create a blend1 file which is a backup save for the previous saved version.

**Duplicate**
Use `shift + D`

Use the duplication to create the meat for the hamburger. then modify its parts to shape as you want
**Cheese**
then for the cheese, use a plane, create it by `shipft + a` , select plane then press tab to enter edit mode so after that we scale it and change it sizes and positioning on top of the meat.

Now to give the cheese some shape to the cheese with subdiving, first select the whole plane face then press  right click and subdivide. after that a menu will appear in the bottom left corner with the subdivisions options and give it an amount of 10 subdivisions.

now use edge selection mode and select 1 of the edges we want to "meld down" to the cheese, then use the shortcut `O` to toggle the proportionality of the edges.
we cna also change the way the proprortionality behave. ALso we can uise scroll to have a bigger or smaller proprortionality.
At the end add the modifier `Solidify` to the cheese.

Also to make the cheese look more natural go to `Data object properties` and find the normals, and check the auto smooth there to have a more squared edges

**Top Bun**
dupliucate button bun and rotate it. Use control to have exact numbers.

### Adding materials
* Activate the renderer shading
* Create the materials
  * one for the buns, one for t he meat and one for the cheese
* play twith their color and roughness
* rename the materials

**ADding materials**
Select an object, Create custom material, rename them and play with the colors and the roughness.
Now do the same with each object.

### Export
Select only the hamburger objects (exclude the lights).

* Then go to file -> export -> gltf
* On there use the file extention as you like, for this example glb for the binary one.
* then on Include section, select limit to selected objects
* Under mesh sselect APply modifiers, Normals and vertex colors
* Under material select export and auto
* and use compression
* Also set the +y conversion as checked

Now run the project and add the hambuerger to the project models
Note: the hamburger will look bad.


## 25 - Realistic Renders

First we need to add some lights and the materials for the 
* Change material of testSphere From `MeshBasicMaterial` to `MeshStandardMaterial`
* Add one small directional light

Add twichs tto the gui to add the intensity of the light and the position of the light.
Now we need to add physically correct lights values, to be able to have consistency to the renderer.
`renderer.physicallyCorrectLights = true`

**Now import he model**
* First import and start the loaders (GLTFLoader)
* if the model is compress use the draco loader.

then  load the model
```javascript
gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        gltf.scene.scale.set(10, 10, 10);
        gltf.scene.position.set(0, -4, 0);
        gltf.scene.rotation.y = Math.PI / 2
        scene.add(gltf.scene)

        console.log('success');
        console.log(gltf);

        gui.add(gltf.scene.rotation, 'y')
        .min(- Math.PI)
        .max(Math.PI)
        .step(0.001)
        .name('rotation');
    }
)
```
### Environment map
First import the loader
```
const cubeTextureLoader = new THREE.CubeTextureLoader();
```

then initialize the load process and change the scene background with this new env map
```javascript
const environmentMaps = cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg',
]);
scene.background = environmentMaps;
```

Now apply the envmap to the model
there's a way to update all materials on the whole scene.
```javascript
const updateAllMaterials = () => {
    scene.traverse((child) => {
        console.log(child)
    })
}
```
