// load graphics base, because this is a graphics app
// ...this doesn't really work yet
LAB.require(LAB.src+"app/ThreeApp.js");

var demoApp;

$(document).ready( function() {
	DemoApp.prototype = $.extend(true, LAB.app.ThreeApp.prototype, DemoApp.prototype);
	demoApp 	= new DemoApp();
	// is there a good way to call this automatically?
	demoApp.begin();
	
	var s = new WebSocket("ws://localhost:9999/");
	s.onopen = function() { console.log("open"); s.send("hello!"); console.log("sent: hello!");}
	s.onclose = function(e) { console.log("closed"); }
	s.onmessage = function(e) {
		console.log(e);
		var data = e.data.split(",");
		//demoApp.addPoint( data[0], data[1] );
		demoApp.addPoint( data[1], data[0] );
	}
});

// ===========================================
// ===== DEMO APP
// ===========================================

	DemoApp = function(){
		LAB.app.ThreeApp.call( this );		
		
		var _self = this;
	
		// webgl vars
		var SCREEN_WIDTH = window.innerWidth,
			SCREEN_HEIGHT = window.innerHeight,
			SCREEN_WIDTH_HALF = window.innerWidth / 2,
			SCREEN_HEIGHT_HALF = window.innerHeight / 2,
			stats;
		
		var lastMouse = {x:0, y:0};
			
	// ===========================================
	// ===== SETUP
	// ===========================================
		
		this.setup = function () {
			this.camera = new THREE.Camera( 30, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000);
			this.camera.position.z = 1000;
			
			var material = new THREE.MeshBasicMaterial( {
				map: THREE.ImageUtils.loadTexture( 'img/earth_no_clouds.jpg' ),
			});
			var geom = new THREE.SphereGeometry( 200, 50, 50);
			var primitive = new THREE.Mesh(geom, material );
			
			this.scene.addObject( primitive );

			var points = [];
			points.push([51.507222, -0.1275]); // London
			points.push([-37.813611, 144.963056]); // Melbourne
			points.push([40.716667, -74]); // NYC
			points.push([35.700556, 139.715]); // Tokyo
			
			for (i = 0; i < points.length; i++) {
				this.addPoint( points[i][0], points[i][1]);
			};

			setupLights();

			// catch mouse events!
			this.registerMouseEvents();
		}

	// ===========================================
	// ===== THREE.JS: Setup scene
	// ===========================================
		
		function setupLights()
		{
			// add some lights			
			var light = new THREE.DirectionalLight( 0xffffff, 2 );
			light.position.x = 1;
			light.position.y = 1;
			light.position.z = 1;
			light.position.normalize();
			LAB.self.scene.addLight( light );

			var light = new THREE.DirectionalLight( 0xffffff );
			light.position.x = - 1;
			light.position.y = - 1;
			light.position.z = - 1;
			light.position.normalize();
			LAB.self.scene.addLight( light );
		}
		
	// ===========================================
	// ===== UPDATE
	// ===========================================
		this.addPoint = function( _lat, _long ) {
			var r = 200,
				latDeg, lngDeg, latitude, longitude, x, y, z, vector, vector2, line;
				
			latDeg = _lat;
			lngDeg = _long;
			latitude = Math.PI/180*(90-latDeg);
			longitude = Math.PI/180*(180-lngDeg);

			x = r * Math.sin(latitude) * Math.cos(longitude);
			y = r * Math.cos(latitude);
			z = r * Math.sin(latitude) * Math.sin(longitude);;

			geometry = new THREE.Geometry();

			vector = new THREE.Vector3( x, y, z);

			geometry.vertices.push( new THREE.Vertex( vector ) );

			vector2 = vector.clone();
			vector2.multiplyScalar( 1.1 );

			geometry.vertices.push( new THREE.Vertex( vector2 ) );

			line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 5, opacity: 1 } ) );
			this.scene.addObject(line);
		}

		this.update = function (){
			var angle = (Math.PI/180*0.5);

			cosRY = Math.cos(angle);
			sinRY = Math.sin(angle);

			var tempz = this.camera.position.z;
			var tempx = this.camera.position.x; 

			this.camera.position.x = (tempx*cosRY)+(tempz*sinRY);
			this.camera.position.z = (tempx*-sinRY)+(tempz*cosRY);
		}
	
	// ===========================================
	// ===== DRAW
	// ===========================================

		this.draw = function (){
			//this.camera.update();
			
			// should this auto-render?
			this.renderer.render( this.scene, this.camera );
		}
		
	// ===========================================
	// ===== MOUSE
	// ===========================================

		this.onMouseMoved = function( event ) {
			//console.log(event);
		}
		
		this.onMousePressed = function( event ) {
			LAB.self.addPoint( 37.775, -122.4183333 );  // san francisco, ca
		}
	}

	/*DemoApp.prototype 				= new LAB.ThreeApp();
	DemoApp.prototype.constructor 	= DemoApp;
	DemoApp.prototype.supr 			= LAB.ThreeApp.prototype;	
	*/