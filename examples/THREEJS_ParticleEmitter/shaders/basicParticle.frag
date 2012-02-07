uniform sampler2D tex;

varying vec3 col;

void main(){
   vec4 c = texture2D( tex, gl_PointCoord.xy );
   if(c.w < .3)  discard;
	gl_FragColor = vec4( col * .7 + c.xyz*.4, c.w);
}
