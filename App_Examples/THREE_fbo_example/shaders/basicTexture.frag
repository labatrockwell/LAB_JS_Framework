uniform sampler2D inTex;

varying vec2 texCoord;

void main(void)
{
   gl_FragColor = texture2D( inTex, texCoord );
}