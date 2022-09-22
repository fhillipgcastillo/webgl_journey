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
