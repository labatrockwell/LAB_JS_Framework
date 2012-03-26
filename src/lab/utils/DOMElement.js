/** @namespace LAB.utils */
LAB = LAB || {};
LAB.utils = LAB.utils || {};

/** 
	@constructor 
	@param id without parent: unique ID of html element. with parent: id of child of parent div
	@param parent (optional) either LAB.utils.DOMElement or string
*/
LAB.utils.DOMElement = function( id, parent ){
	if (id){
		if (parent){
			if (typeof(parent) == "string"){
				this.parent = document.getElementById(parent);	
				if ( this.parent != null ){
					this.element = this.parent.querySelector( "#"+id );
				} else {
					console.warn("parent is null!")
				}
			// assuming you have passed a LAB.utils.DOMElement
			} else {
				this.parent = parent;
				this.element = this.parent.element.querySelector( "#"+id );
			}
		} else {
			this.element = document.getElementById(id);	
			if ( this.element == null ){
				this.element = document.createElement("div");
				console.warn("invalid id, this.element = div");
			}
		}		
	}
}

LAB.utils.DOMElement.prototype = {
	// setters
	set x( val ){
		this.element.style.left = val+"px";
	},
	set y( val ){
		this.element.style.top = val+"px";
	},
	set left( val ){
		this.y = val;
	},
	set top( val ){
		this.y = val;
	},
	set right( val ){
		this.element.style.right = val+"px";
	},
	set bottom( val ){
		this.element.style.bottom = val+"px";
	},
	set opacity( val ){
		this.element.style.opacity = val;
	},
	set html( val ){
		this.element.innerHTML = val;
	},
	//getters
	get x(){
		return this.element.clientTop;
	},
	get y(){
		return this.element.clientLeft;
	},
	get left(){
		return this.element.clientLeft;
	},
	get top(){
		return this.element.clientTop;
	},
	get right(){
		return this.element.clientRight;
	},
	get bottom(){
		return this.element.clientBottom;
	},
	get opacity(){
		return this.element.style.opacity;
	},
	get hidden(){
		return this.element.style.visibility == "hidden";
	}
}

LAB.utils.DOMElement.prototype.hide = function(){
	this.element.style.visibility = "hidden";
	//this.element.style.display 	= "none";
}

LAB.utils.DOMElement.prototype.show = function(){
	this.element.style.visibility = "visible";
	//this.element.style.display	  = "box";
}

LAB.utils.DOMElement.prototype.update = function(){
	if ( this.opacity == "0" && !this.hidden ){
		this.hide();
	}
}

LAB.utils.DOMElement.prototype.clone = function( bIncludeChildren ){
	bIncludeChildren = bIncludeChildren || true;
	return this.element.cloneNode( bIncludeChildren );
}


