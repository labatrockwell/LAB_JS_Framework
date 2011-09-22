uniform vec3 center;
uniform float radius;
/*
 uniform mat4 objectMatrix;
 uniform mat4 modelViewMatrix;
 uniform mat4 projectionMatrix;
 uniform mat4 viewMatrix;
 uniform mat3 normalMatrix;
 uniform vec3 cameraPosition;
 uniform mat4 cameraInverseMatrix;
*/
void main() {
   vec4 pos = objectMatrix * vec4( position, 1.0 );
   vec3 delta = normalize( pos.xyz - center) * radius;
   
   vec4 ecPos = viewMatrix * vec4( delta + center, 1.);
   gl_Position = projectionMatrix * ecPos;
   
}