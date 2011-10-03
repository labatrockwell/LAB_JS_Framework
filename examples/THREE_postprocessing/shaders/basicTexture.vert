varying vec4 ecPos;
varying vec2 texCoord;

void main() {
   
   ecPos = modelViewMatrix * vec4( position, 1.0 );
   texCoord = uv;
   gl_Position = projectionMatrix * ecPos;// modelViewMatrix * vec4( position, 1.0 );
   
}