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
