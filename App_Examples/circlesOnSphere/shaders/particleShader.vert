uniform float attScale;
uniform float radius;
varying float dist;

void main()
{	
	//gl_TexCoord[0] = uv;
	vec4 ecPos = modelViewMatrix * vec4(position, 1.);
	gl_Position = projectionMatrix * ecPos;
   
	//particle attenuation
	dist = attScale/length(ecPos);	
	gl_PointSize = clamp( radius * dist, 1.0, 120.0);
}