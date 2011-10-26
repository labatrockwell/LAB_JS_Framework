LAB.SphereGeometry;

Sphere = function(){
	
	LAB.SphereGeometry = LAB.SphereGeometry || new THREE.SphereGeometry( 100, 20, 20 );
	
	this.object = null;
	//this.x = this.y = this.z = 0;
	//this.scaleX = this.scaleY = this.scaleZ = 1;
	//this.scale.x = this.scale.y = this.scale.z;
};


Sphere.prototype = {
	get x(){
		return this.object.position.x;
	}, 
	
	set x(val){
		this.object.position.x = val;
	},
	
	get y(){
		return this.object.position.y;
	},
	
	set y(val){
		this.object.position.y = val;
	},
	
	get z(){
		return this.object.position.z;
	},
	
	set z(val){
		this.object.position.z = val;
	},
	
	get scaleX(){
		return this.object.scale.x;
	}, 
	
	set scaleX(val){
		this.object.scale.x = val;
	},
	
	get scaleY(){
		return this.object.scale.y;
	},
	
	set scaleY(val){
		this.object.scale.y = val;
	},
	
	get scaleZ(){
		return this.object.scale.z;
	},
	
	set scaleZ(val){
		this.object.scale.z = val;
	},
	
	create:function( radius ){
		this.object   = new THREE.Mesh( LAB.SphereGeometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ));
		this.x 		  = LAB.random(-window.innerWidth,window.innerWidth);
		this.y 		  = LAB.random(-window.innerHeight,window.innerHeight);
		this.z 		  = LAB.random(-500,500);
		
		this.scaleX  = radius/100;
		this.scaleY  = radius/100;
		this.scaleZ  = radius/100;
		this.object.prt = this;
				
		return this.object;
	}
}


