/** @namespace LAB.three */
LAB.three = LAB.three || {};

/** 
 @constructor 
 @extends THREE.Camera
 */
LAB.three.Camera = function ( fov, aspect, near, far ) {
   THREE.Camera.call( this, fov, aspect, near, far );// I think this works, seems to work...
   this.matrix.identity();
   this.mvMatrixStack = [];
   
   //   this.setToWindowPerspective();
   this.useTarget = true;
   this.useQuaternion = true;
   this.bUsePushPop = false;
   
   this.setToWindowPerspective();
};

LAB.three.Camera.prototype = new THREE.Camera();
LAB.three.Camera.prototype.constructor = LAB.three.Camera;
LAB.three.Camera.prototype.supr = THREE.Camera.prototype;

/**
 @function
 @public
 */
LAB.three.Camera.prototype.usePushPop = function( _bUsePushPop ){
   
   this.bUsePushPop = _bUsePushPop || true;
   this.useTarget = false;
};

/**
 @function
 @public
 */
LAB.three.Camera.prototype.updateMatrix = function () {
   if( this.bUsePushPop == false ){
      //this over-rides the THREE.Camera.updateMatrix() called by the renderer
      //without this the camera would automaticllay update according to it's position scale and rotation vectors
      
      //the following is copied from the THREE.Object3D method updateMatrix()
		this.matrix.setPosition( this.position );
      
		if ( this.useQuaternion )  {
         
			this.matrix.setRotationFromQuaternion( this.quaternion );
         
		} else {
         
			this.matrix.setRotationFromEuler( this.rotation, this.eulerOrder );
         
		}
      
		if ( this.scale.x !== 1 || this.scale.y !== 1 || this.scale.z !== 1 ) {
         
			this.matrix.scale( this.scale );
			this.boundRadiusScale = Math.max( this.scale.x, Math.max( this.scale.y, this.scale.z ) );
         
		}
      
		this.matrixWorldNeedsUpdate = true;
   }
};



/**
 @function
 @public
 */
LAB.three.Camera.prototype.setToWindowPerspective = function( _fov, _nearClip, _farClip ){
   //   if(width == 0) width = ofGetWidth();
   //	if(height == 0) height = ofGetHeight();
   //   
   
   var fov = _fov || 60;
   
	var viewW = window.innerWidth;
	var viewH = window.innerHeight;
   
	var eyeX = viewW / 2;
	var eyeY = viewH / 2;
	var halfFov = Math.PI * fov / 360;
	var theTan = Math.tan(halfFov);
	var dist = eyeY / theTan;
	var aspect = viewW / viewH;
   
   var near = _nearClip || dist / 10;
   var far = _farClip || dist * 10;
   this.projectionMatrix = THREE.Matrix4.makePerspective( fov, aspect, near, far );
   
   this.position.set( eyeX, eyeY, dist );
   this.target.position.set( eyeX, eyeY, 0 );
   this.up.set( 0, 1, 0 );
   
   this.matrix.lookAt( this.position, this.target.position, this.up );
   this.matrix.setPosition( this.position );
   
   
   //	//note - theo checked this on iPhone and Desktop for both vFlip = false and true
   //	if(ofDoesHWOrientation()){
   //		if(vFlip){
   //			glScalef(1, -1, 1);
   //			glTranslatef(0, -height, 0);
   //		}
   //	}
};

/**
 project a THREE.Vector3 from world to screen coords
 @function
 @public
 */
LAB.three.Camera.prototype.projectToScreen = function( worldPos ){
   //adaptded from https://github.com/mrdoob/three.js/issues/78
   var pos = worldPos.clone();
   projScreenMat = new THREE.Matrix4();
   projScreenMat.multiply( this.projectionMatrix, this.matrixWorldInverse );
   projScreenMat.multiplyVector3( pos );
   
   return { x: ( pos.x + 1 ) * window.innerWidth / 2 ,
   y: window.innerHeight - ( - pos.y + 1) * window.innerHeight / 2,
      z: 0 };
};

/**
 project a THREE.Vector3 from screen coords to world space
 @function
 @public
 */
LAB.three.Camera.prototype.projectToWorld = function( screenPos ){
   //this was helpful http://jsfiddle.net/gero3/PE4x7/25/
   var pos = screenPos.clone();
   pos.x = ( pos.x / window.innerWidth ) * 2 - 1;
   pos.y = ( -(window.innerHeight-pos.y) / window.innerHeight ) * 2 + 1;
   
   var projector = new THREE.Projector();
   projector.unprojectVector( pos, this );
   return pos;
};

/**
 @function
 @public
 */
LAB.three.Camera.prototype.pushMatrix = function(){
   this.mvMatrixStack.push( new THREE.Matrix4().copy( this.matrix ));
};

/**
 @function
 @public
 */
LAB.three.Camera.prototype.popMatrix = function(){
   if( this.mvMatrixStack.length > 0){
      this.matrix.copy( this.mvMatrixStack.pop() );
   }
};

/**
 @function
 @public
 */
LAB.three.Camera.prototype.translateMatrix = function( x, y, z ){
   this.matrix.multiply( new THREE.Matrix4().setTranslation(x,y,z), this.matrix );
};

/**
 @function
 @public
 */
LAB.three.Camera.prototype.lookAt = function( x, y, z ){
   this.matrix.lookAt(this.matrix.getPosition(),//eye
                                 new THREE.Vector3(x,y,z), //target
                                 this.up );
};


///**
// @function
// @public
// */
//LAB.three.Camera.prototype.move = function( x, y, z ){
//   this.matrix.setTranslation(x,y,z);
//};

/**
 @function
 @public
 */
LAB.three.Camera.prototype.scaleMatrix = function( x, y, z ){
   //this.matrix.scale( new THREE.Vector3(x,y,z) );
   
   this.matrix.n11 *= x; 
   this.matrix.n22 *= y;
   this.matrix.n33 *= z;
   
};

/**
 @function
 @public
 */
LAB.three.Camera.prototype.rotateMatrix = function( angle, x, y, z ){
   
   //   var axis = new THREE.Vector3(x,y,z).normalize();
   //   var rotMat = new THREE.Matrix4().setRotationAxis( axis, angle * 0.0174532925 );
   //   this.matrix.multiply( rotMat, this.matrix );
   
   this.quaternion.setFromAxisAngle( new THREE.Vector3(x,y,z).normalize(), angle * 0.0174532925 );
   this.matrix.multiply(new THREE.Matrix4().setRotationFromQuaternion( this.quaternion ),
                        this.matrix );
};

/**
 @function
 @public
 */
LAB.three.Camera.prototype.setToWindowOrtho = function( _nearClip, _farClip ){
   
   this.projectionMatrix = THREE.Matrix4.makeOrtho(window.innerWidth/-2, 
                                                   window.innerWidth/2,
                                                   window.innerHeight/2,
                                                   window.innerHeight/-2,
                                                   _nearClip || -1000,
                                                   _farClip || 1000 );
   
   
};


