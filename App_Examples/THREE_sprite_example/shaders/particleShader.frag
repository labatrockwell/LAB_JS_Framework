uniform sampler2D particleTexture;
varying float dist;

void main(){
	vec4 col = texture2D( particleTexture, gl_PointCoord.xy );// * 128.);
//	if(col.a < .1 )	discard;
	gl_FragColor = col;// vec4( col.xyz * dist, 1.);
}
