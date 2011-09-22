uniform vec3 col;

varying float mi;
void main() {
   gl_FragColor = vec4( vec3(1.)-col, 1. );
}