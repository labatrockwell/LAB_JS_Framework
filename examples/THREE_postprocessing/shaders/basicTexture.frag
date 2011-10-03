
uniform float sampleRadius;
uniform float maxThreshold;
uniform float minThreshold;
uniform float exponent;
uniform sampler2D inTex;
uniform sampler2D normTex;
uniform vec3 ssaoSamples[23];
uniform float time;

varying vec4 ecPos;
varying vec2 texCoord;

float rand(vec2 n){
   return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}

float unpack (vec4 colour)
{//http://www.devmaster.net/forums/showthread.php?t=17419
   const vec4 bitShifts = vec4(5.960464477539063e-8,  //1.0/(256.*256.*256.),  //
                               0.0000152587890625,    //1.0/(256.*256.),
                               0.00390625,            //1.0/256.,
                               1.);
   return dot(colour , bitShifts);
}

void main(void)
{
   float depth = unpack( texture2D(inTex, texCoord) );
   if(depth == 1.){
      gl_FragColor = vec4(1.);
   }
   else{
      vec3 norm = texture2D(normTex, texCoord).rgb * 2. - 1.;//
      float noise = rand( texCoord + time ) * .15 + .85;

      float radius = (1.-depth) * sampleRadius * noise;
      vec3 ray;
      
      float ao = 1.;
      float alpha = 1.;
      float minThresh, delta, sDepth;
      for(int i=0; i<23; i++){
         ray = reflect( ssaoSamples[i], norm)*radius;
         minThresh = minThreshold - ray.z;
         delta = max( 0., depth- unpack(texture2D(inTex, texCoord + ray.xy)) - minThresh);
         ao += (delta < minThresh ) ? 1. : min(1., delta/maxThreshold);
      }
      
      
      gl_FragColor = vec4( vec3( pow( ao/22., exponent) ), alpha);// vec4( vec3(depth * noise) , 1. );
   }
}

//void main(void)
//{
//   float depth = unpack( texture2D(inTex, texCoord) );
//   float radius = sampleRadius;
//   radius *= (1.-depth) * (mod(gl_FragCoord.x + gl_FragCoord.y, 2.) + 1.);
//   
//   vec3 ray;
//   float delta;
//   
//   float ao = 1.;
//   float alpha = 1.;
//   vec3 norm = texture2D(normTex, texCoord).rgb;// * 2. - 1.;//
//   if(depth < .01 ){
//      ao = 24.;
//      alpha = 0.;
//   }else{
//      for(int i=0; i<24; i++){
//         //ray = ssaoSamples[i]*vec3(radius, radius, -radius);// 
//         ray = reflect( ssaoSamples[i], norm)*radius;
//         float minThresh = minThreshold - ray.z;
//         delta = depth- unpack(texture2D(inTex, texCoord + ray.xy)) - minThreshold - ( ray.z );
//         ao += (delta < minThreshold - ray.z ) ? 1. : min(1., delta/maxThreshold);
//      } 
//   }
//   gl_FragColor = vec4( vec3( pow(ao/24., exponent) ), alpha);//vec4( pow(ao/23., 1.) * norm, alpha);
//}

/*
 "uniform float time;
 uniform bool grayscale;
 uniform float nIntensity;
 uniform float sIntensity;
 uniform float sCount;
 uniform sampler2D tDiffuse;
 varying vec2 vUv;
 void main() {
    vec4 cTextureScreen = texture2D( tDiffuse, vUv );
    float x = vUv.x * vUv.y * time *  1000.0;
    x = mod( x, 13.0 ) * mod( x, 123.0 );
    float dx = mod( x, 0.01 );
    vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );
    vec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );
    cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;
    cResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );
    if( grayscale ) {
       cResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );
    }
    gl_FragColor =  vec4( cResult, cTextureScreen.a );
 }"
 */

