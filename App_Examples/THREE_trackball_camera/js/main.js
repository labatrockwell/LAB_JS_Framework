// load graphics base, because this is a graphics app
LAB.require("js/lab/app/ThreeApp.js");
LAB.require("js/utils/utils.js");

var demoApp;

$(document).ready( function() {
	DemoApp.prototype = $.extend(true, LAB.app.ThreeApp.prototype, DemoApp.prototype);
	demoApp = new DemoApp();
	demoApp.begin();
});

// ===========================================
// ===== DEMO APP
// ===========================================
DemoApp = function() {
	LAB.app.ThreeApp.call( this );		
   
	var _self = this;
   
	var lastMouse = {x:0, y:0};
	var labCam;
	
	//other
	var radius 			= 6371,
		tilt 			= 0.41,
		rotationSpeed 	= 0.05,

		cloudsScale 	= 1.1,
		moonScale 		= 0.23,

		height 			= window.innerHeight,
		width 			= window.innerWidth,

		geometry, meshPlanet, meshClouds,
		dirLight,

		time 			= new Date().getTime();

	// ===========================================
	// ===== SETUP
	// ===========================================	
	this.setup = function() {
		// catch mouse events!
		this.registerMouseEvents();

		//cameras
		labCam = new THREE.TrackballCamera({
			fov: 25,
			aspect: width / height,
			near: 50,
			far: 1e7,

			rotateSpeed: 1.0,
			zoomSpeed: 1.2,
			panSpeed: 0.2,

			noZoom: false,
			noPan: false,

			staticMoving: false,
			dynamicDampingFactor: 0.3,

			minDistance: radius * 1.1,
			maxDistance: radius * 100,

			keys: [ 65, 83, 68 ], // [ rotateKey, zoomKey, panKey ],

			domElement: this.renderer.domElement,
		});
		
		labCam.position.z = radius * 7;

		//lights
		dirLight = new THREE.DirectionalLight( 0xFFFFFF );
		dirLight.position.set( -1, 0, 1 );
		dirLight.position.normalize();
		this.scene.addLight( dirLight );

		ambientLight = new THREE.AmbientLight( 0xFFFFFF );
		
		//texures
		var planetTexture = THREE.ImageUtils.loadTexture( "img/earth_atmos_2048.jpg" ),
		cloudsTexture     = THREE.ImageUtils.loadTexture( "img/earth_clouds_1024.png" ),
		normalTexture     = THREE.ImageUtils.loadTexture( "img/earth_normal_2048.jpg" ),
		specularTexture   = THREE.ImageUtils.loadTexture( "img/earth_specular_2048.jpg" );
		//moonTexture       = THREE.ImageUtils.loadTexture( "textures/planets/moon_1024.jpg" );
		
		//shaders
		var shader = THREE.ShaderUtils.lib[ "normal" ],
		uniforms = THREE.UniformsUtils.clone( shader.uniforms );

		uniforms[ "tNormal" ].texture = normalTexture;
		uniforms[ "uNormalScale" ].value = 0.85;

		uniforms[ "tDiffuse" ].texture = planetTexture;
		uniforms[ "tSpecular" ].texture = specularTexture;

		uniforms[ "enableAO" ].value = false;
		uniforms[ "enableDiffuse" ].value = true;
		uniforms[ "enableSpecular" ].value = true;

		uniforms[ "uDiffuseColor" ].value.setHex( 0xffffff );
		uniforms[ "uSpecularColor" ].value.setHex( 0xaaaaaa );
		uniforms[ "uAmbientColor" ].value.setHex( 0x000000 );

		uniforms[ "uShininess" ].value = 30;

		var materialNormalMap = new THREE.MeshShaderMaterial({
			fragmentShader: shader.fragmentShader,
			vertexShader: shader.vertexShader,
			uniforms: uniforms,
			lights: true
		});
		
		// planet
		geometry = new THREE.SphereGeometry( radius, 100, 50 );
		geometry.computeTangents();

		meshPlanet = new THREE.Mesh( geometry, materialNormalMap );
		meshPlanet.rotation.y = 1.3;
		meshPlanet.rotation.z = tilt;
		this.scene.addObject( meshPlanet );

		// clouds
		var materialClouds = new THREE.MeshLambertMaterial( { color: 0xffffff, map: cloudsTexture, transparent:true } );

		meshClouds = new THREE.Mesh( geometry, materialClouds );
		meshClouds.scale.set( cloudsScale, cloudsScale, cloudsScale );
		meshClouds.rotation.z = tilt;
		this.scene.addObject( meshClouds );
		
		// stars
		var i,
		vector,
		starsGeometry = new THREE.Geometry();

		for ( i = 0; i < 1500; i++ ) {

			vector = new THREE.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
			vector.multiplyScalar( radius );

			starsGeometry.vertices.push( new THREE.Vertex( vector ) );

		}

		var stars,
		starsMaterials = [
			new THREE.ParticleBasicMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
			new THREE.ParticleBasicMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
			new THREE.ParticleBasicMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
			new THREE.ParticleBasicMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
			new THREE.ParticleBasicMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
			new THREE.ParticleBasicMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
		];

		for ( i = 10; i < 30; i++ ) {
			stars = new THREE.ParticleSystem( starsGeometry, starsMaterials[ i % 6 ] );

			stars.rotation.x = Math.random() * 6;
			stars.rotation.y = Math.random() * 6;
			stars.rotation.z = Math.random() * 6;

			var s = i * 10;
			stars.scale.set( s, s, s );

			stars.matrixAutoUpdate = false;
			stars.updateMatrix();

			this.scene.addObject( stars );
		}
	}
	
	// ===========================================
	// ===== UPDATE
	// ===========================================
	this.update = function() {
		var t = new Date().getTime(),
		dt = ( t - time ) / 1000;
		time = t;

		meshPlanet.rotation.y += rotationSpeed * dt;
		meshClouds.rotation.y += 2.5 * rotationSpeed * dt;
	}
	
	// ===========================================
	// ===== DRAW
	// ===========================================
	this.draw = function() {
		this.update();
		this.renderer.clear();
		// should this auto-render? <--- LB: I think this needs to stay here so that we can draw multiple objects with multiple scenes
		this.renderer.render( this.scene, labCam );
	}
   
	// ===========================================
	// ===== MOUSE
	// ===========================================
	this.onMouseMoved = function( x, y ) {
		lastMouse.x = x;
		lastMouse.y = y;
	}
	
	this.onMousePressed	= function( x, y ) {
		labLog( circle );
	}
}

	/*
	DemoApp.prototype 				= new LAB.ThreeApp();
	DemoApp.prototype.constructor 	= DemoApp;
	DemoApp.prototype.supr 			= LAB.ThreeApp.prototype;	
	*/