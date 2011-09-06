// include LabBase files
LAB.require("js/three/Three.js");
LAB.require("js/lab/BaseApp.js");

LAB.ThreeApp = function()
{
	LAB.BaseApp.call( this );
	
	this.container;
	this.camera, this.scene, this.projector, this.renderer;

   
	this.mouse = { x: 0, y: 0 };
}

LAB.ThreeApp.prototype = new LAB.BaseApp();
LAB.ThreeApp.prototype.constructor = LAB.ThreeApp;
LAB.ThreeApp.prototype.supr = LAB.BaseApp.prototype;

/************************************************************
	SETUP
************************************************************/

	LAB.ThreeApp.prototype.begin = function()
	{
		console.log("base app set up");
		this.camera = new THREE.Camera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
		this.camera.position.y = 300;
		this.camera.position.z = 500;

		this.scene = new THREE.Scene();
		this.projector = new THREE.Projector();

		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.sortObjects = false;
		this.renderer.setSize( window.innerWidth, window.innerHeight );
      this.renderer.autoClear = false;

		// do we have a container?
	
		if (document.getElementById("labContainer") != null){
			this.container = document.getElementById("labContainer");
		} else {
			console.log("no labContainer in document, generating container div")
			this.container = document.createElement( 'div' );
			if (document.body)
				document.body.appendChild( this.container );
			else
				return;
		}
		
		this.container.appendChild(this.renderer.domElement);	
		this.setup();
		this.animate();
	}

/************************************************************
	DRAW: override the draw function in your app!
************************************************************/
