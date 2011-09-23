varying float yPos;

void main() {
   yPos = 1.1 - (position.y*.5+.5);
   yPos *= yPos;
   gl_Position = vec4( position, 1.0 );
}