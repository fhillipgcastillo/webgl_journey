# 15 - Light (#15)

**TO DO**
> This relationship summary have to be like, XLight is like a lightbulb and it's low GPU cost
* [ ] Create a relationship summary of the lights
* [ ] Create a relaship summary of the basic parts, Geometry, Texture, Material and Mesh


## Ambient light
IT's applied omnidirectional lighting
### Parameters
1. color
2. intensity

```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
```
Light bouncing is really hard, so we use ambienLigt to simulate the bounce lighting.

## Directional Light
```javascript
const directionalLight = new THREE.DirectionalLight(0x00fffc, 1);
scene.add(directionalLight);
```

> **Note:** The distance from the object doesn't matter too much, except for the shadows (which will be discussed later)

## HemisphereLight
 THis one handle 2 colors sky and ground colors, which they will transision from the sky on the top to the ground color, gradually, having a mixed color in the mid.

 ### Parameters
 * color (skyColor)
 * groundCOlor
 * intensity

```javascript
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.6);
scene.add(hemisphereLight)
```

## PointLight
Workes similar to a lighter, where the light starts at an infinitely small point and spreads uniformely in every directions

### Parameters
* color
* intensity

```javascript
const pointLight = new THREE.PointLight(0xff9000, 0.5);
pointLight.position.set(1, -0.5, 1);
```

> By default the light intensity doesn't face.
> 
> We can control the face distance and how fast it fades with `distance` and `decay`.
> 
> **PointLigt(** `color`, `intensity`, `distance`, `decay` **)**
> 

```javascript
const pointLight = new THREE.PointLight(0xff9000, 0.5, 4, 2);
```
## Rect Area light
Workes like a big rectangle light and really harch lighting. It's a mix beween directional light adn diffuse light.

### Parameters
* color
* intensity
* width
* height

```javascript
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 0.5, 1, 1);

```

> RectAreaLight only works with `MeshStandardMaterial` and `MesPhysicalMaterial`

**Position it**
we can move it, rotate it and also use the lookAt

> To better visualize it, sometimes is better to high the other lights and see it's cool effect.

## SpotLight
Acts like a flashlight. It's a cone of light, starting at a point and oriented in a direction.

### Parameters
* color
* intensity
* distance
  * `Distance` how far it will iluminate
* angle
  * `angle` how wide it will be
* penumbra
  * `penumbra` is how dim the edges will look like, so `0` will show a really sharp penumbra
* decay
  * `decay` how fast the light loose will be

```javascript
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);
```
### Rotating SpotLight with `target`
To rotate an spotlight we're going to use the target property

Target is an object, so we'll need to add it to the scene to being able to make it work

```javascript
spotLight.target.position.x =-1.75;
scene.add(spotLight.target);
```

## Performances
lights cost a lot when it comes into performances

### Recomendations:
* USe the lest lights posible
* Use minimal cost light for better performance

**Minimal Cost Lights**
* AmbientLight
* HemisphereLight

**Moderate cost lights**
* DirectionalLight
* PointLight

**High Cost**
* SpotLight
* ReEctAreaLight


## Baking
When we want to add a bunch of lights its better to use a 3d software. Btw baking is kind of the way or solution.

The idea is to bake the ligth into the texture. This can be done in a 3D Software. The drawback is that we cannont move the light anymore and we have to load a huge texture.

WHat baking means is to bakely design the lights into the texture image (baking), to look like it have the lights but it's kind of fake.

## Helpers
TO ease the light positioning there are ligths helpers. They will receibe as parameter the Light and an extra value

* HemisphereLightHelper
* DirectionalLightHelper
* PointLightHelper
* RectAreaLightHelper
* SportLightHelper
* Etc...

### Parameters

* light 
* size: number, 
* color?: THREE.ColorRepresentation | undefined


Example:
```javascript
const hsLHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
scene.add(hsLHelper);
```

> **SportLight**
> * doesn't have `size`.
> * It also need to get the update method called on the next frame, after moving the target.


Example:
```javascript
const helper = new THREE.SpotLightHelper(spotLight);
scene.add(helper);

// Update on next frame
window.requestAnimationFrame(()=> {
    helper.update();
});

```


### RectAreaLightHelper
This light isn't part of three so we must import it

```javascript
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
// .
// .
// .
const ralHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(ralHelper);
```


Now we need to fully update its position on the next frame manually

```javasscript
window.requestAnimationFrame(()=>{
    ralHelper.position.copy(rectAreaLight.position);
    ralHelper.quaternion.copy(rectAreaLight.quaternion);
    ralHelper.update();
});
```

# 16 - Shadows (#16)
By Default the object have what is called **Core Shadow**. It is the dark shadow in the back of the objects when we add the lights.

What is missing is the **drop shadows**.


### How to activate shadows
Enable shadowMap to the renderer

```javascript
    renderer.shadowMap.enabled = true;
```

objects can receive shadows and/or cast shadows

```javascript
sphere.castShadow = true;
plane.receiveShadow = true;

```

**Type of lights that support shadows**

* PointLight
* DiretionalLight
* SportLight

We also need to enable the light to cast a shadow
```javascript
directionalLight.castShadow = true;
```


### Shadow Optimization
Optimize render size

modify the light

by giving the shadow mapSize a width and heigh
```javascript
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
```

Near and Far controls
We can access the shadow camera as:\
```javascript
light.shadow.camera
```

We can add cameraHelper to the shadows cameras
```javascript
const dlcHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dlcHelper);
```

We can control the near and the far of the shadow as:
```javascript

directionalLight.shadow.camera.near = 1.0;
directionalLight.shadow.camera.far = 8;
```

### Ampliture
To control how far each side of the camera can seem witg `top`, `right`, `bottom` and `left`

```javascript
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = -2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = 2;
```

### Shadow blur
We can cantrol it with `radius` property.
```javascript
directionalLight.shadow.radius = 10;
```

### Shadow Map Algorithm
This will change a lot the results
All are inside of `Three.`

* BasicShadowMap - Higher Performance but lower quality
* PCFShadowMap - This is the default map - High performance but smoother edges than the basic
* PCFSoftShadowMap - Lesses Performance but with even softer edges - Radius doesn't work with this algorithm
* VSMShadowMap - Less performant, more constraints, can have unexpected results
 
To udpate the shadow type we need to specify them inside the renderer
```javascript
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```
### SpotLight

```javascript
const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.position.set(0, 1, 2);

scene.add(spotLight);
scene.add(spotLight.target);

const spcHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spcHelper);
```

Getting bigger shadow mapsize

### Adding amplitud to spotlight
> Using FOV we cna control de amplitud for the spotLight 

* Spotlight is using a PerspectiveCamera
* DirectionalLight uses a DirectionalCamera

```javascript
spotLight.shadow.camera.fov = 30;
```

Changing the near and the far

```javascript
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 5;
```

### PointLight
As normal, to activate the shadows for the PointLights we just add teh castShadow to true

```javascript
pointLight.castShadow = true;
```

> PointLight uses a PerspectiveCamera for casting the shadows, but in all directions

We can tweal the mapSize, near and far

### Backing Shadows
As Normal, we should add backed shadows to places that will needed, like in this example, the plan.

First deactivate the current shadows, by disabling the renderer shadowMaps

Here's an example:
```javascript

const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshStandardMaterial({map: bakedShadow})
)

renderer.shadowMap.enabled = false;
```

### Alternative for Baking Shadows
Baked shadow that can move
Added a bake shadow of only the object shade and auto move it when the object move

```javascript
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material,
)

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow
    })
);

sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.001;
scene.add(sphereShadow);
```

Now lets animate the sphere so we can see the baked shadow move

```javascript
sphere.position.set(
    Math.cos(elapsedTime) * 1.5,
    Math.abs(Math.sin(elapsedTime * 3)),
    Math.sin(elapsedTime) * 1.5,
)
sphereShadow.position.x = sphere.position.x;
sphereShadow.position.z = sphere.position.z;
sphereShadow.material.opacity = (1 - sphere.position.y) * 0.8;
```

Which is the right solution
* His implementation was a combination of backed shadow and moving backed shadow on his page.
* The plane(floor) was a full backed shadow, the car have a backed moving shadow and all the models have full baked shadow and the scene didn't have any light on it.
* 
> https://bruno-simon.com/


# 17 - Hounted House (#17)
Hounted house create with primitive geometries

> We should consider 1 unit measurement as 1 meter

First, everything will be grouped.

To group object use `Three.Group`

```javascript
const house = new THREE.Group();
scene.add(house);
```

Now we only need to create our Meshes and add them to the house group
```javascript
house.add(boxMesh)
```

## The Graves
We'll be try to add it gradually

## add fog
`Three.Fog`

```javascript
const fog = new THREE.Fog('#ddddff', 2, 6)

scene.fog = fog; 

renderer.setClearColor("#ddddff");

```


## Textures

add the color texture
```javascript
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        aoMap: doorAmbienOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
    })
);
```

Walls
```javascript
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(wallsDetails.x, wallsDetails.y, wallsDetails.z),
    new THREE.MeshStandardMaterial({ 
        map: bricksColorTexture,
        normalMap: bricksNormalTexture,
        aoMap: bricksAmbienOcclusionTexture,
        roughnessMap: bricksRoughnessTexture,
     })
);

walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)
```

## Grass
```javascript
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map: grassColorTexture,
        normalMap: grassNormalTexture,
        aoMap: grassAmbienOcclusionTexture,
        roughnessMap: grassRoughnessTexture,
        
     })
)

floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
```

To fix issues with grass texture being too bing, we can make the patterns to repeat and make them smaller, for this we need to add those values for each grass texture, and enable wrapping for each axes.

```javascript
grassColorTexture.repeat.set(8,8);
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;

grassAmbienOcclusionTexture.repeat.set(8,8);
grassAmbienOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassAmbienOcclusionTexture.wrapT = THREE.RepeatWrapping;

grassNormalTexture.repeat.set(8,8);
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;

grassRoughnessTexture.repeat.set(8,8);
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
```

## Ghosts

```javascript
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
scene.add(ghost1);

const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
scene.add(ghost2);

const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
scene.add(ghost3);
```

### Animate the ghosts


# 18 - Particles (#18)
* Particles can be used to create `stars`, `smoke`, `rain`, `dust`, `fire`, etc.
* low cost on frame rates
* Each particle is composed of a plane (2 triangles) always facing the camera

Creation is like creating a mesh
* a geometry (bufferGeometry)
* a mterial (PointsMaterial)
* a points instance instead of a Mesh

**Simple Particles**
```javascript
const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);
const particleMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true // Closer to the camera, the bigger, and so on
});

const particles = new THREE.Points(
    particlesGeometry,
    particleMaterial
)
scene.add(particles)
```

## Custom Geomeotry

## Color, Map and Alpha Map
Particles maps
https://www.kenney.nl/assets/particle-pack

```javascript
const particleMaterial = new THREE.PointsMaterial({
    color: 'red',
    size: 0.1,
    sizeAttenuation: true,
    alphaMap: particleColorTexture,
    transparent: true,
    alphaTest: 0.001,
});
```

For fixing alpha maps transparency issue there are some value that can fix them

* alphaTest - Float - 
* deptTest - Boolean - enable or disable GPU trying to identify which is closer or farer - But can create bugs if there're other objects
* DeptWrite - Boolean

```javascript
const particleMaterial = new THREE.PointsMaterial({
    color: '#ff00ff',
    size: 0.1,
    sizeAttenuation: true, 
    alphaMap: particleColorTexture,
    transparent: true,
    // alphaTest: 0.001,
    // depthTest: false,
    depthWrite: false,
});
```
### **Material `Blending`**
Impact the GPU Performance

```javascript
particleMateria.blending = THREE.AdditiveBlending;
```

### Differents color for each particle
```javascript
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10  
    colors[i] = Math.random()
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3) );
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3) );

particleMateria.vertexColors = true;
```

## Animate

We can normally animate the whole group of particles as a normal mesh

`particles.rotation.y = elapsedTime * 0.2;`

But we cna also move then separately by accesing the  geometry attributes arruy. Btw the best solution is to use Custom Shaders.

# Galaxy Generator

Let the user create and tweck the galaxy by using the parameters in the control panel

Destroy old generated stars
```javascript
if(points !== null) {
  material.dispose();
  geometry.dispose();
  scene.remove(points);
}
```

## Shaping the galaxy
**Radius**
```javascript
const parameters = {
    count: 10000,
    size: 0.01,
    radius: 5,
    branches: 3,
};

gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);

```

Inside the generate galaxy add the following for each particle position
```javascript
    for (let i = 0; i < parameters.count; i++) {
        // generate a random radius number from 0 to 5
        const radius = Math.random() * parameters.radius;

        const i3 = i * 3 ;
        positions[i3 + 0] = radius;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = 0;
    }
```

Adding branches
```
for (let i = 0; i < parameters.count; i++) {
        // generate a random radius number from 0 to 5
        const radius = Math.random() * parameters.radius;
        const branchAngel = (i % parameters.branches) / parameters.branches * (Math.PI * 2);

        const i3 = i * 3 ;
        positions[i3 + 0] = Math.cos(branchAngel) * radius;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = Math.sin(branchAngel) * radius;
    }
```

Branches explanation:
* FIrst a radius was generated with a random values, which will be kind of how far from center it'll be
* Second we have to use mod (`%`) to equally devide by the amount of branch for the galaxy
  * first, get the mod of the current particle number wit the amount of branches (to equally align them), that way it will enver surpass the amount of branches
  * Then, devide it by the amount of branches, to get like a percetange of the circle cycle
  * Finally devide all of the previously calculus by the Pi multiplied by 2
    * which means, it will be multiply wit a max of a full 360 angle
*  Finally it modify the X, Y and Z for he particle positions
   *  need to better understand the cos and sin, but they go from a value up to 2 and the comes bck
   *  also multiply that results with the radius to position them in a straigh line from the center but in kind of a random position

## Spin the branches
First creat the parameter and add the gui
```javascript
parameter.spin = 1;
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
```

Now added the logic to the spin angle
```javascript
for (let i = 0; i < parameters.count; i++) {
    // generate a random radius number from 0 to 5
    const radius = Math.random() * parameters.radius; // radius is how long it will be from the center
    const spinAngle = radius * parameters.spin; // how much will the branch curve/spin, which it will increase on how far it gets from the center
    const branchAngel = (i % parameters.branches) / parameters.branches * (Math.PI * 2);

    const i3 = i * 3 ;
    positions[i3 + 0] = Math.cos(branchAngel + spinAngle) * radius;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = Math.sin(branchAngel + spinAngle) * radius;
}
```

### Adding some randomness
First step of randomness

```javascript
for (let i = 0; i < parameters.count; i++) {
    // ...
    // Code above
    const randomX = Math.random() - 0.5 * parameters.randomness;
    const randomY = Math.random() - 0.5 * parameters.randomness;
    const randomZ = Math.random() - 0.5 * parameters.randomness;
    
    const i3 = i * 3 ;
    positions[i3 + 0] = Math.cos(branchAngel + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngel + spinAngle) * radius + randomZ;
}
```

Better way to randomize the values and having dynamism
```javascript
for (let i = 0; i < parameters.count; i++) {
    // Code above
    
    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
    
    // Same Code bellow
}
```
* it generates a random value and multiplies it by the randomness
* then multiplay that value by a random value from 0 to 1, and if it's over 0.5 it will be multiply by it invers (-1)

## Adding colors
First add inside and ourside colors to the parameters

```javascript
const mixedColor = colorInside.clone()
mixedColor.lerp(colorOutside, radius / parameters.radius);
```

# 20 Ray Caster (#20)
Which object intersept with a ray caster

## create a raycaster

```
const raycaster = new THREE.Raycaster();
const rayOrigin = new THREE.Vector3(-3, 0, 0);
const rayDir = new THREE.Vector3(10,0,0);
rayDir.normalize(); // this normalize the vector to a length of 1, and its required by the rayCaster

raycaster.set(rayOrigin, rayDir);
```

we need to tell the initial of the raycaster and the final

### Cast a Ray
* intersectObject(...) - to test one object
* intersectObjects(...) - to test an array of objects

 
```javascript
const instersect = raycaster.intersectObject(object1);
const instersects = raycaster.intersectObjects([object1, object2]);
```

The ray can hit 1 object multiple times

**intersect array object**
* distance - distance between the origin of the ray and the collision point
* face - which face of the geomeotry
* faceIndex
* object
* point - vector the position in hte 3d space of the colision
* uv - the 2d coordinates of that geometry uv
* lenght
* __proto__: Object

# Test on each  frame
ITs heaving for being used on each frame, be carefull

**First animate the objects**
```javascript
// animate objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    object2.position.y = Math.sin(elapsedTime * 0.6) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 0.9) * 1.5;
```

**Cast a ray**
```javascript
//cast a ray
const rayOrigin = new THREE.Vector3(-3, 0, 0);
const rayDirection = new THREE.Vector3(1, 0, 0);
rayDirection.normalize();

// position the ray
raycaster.set(rayOrigin, rayDirection);
```

**Shoot the ray**
```javascript
// shoot the ray
const objects = [object1, object2, object3];
const intersects = raycaster.intersectObjects(objects);

// set every object color to red
objects.forEach(obj => obj.material.color.set("#ff0000"));

// set intersecting objects to blue
for( const intersect of intersects) {
    intersect.object.material.color.set('#0000ff');
}
```

## Use raycaster with the mouse
* first we need to ge the mouse coordinates and no the pixels

```javascript
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e)=> {
    mouse.x = e.clientX / sizes.width * 2 - 1;
    mouse.y = -(e.clientY / sizes.height) * 2 + 1;
    // console.log(mouse);
});
```

**Now we set the  position from the mouse and camera positions**
```javascript
//cast a ray
raycaster.setFromCamera(mouse, camera);

// shoot the ray
const objects = [object1, object2, object3];
const intersects = raycaster.intersectObjects(objects);

// set every object color to red
objects.forEach(obj => obj.material.color.set("#ff0000"));

// set intersecting objects to blue
for( const intersect of intersects) {
    intersect.object.material.color.set('#0000ff');
}
```

## Mouse enter and mouse leave events

```javascript
const currentIntersect = null;

if(intersects.length) {
    if(currentIntersect === null) {
        console.log("mouse enter");
    }
    currentIntersect = intersects[0];
} else {
    if(currentIntersect) {
        console.log("mouse leave");
    }
    currentIntersect = null;
}
```

## action on click

```javascript
window.addEventListener('click', (e) => {
    if(currentIntersect) {
        console.log("object clicked");
    }
});
```

# 21 - Scroll Based Animation (#21)

**Html Scroll**
First we need to have the html and body to `overflow: hidden;`

The page background and the webgl canvas background are differents, so  we could match them or we can add a transparent backgorund to the canvas by adding flag `alpha: true` to the renderer.

```javascript
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
})
```


