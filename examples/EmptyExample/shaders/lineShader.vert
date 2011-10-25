uniform mat4 mvMat2;

void main() {
   vec4 ecPos;
   if(color.x == 1.){
      ecPos = mvMat2 * vec4( position, 1.0 );
   }else{
      ecPos = modelViewMatrix * vec4( position, 1.0 );
   }
//   vec4  ecPos = tMat * vec4( position, 1.0 );
   gl_Position = projectionMatrix * ecPos; 
   
}