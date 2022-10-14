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