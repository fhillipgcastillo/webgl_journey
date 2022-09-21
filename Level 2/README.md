# 15 - Light (#15)
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

