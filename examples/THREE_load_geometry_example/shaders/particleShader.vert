
uniform float amplitude;

attribute float size;

attribute float xOffset;
attribute float yOffset;

varying vec3 vColor;
varying vec2 texOffset;
varying float angle;

float perlin(vec3 p) {
   vec3 i = floor(p);
   vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
   vec3 f = cos((p-i)*acos(-1.))*(-.5)+.5;
   a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
   a.xy = mix(a.xz, a.yw, f.y);
   return mix(a.x, a.y, f.z);
}

void main() {
   float perlinScale = .01;         
   vColor = vec3( 1., 1., 0.);
   texOffset = vec2( xOffset, yOffset );
   
   
   gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
   
   float perl = perlin( position * perlinScale ) + 10.;
   gl_PointSize = 5. + 20. * abs(perlin( position * perlinScale ));
   angle = ( position.x+position.y+position.z)*.125;
}
