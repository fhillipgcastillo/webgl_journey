# Level 4 - Shaders (lvl4)

## 27 - Shaders {#27}
We're going to create custom renders in this level.
**Context**
* What is it
* Create simple shader
* Learn the syntax
* do exercises


### Shaders
* Shaders are the main components of WebGL
* Program written in GLSL
* Sent to te gpu
* position of each vertext of a geometry
* colorize each visible pixel of that geometry
* Pixel is not accurate, but we're going to to use `Fragment `

### data send to shader
* vertices coordinates
* colors
* textures
* mesh transformation
* info about the camera
* lifgts
* fog
* etc.

types of shaders
* Vertex shader
* Fragment shader


### Vertex shader
* We create the shader
* we send the shader to the gpu with data like vertices coordinates, mesh trasnf, etc.
* THe gpu follows the instruction and position the vertices on the render

**uniform**
* SOme data like the mesh position are the same for every vertices.
* THose type of data are called **uniform**.

**Sumary**
* the **vertex shader** position the vertiecs on the render
* the **fragment shader** color each visible geometry's fragment (or pixel) 
* The **Fragmend shader** is executed after te **vertext shaders**.
* the informationt hat changes betweem each vertices (like position, color, texture, etc.) are called *attributes* and cn only be used in the *vertex shader**

### Writting own shader
* THis is the best option as the material are limited
* Custom shaders use to be simple and performant
* we can add custom post-processing

* We can use a `shaderMaterial` or a `RawShaderMaterial`.
   * The `shaderMaterial` will have some code automatically added to the shader code.
   * The `RawShaderMaterial` will be empty.

**Create custom shader with RawShaderMaterial**
* First change the meshbasicMaterial to `RawShaderMaterial` then provide the shader with the require informations.
* for the vertextShader use template littelats `` to write the code.
```js
const material = new THREE.RawShaderMaterial({
    vertexShader: `
        uniform mat4 projectionMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 modelMatrix;

        attribute vec3 position;

        void main() {
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        precision mediump float;

        void main(){
            gl_FragColor = vec4(0.7, 0.5, 0.65, 1.0);
        }
    `,
});
```

### Shader files
Move the vertex and fragment shaders code in
* `/src/shaders/test/vertex.glsl`
* `/src/shaders/test/fragment.glsl`

* He also recommends to add a linter

### Importing the glsl files
* Webpack can be used to import it
  * Modify the `webpack.common.js`
  * add the following into the `rules` array property
     ```
    // Shaders
    {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: [
            'raw-loader'
        ]
    }
    ```
After that we can import the glsl files as follow 
```js
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
```

Now also we can modify the Raw shader material code as followed
```js
const material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
});
```

Now we can also add the the `RawShaderMaterial` normal material properties like `wireframe`, `side` or `flatSading`.
```js
const material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    wireframe: true,
    side: THREE.DoubleSide,
});
``` 

Now properties like `map`, `alphaMap`, `opacity`, `color`, etc, wont work and we need to write these features ourself.

### GLSL
* OpenGL Shading Language (GLSL)
* Close to the C language
* Cannont do logging
*  Identation is not essential

**Variables**
* float
* int
* vec2 (vector2 or array of 2 values)
  * value can change after
  * providing only 1 value will set the same for both positions
*  vec3
   *  For setting each  value as `r`, `g` and `b` properties
     ```glsl
        vec3 color = vec3(1.0, 1.0, 1.0);
        color.r = 0.7; 
    ```
    * Also can use `x, y & z`
    * example of vec3 usages
      ```glsl
      vec2 foo = vec2(1.0, 2.0);
      vec3 bar = vec3(foo, 1.0);
      ```
* vec4
  * this one have `xyz` and (`w` or `a`) properties
**Note**: 
* the vec3 `r, g, b` or `x, y and z` are called aliaces.
* Nother type of aliases can be like `.xy`

**Functionas**
* syntax is `return value type` then `function name` and `()`.
   ```glsl
   float floatSum() {
    return 1.0 + 1.0;
   }
   ```
* built-in classic functions `sin`, `cos`, `min`, `max`, `pow`, `abs`, `exp`, `mod`, `clamp`.
* Also other fractical functions like `cross`, `dot`, `length`, `normalize`, `length`, `distance`, `reflect`, refract, step, mix, dot, etc.

**Extra resource** (no beginner-friendly docs)
* Shaderific
* Kronos group registery (for openGL)
* Book of shaders glossary
  
Search for those



