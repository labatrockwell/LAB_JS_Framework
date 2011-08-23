// load graphics base, because this is a graphics app
// ...this doesn't really work yet
lab.require("lab.ThreeApp");
lab.require("utils.utils");

var demoApp;

$(document).ready( function() {
	demoApp 	= new DemoApp();		
	// is there a good way to call this automatically?
	demoApp.begin();
});

// ===========================================
// ===== DEMO APP
// ===========================================

	DemoApp = function(){
		lab.ThreeApp.call( this );
	
		// webgl vars
	
		this.radius	= 5;
		this.thetaX	= 0;
		this.thetaY	= 0;
		this.thetaZ	= 0;
		
		this.lastMouse = {x:0, y:0};
	
		// ECS vars
		this._api				= null;
		this.ecs_in_port			= -1; // dummy val
		this.ecs_out_port		= -1; // dummy val
		this.uuid				= 0; // dummy val
		this.bECSSetup			= false;
		this.bPerformanceStarted	= false;
		
		// catch mouse events!
		this.registerMouseEvents();
	}

	DemoApp.prototype 				= new lab.ThreeApp();
	DemoApp.prototype.constructor 	= DemoApp;
	DemoApp.prototype.supr 			= lab.ThreeApp.prototype;
	
// ===========================================
// ===== SETUP
// ===========================================

	DemoApp.prototype.setup = function (){
			
		// get ports from query string
		demoApp.ecs_in_port 	= getQueryString('inport');
		demoApp.ecs_out_port 	= getQueryString('outport');
	
		// setup ECS
		if ( demoApp.ecs_in_port != "" && demoApp.ecs_out_port != "" ){
			demoApp.setupECS( demoApp.ecs_in_port, demoApp.ecs_out_port);
		}
	
		// add some random squares
	
		var geometry = new THREE.CubeGeometry( 20, 20, 20 );

		for ( var i = 0; i < 500; i ++ ) {

			var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
			object.position.x = Math.random() * 800 - 400;
			object.position.y = Math.random() * 800 - 400;
			object.position.z = Math.random() * 800 - 400;
			object.rotation.x = ( Math.random() * 360 ) * Math.PI / 180;
			object.rotation.y = ( Math.random() * 360 ) * Math.PI / 180;
			object.rotation.z = ( Math.random() * 360 ) * Math.PI / 180;
			object.scale.x = Math.random() * 2 + 1;
			object.scale.y = Math.random() * 2 + 1;
			object.scale.z = Math.random() * 2 + 1;
			lab.self.scene.addObject( object );

		}
	}

// ===========================================
// ===== UPDATE
// ===========================================

	DemoApp.prototype.update = function (){
		if (demoApp.bPerformanceStarted){
			// do something
		}
	}

// ===========================================
// ===== DRAW
// ===========================================

	DemoApp.prototype.draw = function (){
		if (demoApp.bPerformanceStarted){
			// do something
		}
	
		// rotate + render
	
		demoApp.radius = 2;
		demoApp.thetaZ += 0.2;
		lab.self.camera.position.x = demoApp.radius * ( demoApp.thetaX * Math.PI / 360 );
		lab.self.camera.position.y = demoApp.radius * ( demoApp.thetaY * Math.PI / 360 );
		lab.self.camera.position.z = demoApp.radius * ( demoApp.thetaZ * Math.PI / 360 );

		lab.self.camera.update();
		
		// should this auto-render?
		lab.self.renderer.render( lab.self.scene, lab.self.camera );
	}	
	
// ===========================================
// ===== MOUSE
// ===========================================
	
	lab.BaseApp.prototype.onMouseMoved		= function( event )
	{
		console.log(demoApp.lastMouse.x+":"+demoApp.lastMouse.y);
		demoApp.thetaX += (demoApp.lastMouse.x - event.clientX)/4;
		demoApp.thetaY += (demoApp.lastMouse.y - event.clientY)/4;
		
		demoApp.lastMouse.x = event.clientX;
		demoApp.lastMouse.y = event.clientY;
	}
	
// ===========================================
// ===== ECS
// ===========================================

// setup: call this from your main app

	DemoApp.prototype.setupECS = 	function setupECS(inport, outport)
	{
		demoApp.ecs_in_port 	= inport;
		demoApp.ecs_out_port 	= outport;

		console.log("Connecting to ECS on ports "+demoApp.ecs_in_port+", "+demoApp.ecs_out_port);

		// quick ajax request to get UUID from config
		//$.get('./config.xml', self.configXMLLoaded);
	
		// if not running via --allow-file-access...
		// hard code your UUID
		demoApp.uuid = "43a47b6c-6ad9-449c-9ab8-90ca53aab269";
	
		demoApp._api = new ApplicationMessageHandler(demoApp.uuid);

		demoApp._api.addEventListener("handleStartPerformance", demoApp.handleStartPerformance);
		demoApp._api.addEventListener("handleStopPerformance", demoApp.handleStopPerformance);
		demoApp._api.addEventListener("handleConfig", demoApp.handleConfig);
		demoApp._api.addEventListener("handlePerformanceConfig", demoApp.handlePerformanceConfig);

		demoApp._api.connect(demoApp.ecs_in_port, demoApp.ecs_out_port);
		demoApp.bECSSetup = true;		
	};

	// load UUID from config xml

	DemoApp.prototype.configXMLLoaded	= 	function(data)
	{
		console.log("configs loaded");
	       // Analyze the type of this message
		if (data.getElementsByTagName("uuid").length < 1){
			alert("no uuid in config! not starting ECS");
			return;
		};
	
		demoApp.uuid = data.getElementsByTagName("uuid")[0].childNodes[0].nodeValue;

		console.log ("uuid is "+uuid)
		demoApp._api = new ApplicationMessageHandler(uuid);

		demoApp._api.addEventListener("handleStartPerformance", demoApp.handleStartPerformance);
		demoApp._api.addEventListener("handleStopPerformance", 	demoApp.handleStopPerformance);
		demoApp._api.addEventListener("handleConfig", 			demoApp.handleConfig);
		demoApp._api.addEventListener("handlePerformanceConfig", demoApp.handlePerformanceConfig);

		demoApp._api.connect(demoApp.ecs_in_port, demoApp.ecs_out_port);
		demoApp.bECSSetup = true;
	}

	// start performace: assumes all is good, starts updating / drawing

	DemoApp.prototype.handleStartPerformance		= function()
	{
		console.log("performance started");
		demoApp.bPerformanceStarted = true;
	}

	DemoApp.prototype.handleStopPerformance		= function()
	{
		console.log("performance stopped");
		demoApp.bPerformanceStarted = false;
	}

	DemoApp.prototype.handleConfig				= function(data)
	{
		//unpack object for legibility
		var a_key 	= data.a_key;
		var a_value	= data.a_value;

		console.log("handle config "+a_key);

		// setup configs
		if (a_key == "avalue"){
			// do something with a_value
		}
	}

	DemoApp.prototype.handlePerformanceConfig	= function(data)
	{
		console.log("handle performance config "+data.a_key+":"+data.a_value);	
	}

