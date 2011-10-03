
uniform vec3 tcScl;
uniform sampler2D texture;

varying vec3 vColor;
varying vec2 texOffset;
varying float angle;

vec2 rotTexCoord( float angle, vec2 tc ) {
   vec2 v = tc*2. - 1.;
   return vec2(v.x*cos(angle) - v.y*sin(angle), v.x*sin(angle) + v.y*cos(angle))*.5 + .5;
}

void main() {
   //rotate tc
   vec2 rt = rotTexCoord( angle, gl_PointCoord.xy );
   if(rt.x > 1. || rt.y > 1. || rt.x < 0. || rt.y < 0.){
      discard;
   }
   vec2 sampCoord = rt * tcScl.xy + texOffset;
   float step = 2./1024.;
   vec4 texCol = texture2D( texture, sampCoord);
   
   if(texCol.a < .01)   discard;
   texCol += texture2D(texture, sampCoord + vec2(  -step,-step));
   texCol += texture2D(texture, sampCoord + vec2(   step,-step));
   texCol += texture2D(texture, sampCoord + vec2(   step, step));
   texCol += texture2D(texture, sampCoord + vec2(  -step, step));
   //         texCol += texture2D(texture, sampCoord + vec2(  -step, 0.  ));
   //         texCol += texture2D(texture, sampCoord + vec2(   step, 0.  ));
   //         texCol += texture2D(texture, sampCoord + vec2(   0.  , step));
   //         texCol += texture2D(texture, sampCoord + vec2(   0.  ,-step));
   //         texCol /= 9.;
   texCol /= 5.;
   
   if( texCol.a < .1 ){
      discard;
   }
   texCol.a *= texCol.a;
   
   gl_FragColor = texCol;
   
}