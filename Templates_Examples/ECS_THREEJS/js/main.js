// load graphics base, because this is a graphics app
// ...this doesn't really work yet
lab.require("lab.ThreeApp");

var demoApp;

$(document).ready( function() {
	demoApp 	= new DemoApp();		
	// is there a good way to call this automatically?
	demoApp.begin();
});

// ===========================================
// ===== DEMO APP
// ===========================================

	function DemoApp(){
		lab.ThreeApp.call( this );
	
		var appSelf = this;
	
		// QR Code vars
		var texShader;
	
		// ECS vars
		var _api				= null;
		var ecs_in_port			= -1; // dummy val
		var ecs_out_port		= -1; // dummy val
		var uuid				= 0; // dummy val
		var	bECSSetup			= false;
		var	bPerformanceStarted	= false;
	
		lab.self.theta = 0;
	}

	ECS_DemoApp.prototype 				= new lab.ThreeApp();
	ECS_DemoApp.prototype.constructor 	= ECS_DemoApp;
	ECS_DemoApp.prototype.supr 			= lab.ThreeApp.prototype;
	
// ===========================================
// ===== SETUP
// ===========================================

	ECS_DemoApp.prototype.setup = function (){
		console.log("setup?");
			
		// get ports from query string
		//ecs_in_port 	= getQueryString('inport');
		//ecs_out_port 	= getQueryString('outport');
	
		// setup ECS
		//lab.self.setupECS(ecs_in_port, ecs_out_port);
	
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

	ECS_DemoApp.prototype.update = function (){
		/*if (bPerformanceStarted){
			// do something
		}*/
	}

// ===========================================
// ===== DRAW
// ===========================================

	ECS_DemoApp.prototype.draw = function (){
		/*if (bPerformanceStarted){
			// do something
		}*/
	
		// rotate + render
	
		lab.self.radius = 2;
		lab.self.theta += 0.2;
		lab.self.camera.position.x = lab.self.radius * Math.sin( lab.self.theta * Math.PI / 360 );
		lab.self.camera.position.y = lab.self.radius * Math.sin( lab.self.theta * Math.PI / 360 );
		lab.self.camera.position.z = lab.self.radius * Math.cos( lab.self.theta * Math.PI / 360 );

		// find intersections

		lab.self.camera.update();
		lab.self.renderer.render( lab.self.scene, lab.self.camera );
	}	
	
// ===========================================
// ===== ECS
// ===========================================

// setup: call this from your main app

ECS_DemoApp.setupECS			= 	function setupECS(inport, outport){
	ecs_in_port 	= inport;
	ecs_out_port 	= outport;

	console.log("Connecting to ECS on ports "+ecs_in_port+", "+ecs_out_port);

	// quick ajax request to get UUID from config
	//$.get('./config.xml', self.configXMLLoaded);
	
	// if not running via --allow-file-access...
	// hard code your UUID
	uuid = "43a47b6c-6ad9-449c-9ab8-90ca53aab269";
	
	_api = new ApplicationMessageHandler(uuid);

	_api.addEventListener("handleStartPerformance", appSelf.handleStartPerformance);
	_api.addEventListener("handleStopPerformance", appSelf.handleStopPerformance);
	_api.addEventListener("handleConfig", appSelf.handleConfig);
	_api.addEventListener("handlePerformanceConfig", appSelf.handlePerformanceConfig);

	_api.connect(ecs_in_port, ecs_out_port);
	bECSSetup = true;		
};

// load UUID from config xml

ECS_DemoApp.configXMLLoaded	= 	function configXMLLoaded(data){
	console.log("configs loaded");
       // Analyze the type of this message
	if (data.getElementsByTagName("uuid").length < 1){
		alert("no uuid in config! not starting ECS");
		return;
	};
	
	uuid = data.getElementsByTagName("uuid")[0].childNodes[0].nodeValue;

	console.log ("uuid is "+uuid)
	_api = new ApplicationMessageHandler(uuid);

	_api.addEventListener("handleStartPerformance", appSelf.handleStartPerformance);
	_api.addEventListener("handleStopPerformance", appSelf.handleStopPerformance);
	_api.addEventListener("handleConfig", appSelf.handleConfig);
	_api.addEventListener("handlePerformanceConfig", appSelf.handlePerformanceConfig);

	_api.connect(ecs_in_port, ecs_out_port);
	bECSSetup = true;
}

// start performace: assumes all is good, starts updating / drawing

ECS_DemoApp.handleStartPerformance		= function()
{
	console.log("performance started");
	appSelf.bPerformanceStarted = true;
}

ECS_DemoApp.handleStopPerformance		= function()
{
	console.log("performance stopped");
	appSelf.bPerformanceStarted = false;
}

ECS_DemoApp.handleConfig				= function(data)
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

ECS_DemoApp.handlePerformanceConfig	= function(data)
{
	console.log("handle performance config "+data.a_key+":"+data.a_value);	
}

