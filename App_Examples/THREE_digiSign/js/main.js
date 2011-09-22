// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require("js/lab/app/ThreeApp.js");
LAB.require("js/utils/utils.js");
LAB.require("models/holyMesh.js");
//LAB.require("shaders/basicShader.vert");

var demoApp;

$(document).ready( function() {
                  DemoApp.prototype = $.extend(true, LAB.app.ThreeApp.prototype, DemoApp.prototype);
                  demoApp 	= new DemoApp();
                  // is there a good way to call this automatically?
                  demoApp.begin();
                  });

// ===========================================
// ===== DEMO APP
// ===========================================

DemoApp = function(){
   LAB.app.ThreeApp.call( this );		
   
   var _self = this;
   
   var lastMouse = {x:0, y:0};
   var elapsedTime;
   var camera;	
   
   var bgScene;
   var particleScene;
   var geometry, mesh;
   var curves = [];
   var triangle_geom, triMat, trimesh;
   var mouseX = 0, mouseY = 0;
   
   var pOnCnodes = [];
   
   var windowHalfX = window.innerWidth / 2;
   var windowHalfY = window.innerHeight / 2;
   
   varelapsedTime= 0;
   var lastTime = 0;
   var deltaTime = 0;
   

   //to change the colors replace these. there arranged in pairs of dark and light( drakblue, lightblue )
   var colPal = [[0x639AFF, 0x2C42AA],
                 [0xFE2C3B, 0xA50423],
                 [0xFFDD49, 0xFF9600],
                 [0x1ACA2E, 0x00810E]];
   
   
   var colMaterials = [];
   
   
   var particleSystem;
   var pGoals = [];
   var pVels = [];
   var attributes;
   
   var lines = [];
   var lines_particleIndices = [];
   var lines_verts = [];
   var jumpTime = 0;
   
   
   //animation attributes
   var globeLineWidth = 1;
   var globeScale = 25;
   
   var numQuads = 30;            //multi colored triangles
   
   var crvrad = 200;             //radius of control curves that guide all the animation
   var numCVperCurve = 25;       // num control vertices per curve
   var poncIncrement = .000125;  //speed of triangles' flow
   var crvDeflection = 100.;      //amount of up and down motion of control curves
   
   var particleCount = 100;      
   var partAttenuation = .999;  
   var partAccel = .01;
   
   var numLines = 10;
   var jumpIncrement = .005;     //time between randomly reassigning curve targets
   
   
	// ===========================================
	// ===== SETUP
	// ===========================================
   
   
   this.setup = function (){
      // catch mouse events!
      this.registerMouseEvents();
      
      //cameras
      camera = new LAB.three.Camera( 35, window.innerWidth / window.innerHeight, .1, 1000 );
      camera.setToWindowPerspective();
      
      camera = new THREE.Camera();
      camera.projectionMatrix = THREE.Matrix4.makeOrtho( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
      
      bgScene = new THREE.Scene();
      particleScene = new THREE.Scene();
      
      //background gradient
      var bgMatUniforms = {
      colTop: { type: "v3", value: new THREE.Vector3( .988, .831, .259) },
      colBottom: { type: "v3", value: new THREE.Vector3( .906, .608, .184 ) },
      };
      var bgMat = new LAB.three.Shader({uniforms: bgMatUniforms,
                                       name: 'shaders/bgShader',
                                       depthTest:      false,
                                       } );
      
      var quad = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), bgMat );
      
      bgScene.addObject( quad );
      
      //curves
      var curveMat = new THREE.LineBasicMaterial( { color: 0xff0303, opacity: 1, linewidth: 2, depthTest: false } );//not rendered
      curves.push( addCurve( curveMat, numCVperCurve, 30, window.innerWidth / 1.8, .03 * window.innerHeight ) );  
      curves.push( addCurve( curveMat, numCVperCurve, 20, window.innerWidth / 1.8, .02 * window.innerHeight ) ); 
      curves.push( addCurve( curveMat, numCVperCurve, 30, window.innerWidth / 1.8, .01 * window.innerHeight ) ); 
      curves.push( addCurve( curveMat, numCVperCurve, 30, window.innerWidth / 1.8, .01 * window.innerHeight ) ); 
      curves.push( addCurve( curveMat, numCVperCurve, 30, window.innerWidth / 1.8, .01 * window.innerHeight ) ); 
      curves.push( addCurve( curveMat, numCVperCurve, 10, window.innerWidth / 1.8, .01 * window.innerHeight ) ); 
      curves.push( addCurve( curveMat, numCVperCurve, 30, window.innerWidth / 1.8, .07 * window.innerHeight ) ); 
      
      //triangles
      triangle_geom = new THREE.Geometry();
      triangle_geom.dynamic = true;
      
      for(var i=0; i< numQuads; i++){
         makeQuad( triangle_geom , labRandom( .051, .949 ));
      }
      
      for(var i=0; i<pOnCnodes.length; i++){
         evalPointOnCurve( pOnCnodes[i] );
      }
      for(var i=0; i<pOnCnodes.length; i++){
         triangle_geom.vertices.push( new THREE.Vertex( pOnCnodes[i].position ));
      }
      
      for(var i=0; i<colPal.length;i++){
         colMaterials.push( new THREE.MeshLambertMaterial( { color: colPal[i][0], depthTest: true } ));//dark
         colMaterials.push( new THREE.MeshLambertMaterial( { color: colPal[i][1], depthTest: true } ));//light
      }
      for(var i=0; i<triangle_geom.vertices.length; i = i+4){
         var colIndex = Math.min(3, labRandomInt( 0, 4 ));//random color pair
         triangle_geom.faces.push( new THREE.Face3( i,i+1,i+2, null, null, colMaterials[colIndex*2] ) );//dark
         triangle_geom.faces.push( new THREE.Face3( i+1,i+2, i+3, null, null, colMaterials[colIndex*2+1] ) );//light
      }
      
      
      trimesh = new THREE.Mesh( triangle_geom, new THREE.MeshFaceMaterial( { depthTest: true }) );
      trimesh.doubleSided = true;
      this.scene.addObject( trimesh ); 
      
      //particles
      var particles = new THREE.Geometry();
      
      //create particles
      var texOffsets = [];
      for(var p = 0; p < particleCount; p++) {
         var goal = labRandomInt( 0, pOnCnodes.length-1);
         pGoals.push( goal );
         pVels.push( new THREE.Vector3( labRandom(-1, 1), labRandom(-1, 1), labRandom(-1, 1) ));
         var particle = new THREE.Vertex( new THREE.Vector3(pOnCnodes[goal].position.x,
                                                            pOnCnodes[goal].position.y,
                                                            pOnCnodes[goal].position.z) );
         particles.vertices.push( particle );
      }
      
      
      attributes = {
      xOffset: { type: "f", value: [] },
      yOffset: { type: "f", value: [] }
      };
      
      for( var v = 0; v < particles.vertices.length; v++ ) {
         attributes.xOffset.value[ v ] = labRandomInt(0, 5)/5;
         attributes.yOffset.value[ v ] = labRandomInt(0, 8)/8;
      }
      
      uniforms = {
      amplitude: { type: "f", value: 1.0 },
      texture:   { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( 'textures/particles1024.png' ) },
      tcScl:     { type: "fv", value: [1/5, 1/8, 1]}, 
         
      };
         
//      var parMat = new THREE.ParticleBasicMaterial({color: 0xff3333,
//                                                   size: 10,
//                                                   sizeAttenuation: false 
//                                                   });
      parMat = new LAB.three.Shader({
                                    name: 'shaders/particleShader',
                                    uniforms: uniforms,
                                    attributes: attributes,
                                    depthTest:      true,
                                    transparent:    true,
                                    }) ;
      
      particles.dynamic = true;
      particleSystem = new THREE.ParticleSystem( particles, parMat );
      
      
      particleScene.addChild(particleSystem);
      
      //lines
      var line_colors = [colPal[0][0], colPal[0][1], 
                         colPal[1][0], colPal[1][1], 
                         colPal[2][0], colPal[2][1], 
                         colPal[3][0], colPal[3][1]];
      var line_geom = [];
      var line_mat = [];
      line_mesh = [];
      for(var i=0; i<8;i++){
         line_geom[i] =  new THREE.Geometry() ;
         line_mat[i] = new THREE.LineBasicMaterial( { color: line_colors[i], linewidth: 2, depthTest: true  } );
      }
      
      for(var i=0; i<numLines; i++){
         var meshIndex = Math.min( labRandomInt( 0, 8 ), 7);//one mesh per color in pallette
         
         var randIndex = labRandomInt(0, particles.vertices.length-1 );
         lines_particleIndices.push( randIndex );
         var vec1 = particles.vertices[ randIndex ].position;
         var vert = new THREE.Vertex( pOnCnodes[ pGoals[ randIndex ] ].position );
         lines_verts.push( vert );
         
         line_geom[meshIndex].vertices.push( new THREE.Vertex( vec1 ));
         line_geom[meshIndex].vertices.push( vert );
         
         if(i % 2){
            line_geom[meshIndex].vertices.push( new THREE.Vertex( vec1 ));
            line_geom[meshIndex].vertices.push( new THREE.Vertex(labRandomElement( pOnCnodes ).position));
         }
      }
      
      for(var i=0; i<8; i++){
         line_mesh[i] = new THREE.Line( line_geom[i], line_mat[i], THREE.LinePieces);
         line_mesh[i].dynamic = true;
         
         this.scene.addChild( line_mesh[i] );
      }
   }


   
   // ===========================================
	// ===== UPDATE
	// ===========================================
   
   this.update = function (){
      
      lastTime = elapsedTime;
      elapsedTime = LAB.self.getElapsedTimeSeconds() * .1;
      deltaTime = elapsedTime - lastTime;
      
      //update curves points
      var xScl;
      for(var i=0; i<curves.length; i++){
         for(var j=1; j<curves[i].points.length; j++){
            xScl = Math.cos( labMap( curves[i].points[j].x, 0, window.innerWidth, 0, 3.14 ));
            xScl *= xScl*crvDeflection;
            curves[i].points[j].y = curves[i].baseCV[j].y + Math.sin(elapsedTime+i) * xScl + xScl;
            curves[i].points[j].z = curves[i].baseCV[j].z + Math.cos(elapsedTime+i) * xScl;
         }
      }
      
      //update point on curve nodes
      for(var i=pOnCnodes.length-1; i>=0; i--){
         pOnCnodes[i].uVal += poncIncrement;
         if(pOnCnodes[i].uVal > 1){
            pOnCnodes[i].uVal -= 1;
            pOnCnodes[i-1].uVal -= 1;
            pOnCnodes[i-2].uVal -= 1;
            pOnCnodes[i-3].uVal -= 1;
            
            pOnCnodes[i-3].curve = pOnCnodes[i].curve = curves[ labRandomInt( 0, curves.length) ];
            pOnCnodes[i-1].curve = pOnCnodes[i-2].curve = curves[ labRandomInt( 0, curves.length) ];
         }
         evalPointOnCurve( pOnCnodes[i] );
      }
      
      //update triangles
      triangle_geom.__dirtyVertices = true;
      
      //update particle positions
      var force = new THREE.Vector3();
      for(var i=0; i<pGoals.length; i++){
         force.copy( particleSystem.geometry.vertices[i].position );
         force.subSelf( pOnCnodes[ pGoals[i] ].position );
         force.normalize();
         force.multiplyScalar( partAccel );
         
         pVels[i].multiplyScalar( partAttenuation );
         pVels[i].subSelf( force );
         
         particleSystem.geometry.vertices[i].position.addSelf( pVels[i] );
      }
      particleSystem.geometry.__dirtyVertices = true;
      
      //Lines
      if(jumpTime <elapsedTime){
         jumpTime =elapsedTime+ jumpIncrement;
         
         var randIndex = labRandomInt( 0, lines_particleIndices.length-1 );
         var part = lines_particleIndices[ randIndex ];
         var vert = lines_verts[ randIndex ];
         
         pGoals[ part ] = labRandomInt( 0, pOnCnodes.length-1 );
         vert.position = pOnCnodes[ pGoals[ part ] ].position;
         
         //      var randPonC = labRandomElement( pOnCnodes );
         //      randPonC.curve = labRandomElement( curves );
      }
      
      for(var i=0; i<line_mesh.length; i++){
         line_mesh[i].geometry.__dirtyVertices = true;
      }
   }
   
	// ===========================================
	// ===== DRAW
	// ===========================================
   
   this.draw = function (){
      gl.disable( gl.DEPTH_TEST );
      this.renderer.render( bgScene, camera );
      
      gl.enable( gl.DEPTH_TEST );
      this.renderer.render( this.scene, camera );
      this.renderer.render( particleScene, camera );
      
   }
   
   function addCurve( _mat, _numCV, _numSub, _crvRad, crvHeight ){
      var controlVertices = [];
      var uVal, pos;
      for(var i=0; i<_numCV; i++){
         uVal = i/(_numCV-1);
         controlVertices.push( new THREE.Vector3(Math.cos( uVal * Math.PI*2 ) * _crvRad,
                                                 Math.sin(20 * uVal + curves.length ) * crvHeight - window.innerHeight/2,
                                                 Math.sin( uVal * Math.PI*2 ) * _crvRad) );
      }
      
      var spline = new THREE.Spline( controlVertices );
      spline.baseCV = [];
      for(var i=0; i<controlVertices.length; i++){
         spline.baseCV.push( new THREE.Vector3(controlVertices[i].x,
                                               controlVertices[i].y,
                                               controlVertices[i].z));
      }
      return spline;
   }
   
   function evalPointOnCurve( pOnC ){
      var pos = pOnC.curve.getPoint( Math.max(0, Math.min(1, pOnC.uVal)) );
      pOnC.position.set( pos.x, pos.y, pos.z );
      return pOnC.position;
   }
   
   PointOnCurveNode = function () {
      this.position = new THREE.Vector3();
      this.basePos;
      this.uVal = 0.,
      this.curve = null;
   };
   
   function makeQuad( _geom, uCenter ){
      var pOnC = [new PointOnCurveNode(), 
                  new PointOnCurveNode(), 
                  new PointOnCurveNode(), 
                  new PointOnCurveNode()];
      
      pOnC[0].curve = pOnC[3].curve = curves[ labRandomInt( 0, curves.length) ];
      pOnC[1].curve = pOnC[2].curve = curves[ labRandomInt( 0, curves.length) ];
      
      pOnC[0].uVal = labRandom( -.05, -.015) + uCenter;
      pOnC[3].uVal = labRandom( .015, .05) + uCenter;
      var lowmidCV = labRandom(.25, .4);
      pOnC[1].uVal = labMap( lowmidCV, 0, 1, pOnC[0].uVal, pOnC[3].uVal);
      pOnC[2].uVal = labMap( lowmidCV + labRandom(.25, .4), 0, 1, pOnC[0].uVal, pOnC[3].uVal);
      
      //   pOnC[0].uVal = uCenter-.09;
      //   pOnC[1].uVal = uCenter-.03;
      //   pOnC[2].uVal = uCenter+.03;
      //   pOnC[3].uVal = uCenter+.09;
      
      evalPointOnCurve( pOnC[0] );
      evalPointOnCurve( pOnC[1] );
      evalPointOnCurve( pOnC[2] );
      evalPointOnCurve( pOnC[3] );
      
      pOnCnodes.push( pOnC[0] );
      pOnCnodes.push( pOnC[1] );
      pOnCnodes.push( pOnC[2] );
      pOnCnodes.push( pOnC[3] );
   }
   
   function labRandomElement( _array ){
      return _array[ Math.min(labRandomInt(0, _array.length ), _array.length-1)];
   }

	// ===========================================
	// ===== MOUSE
	// ===========================================
   
   this.onMouseMoved		= function( x, y )
   {
      lastMouse.x = x;
      lastMouse.y = y;
   }		
   
//   this.onMousePressed	= function (x,y)
//   {
//   }
}

/*DemoApp.prototype 				= new LAB.ThreeApp();
 DemoApp.prototype.constructor 	= DemoApp;
 DemoApp.prototype.supr 			= LAB.ThreeApp.prototype;	
 */	

