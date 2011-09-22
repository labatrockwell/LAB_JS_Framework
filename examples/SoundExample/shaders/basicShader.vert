uniform vec3 lightPos;

varying vec4 lPos;
varying vec4 ecPos;
varying vec3 norm;

void main() {
   norm = normalMatrix * normal;
   ecPos = modelViewMatrix * vec4( position, 1.0 );
   gl_Position = projectionMatrix * ecPos;
   
   lPos = viewMatrix * vec4( lightPos, 1.0 ); //GET LIGHT POSITION USING viewMatrix, THIS IS OUR CAMERA's SPACE?
	lPos = ( (lPos - ecPos)); 
   
}