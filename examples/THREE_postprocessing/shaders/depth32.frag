uniform float nearClip;
uniform float farClip;

float LinearizeDepth(float d, float _nearClip, float _farClip)
{
   return (2.0*_nearClip)/(_farClip+_nearClip-d * (_farClip-_nearClip));
}

vec4 pack (float depth)
{//http://www.devmaster.net/forums/showthread.php?t=17419
   const vec4 bitSh = vec4(16777216.,  //256.*256.*256.,
                           65536.,     //256.*256.,
                           256.,
                           1.0);
   const vec4 bitMsk = vec4(0.,
                            0.00390625, //1.0/256.0,
                            0.00390625, //1.0/256.0,
                            0.00390625);//1.0/256.0);
   vec4 comp = fract(depth * bitSh);
   comp -= comp.xxyz * bitMsk;
   return comp;
}

void main() {
//   float nearClip = 10.;
//   float farClip = 1000.;
   gl_FragColor = pack( LinearizeDepth(gl_FragCoord.z, nearClip, farClip));
}