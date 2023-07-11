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

