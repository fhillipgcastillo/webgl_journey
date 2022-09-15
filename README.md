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
