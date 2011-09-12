uniform vec3 col;

varying vec4 lPos;
varying vec4 ecPos;
varying vec3 norm;


void main() {
	float fr = dot( normalize(lPos.xyz), normalize(norm) ) * .5 + .5;
   fr = pow( fr, 2. );
   gl_FragColor = vec4( mix( vec3(1.)-col, col, fr), 1. );
}