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

