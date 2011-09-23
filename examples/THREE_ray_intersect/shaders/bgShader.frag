uniform vec3 colTop;
uniform vec3 colBottom;
varying float yPos;

void main() {
   vec3 col = mix( colBottom, colTop, pow(yPos, 3.));
   gl_FragColor = vec4( col, 1. );
}