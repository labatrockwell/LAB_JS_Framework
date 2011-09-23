uniform vec3 col;
varying vec3 vcol;

varying float mi;
void main() {
   gl_FragColor = vec4( vcol * col, 1.);// vec4( vec3(1.)-col, 1. );
}