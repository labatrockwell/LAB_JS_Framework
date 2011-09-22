uniform vec3 blurSamples[25];//5x5
uniform sampler2D inTex;
uniform vec2 texDimInv;
uniform float radius;
uniform float mult;

varying vec2 texCoord;

void main(void)
{
   vec2 tcOffset = texDimInv * radius;
   for(int i=0; i<25; i++){
      gl_FragColor += texture2D( inTex, texCoord + blurSamples[i].xy * tcOffset ) * (blurSamples[i].z * mult);
   }
}