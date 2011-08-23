lab.EventDispatcher = function()
{
	this.events = [];
}

lab.EventDispatcher.prototype = {
	constructor:lab.EventDispatcher,
	addEventListener: function(event, callback){
		this.events[event] = this.events[event] || []; // check for undefined arg
		if (this.events[event]){
			this.events[event].push(callback);
		}
	},
	removeEventListener: function(event,callback){
		if ( this.events[event] ) {
			var listeners = this.events[event];
			for ( var i = listeners.length-1; i>=0; --i ){
				if ( listeners[i] === callback ) {
					listeners.splice( i, 1 );
					return true;
				}
			}
		}
		return false
	},
	dispatchEvent:function(event, data){
		if ( this.events[event] ) {
			var listeners = this.events[event], len = listeners.length;
			while ( len-- ) {
				listeners[len](data);	//callback with self
			}		
			return true; // return success
		} else {
			return false;
		}
	}
}