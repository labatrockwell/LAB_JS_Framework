uniform sampler2D inTex;
uniform vec2 texDim;
varying vec2 texCoord;

void main(void)
{
   //basic box filter
   for(int i=-1; i<2; i++){
      for(int j=-1;j<2;j++){
         gl_FragColor += texture2D( inTex, texCoord + vec2( i, j )/texDim );
      }
   }
   gl_FragColor /= 9.;
}