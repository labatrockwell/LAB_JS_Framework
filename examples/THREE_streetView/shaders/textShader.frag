uniform sampler2D textTex;
uniform sampler2D offsetTex;
uniform float dist;

varying vec2 texCoord;

void main() {

   vec2 offsetSample = (texture2D( offsetTex, texCoord)*2.-1.).xy * dist;
   vec2 ts = vec2( mod(texCoord.x + offsetSample.x, 1.),  mod(texCoord.y + offsetSample.y, 1.));
   vec4 col = texture2D( textTex, ts );
   gl_FragColor = col;
}