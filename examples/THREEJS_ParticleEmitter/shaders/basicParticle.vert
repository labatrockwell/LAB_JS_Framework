
attribute float radius;
attribute vec3 pColor;

varying vec3 col;

void main()
{	
   vec4 ecPos = modelViewMatrix * vec4(position, 1.);
	gl_Position = projectionMatrix * ecPos;
   
   col = pColor;
//	gl_PointSize = radius;
   
   //attenuation
	gl_PointSize = clamp( 100. * radius/length(ecPos), 1.0, 120.0);
}