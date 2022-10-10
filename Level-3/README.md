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

We can also add a defautlContact material to the physic world

```javascript
world.defautlContactMaterial = defaultContactMaterial;
```

ANd we need to create the mterial acording to the defaults values we need.



