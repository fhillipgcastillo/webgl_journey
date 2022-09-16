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
```
camera.lookAt(new THREE.Vector3(0,0,4))
```
Or we can make it look at the mesh or any object we have created like so
```
camera.lookAt(mesh.position)
```

### Scne graph
We can group to alter all of them simultaneously

We can add a group as simple as followed
```
const group = new THREE.Group();
```

we can add it normally to the scene, so then all the children we only need to add them to the group, and if that group was added to the scene, so all the childrem object will be also rendered

TO add achildre to the group just use the `.add` method, same as we use on scene
```
group.add(boxMesh1, circleMesh1, ...)
```

## Animation
Animation work as same as stop motion, but at high frame rates, let say 60fps and each one it render to the scene
To be able to do this we need to do the `window.requestAnimationFrame(...)` which in threejs have it own method to do this.

Request animationFrame is in charge to call a function once on the next frame

### Example of an animation defining a tick/loop/etc. 
```
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
```

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
```
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
```
npm install --save gsap
```
