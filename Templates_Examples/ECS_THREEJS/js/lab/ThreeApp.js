// include LabBase files

lab.require("lab.BaseApp");

lab.ThreeApp = function()
{
	lab.BaseApp.call( this );
	
	this.container;
	this.camera, this.scene, this.projector, this.renderer;

	this.mouse = { x: 0, y: 0 };
}

lab.ThreeApp.prototype = new lab.BaseApp();
lab.ThreeApp.prototype.constructor = lab.ThreeApp;
lab.ThreeApp.prototype.supr = lab.BaseApp.prototype;

/************************************************************
	SETUP
************************************************************/

lab.ThreeApp.prototype.begin = function()
{
	console.log("base app set up");
	lab.self.camera = new THREE.Camera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	lab.self.camera.position.y = 300;
	lab.self.camera.position.z = 500;

	lab.self.scene = new THREE.Scene();
	lab.self.projector = new THREE.Projector();

	lab.self.renderer = new THREE.WebGLRenderer();
	lab.self.renderer.sortObjects = false;
	lab.self.renderer.setSize( window.innerWidth, window.innerHeight );

	// do we have a container?
	
	if (document.getElementById("labContainer") != null){
		lab.self.container = document.getElementById("labContainer");
	} else {
		console.log("no labContainer in document, generating container div")
		lab.self.container = document.createElement( 'div' );
		if (document.body)
			document.body.appendChild( lab.self.container );
		else
			return;
	}
		
	lab.self.container.appendChild(lab.self.renderer.domElement);	
	lab.self.setup();
	lab.self.animate();
}

/************************************************************
	DRAW
************************************************************/

lab.ThreeApp.prototype.setupScreen 	= function(){
};

lab.ThreeApp.prototype.teardownScreen 	= function(){
};

lab.ThreeApp.prototype.predraw			= function() {
	lab.self.setupScreen();
   	lab.self.draw();
	lab.self.teardownScreen();
};
