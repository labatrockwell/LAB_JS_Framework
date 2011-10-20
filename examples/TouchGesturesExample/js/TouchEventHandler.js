function TouchEventHandler() {

	// private constants
	var FLICK_TIMEOUT = 200,
		PRESS_TIMER_INTERVAL = 10,
		PRESS_MIN_TIME = 200,
		FLICK_MIN_MOVEMENT = 15,
		DRAG_MIN_MOVEMENT = 5;
		
	// private variables
	var _self = this,
		_target = null,
		_isDrag = false,
		_dispatchedPress = false,
		_flickTimer,
		_flickDir,
		_flickDist,
		_stageX,
		_stageY,
		_localX,
		_localY;
		
	
	// private methods
	function mouseDownHandler(event) {
		
		// events to listen to
		window.addEventListener("mouseup", mouseUpHandler);
		_target.addEventListener("mousemove", mouseMoveHandler);
		
		// events to remove
		_target.removeEventListener("mousedown", mouseDownHandler);
		
		startMove(event);
	}
	
	function startMove(event) {
		dispatch("mousedown");
		
		_pressPoint = new Lab.geom.Point(
	}
	
	
		
	// public methods
	this.register = function(target) {
		_target = target;
		_target.addEventListener("mousedown", mouseDownHandler);
	}
	
	this.unregister = function(target) {
		if (_target !== null) {
			_target.removeEventListener("mousedown", mouseDownHandler);
			_target.removeEventListener("mouseout", mouseOutHandler);
			_target.removeEventListener("mouseup", mouseMOveHandler);
		}
	}
	
	
}




function TouchEvent() {

}

TouchEvent.TAP = "tap";
TouchEvent.FLICK = "flick";
TouchEvent.DRAG = "drag";