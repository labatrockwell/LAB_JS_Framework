LAB = LAB || {};
LAB.utils = LAB.utils || {};

/** 
* @namespace LAB.utils
* @constructor 
* @param id without parent: unique ID of html element. with parent: id of child of parent div
* @param parent (optional) either LAB.utils.DOMElement or string
*/
LAB.utils.DOMElement = function( id, parent ){
	this.timeouts = {};
	if (id){
		if (parent){
			if (typeof(parent) == "string"){
				this.parent = document.getElementById(parent);	
				if ( this.parent != null ){
					this.element = this.parent.querySelector( "#"+id );
					this.element._parent = this;
				} else {
					console.warn("parent is null!")
				}
			} else if (parent.type && parent.type == "LAB.utils.DOMElement"){
				this.parent = parent;
				this.element = this.parent.element.querySelector( "#"+id );
				this.element._parent = this;
			}
		} else {
			this.element = document.getElementById(id);	
			if ( this.element == null ){
				this.element = document.createElement("div");
				this.element._parent = this;
				console.warn("invalid id, this.element = blank div");
			}
		}		
	} else {
		this.element = document.createElement("div");		
	}
};

LAB.utils.DOMElement.prototype = {
	/** @function */
	set x( val ){
		if (this.left != val)
			this.element.style.left = val+"px";
	},
	/** @function */
	set y( val ){
		if (this.top != val)
			this.element.style.top = val+"px";
	},
	/** @function */
	set left( val ){
		if (this.left != val)
			this.x = val;
	},
	/** @function */
	set top( val ){
		if (this.top != val)
			this.y = val;
	},
	/** @function */
	set offsetTop( val ){
		if (this.offsetTop != val)
			this.element.offsetTop = val+"px";
	},
	/** @function */
	set right( val ){
		if (this.right != val)
			this.element.style.right = val+"px";
	},
	/** @function */
	set offsetBottom( val ){
		if (this.offsetBottom != val)
			this.element.offsetBottom = val+"px";
	},
	/** @function */
	set bottom( val ){
		if (this.bottom != val)
			this.element.style.bottom = val+"px";
	},
	/** @function */
	set width( val ){
		if (this.width != val)
			this.element.style.width = val+"px";		
	},	
	/** @function */
	set height( val ){
		if (this.height != val)
			this.element.style.height = val+"px";		
	},
	/** @function */
	set opacity( val ){
		if ( this.opacity != val ){
			this.element.style.opacity = val;
		}
	},
	/** @function */
	set html( val ){
		this.element.innerHTML = val;
	},
	/** @function */
	get html(){
		return this.element.innerHTML;
	},

	//getters
	/** @function */
	get x(){
		return this.element.clientLeft;
	},
	/** @function */
	get y(){
		return this.element.clientTop;
	},
	/** @function */
	get offsetX(){
		return this.element.offsetLeft;
	},
	/** @function */
	get offsetY(){
		return this.element.offsetTop;
	},
	/** @function */
	get left(){
		return this.element.clientLeft;
	},
	/** @function */
	get top(){
		return this.element.clientTop;
	},
	/** @function */
	get offsetTop(){
		return this.offsetY;
	},
	/** @function */
	get right(){
		return this.element.clientRight;
	},
	/** @function */
	get bottom(){
		return this.element.clientBottom;
	},
	/** @function */
	get offsetBottom(){
		return this.element.offsetBottom;
	},
	/** @function */
	get width(){
		return this.element.clientWidth;
	},
	/** @function */
	get height(){
		return this.element.clientHeight;
	},
	/** @function */
	get offsetWidth(){
		return this.element.offsetWidth;
	},
	/** @function */
	get offsetHeight(){
		return this.element.offsetHeight;
	},
	/** @function */
	get opacity(){
		return this.element.style.opacity;
	},
	/** @function */
	get hidden(){
		return this.element.style.visibility == "hidden";
	}, 
	/** @function */
	get type(){
		return "LAB.utils.DOMElement"
	}
}

/** 
* @function 
* @param	{String name How the object keeps track of its timeouts.
*/
LAB.utils.DOMElement.prototype.clearTimeout = function( name ){
	if ( this.timeouts[name] ){
		clearTimeout( this.timeouts[name] );
	}
}


/** 
* Set a timeout; automatically clears old timeout if already exists
* @function 
* @param	{Function}	callback
* @param	{Integer}	time
* @param	{String}	name 		How the object keeps track of its timeouts.
*/

LAB.utils.DOMElement.prototype.setTimeout = function( callback, time, name ){
	this.clearTimeout( name );
	this.timeouts[name] = window.setTimeout( callback, time );
}

/** @function */
LAB.utils.DOMElement.prototype.hide = function(){
	this.element.style.visibility = "hidden";
	this.element.style.display 	= "none";
}

/** @function */
LAB.utils.DOMElement.prototype.show = function(){
	this.element.style.visibility = "visible";
	this.element.style.display	  = "block";
}

/** @function */
LAB.utils.DOMElement.prototype.update = function(){
	if ( this.opacity == "0" && !this.hidden ){
		this.hide();
	}
}

/** 
* @function 
* @param	{Boolean}	bIncludeChildren
*/
LAB.utils.DOMElement.prototype.clone = function( bIncludeChildren ){
	bIncludeChildren = bIncludeChildren || true;

	// first clone any other props
	var newObject = $.extend(true, {}, this);
	newObject.element = this.element.cloneNode( bIncludeChildren );
	newObject.element._parent = newObject;
	return newObject;
}

/** 
* Add regular DOM element or LAB DOMElement
* @function 
* @param	{Object, LAB.utils.DOMElement} domElement
*/
LAB.utils.DOMElement.prototype.add	= function( domElement ){
	if ( domElement.type && domElement.type == "LAB.utils.DOMElement" ){
		this.element.appendChild( domElement.element );
	} else {
		this.element.appendChild( domElement );
	}
};

/** 
* Remove regular DOM element or LAB DOMElement
* @function 
* @param	{Object, LAB.utils.DOMElement} domElement
*/
LAB.utils.DOMElement.prototype.remove	= function( domElement ){
	if ( domElement.type && domElement.type == "LAB.utils.DOMElement" ){
		try {
			this.element.removeChild( domElement.element );			
		} catch(e){

		}
	} else {
		try {
			this.element.removeChild( domElement );
		} catch(e){
			
		}
	}
};

