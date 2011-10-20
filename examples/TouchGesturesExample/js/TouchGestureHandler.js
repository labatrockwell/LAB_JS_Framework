function TouchGestureHandler() {

	LAB.EventDispatcher.call(this, this);

	// private constants
	var FLICK_TIMEOUT = 250,
		TAP_TIMEOUT = 80,
		FLICK_MIN_MOVEMENT = 20,
		DRAG_MIN_MOVEMENT = 5;
		
	// private variables
	var _self = this,
		_target = null,
		_isDrag = false,
		_isFlick = false,
		_pressPoint,
		_flickDirection,
		_flickDistance,
		_flickStartPoint,
		_flickEndPoint,
		_flickVelocity,
		_flickStartTime,
		_startTime,
		_endTime,
		_lastTime = -1,
		_averageVelocity,
		_velocity = [],
		_dragDirection,
		_dragDistance,
		_touchX,
		_touchY;
	
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
		_touchX = event.clientX;
		_touchY = event.clientY;

		dispatch(TouchEvent.PRESS);
		
		var date = new Date();
		_startTime = date.getTime();
		
		// clear the array
		_averageVelocity = [];
				
		_pressPoint = new LAB.geom.Point(event.clientX, event.clientY);
		
		_isFlick = false;
		_isDrag = false;
	}
	
	function mouseMoveHandler(event) {
		
		_touchX = event.clientX;
		_touchY = event.clientY;
		
		var date = new Date();
		
		var currentTime = date.getTime();
				
		// save current point
		var currentPoint = new LAB.geom.Point(_touchX, _touchY);
		
		// flick handling
		var distance = calcDistance(currentPoint, _pressPoint);
		var direction = calcDegree(currentPoint, _pressPoint);
		
		if (distance > FLICK_MIN_MOVEMENT) {
		
			var date;
		
			if (!_isFlick) {
				date = new Date();
				// get time and position the first time the flick movement threshold is met
				_flickStartTime = date.getTime();
				_flickStartPoint = new LAB.geom.Point(_touchX, _touchY);
			}
			
			_isFlick = true;
		}
				
		// drag handler
		// to do: only send drag events when an object is being dragged?
		if (distance > DRAG_MIN_MOVEMENT) {
			var velocity;
			// update the distance and direction each time the minimum drag movement
			// threshold is met
			_dragDistance = distance;
			_dragDirection = direction;
			
			var timeDiff = currentTime - _lastTime;
			
			velocity = calcVelocity(_dragDistance, timeDiff);
			if (velocity > -1) {
				_velocity.push(velocity);
			}
		
			_isDrag = true;
		}
		
		// to do: dispatch only on distance > 0?
		if (_isDrag) {
			dispatch(TouchEvent.DRAG);
		}
		
		// update press point so we can have drag...drag...drag...flick
		_pressPoint = new LAB.geom.Point(currentPoint.x, currentPoint.y);
		_lastTime = currentTime;
	}
	
	function mouseOutHandler(event) {		
		// ignore if out is not this object
		if (event.target != _target) {
			return;
		}
		
		_target.removeEventListener("mouseout", mouseOutHandler);
		
		dispatch(TouchEvent.OUT);
	}	
	
	function mouseUpHandler(event) {
		
		_target.addEventListener("mousedown", mouseDownHandler);
		
		_target.removeEventListener("mousemove", mouseMoveHandler);
		window.removeEventListener("mouseup", mouseUpHandler);
		
		var date = new Date();
		_endTime = date.getTime();
		
		var timeChange = _endTime - _startTime;
		var flickTimeChange = _endTime - _flickStartTime;
		console.log("time change = " + timeChange);
		
		if (timeChange <= TAP_TIMEOUT && !_isDrag && !_isFlick) {
			dispatch(TouchEvent.TAP);
		}
		
		var velocitySum = 0;
		for (var i = 0, len = _velocity.length; i< len; i++) {
			velocitySum = velocitySum + _velocity[i];
		}
		_averageVelocity = velocitySum / _velocity.length;
		
		// must meet minimum time requirement for flick
		if (flickTimeChange <= FLICK_TIMEOUT && _isFlick) {
			
			_flickEndPoint = new LAB.geom.Point(_touchX, _touchY);
			_flickDirection = calcDegree(_flickEndPoint, _flickStartPoint);
			_flickDistance = calcDistance(_flickEndPoint, _flickStartPoint);
			_flickVelocity = calcVelocity(_flickDistance, timeChange);
		
			dispatch(TouchEvent.FLICK);
		}
		
		// only dispatch if not flick?
		dispatch(TouchEvent.RELEASE);
		
		_touchX = event.clientX;
		_touchY = event.clientY;
		
		resetForNext();	
	}
		
	function calcDistance(pointA, pointB) {
		var dist = Math.sqrt(Math.pow((pointB.x - pointA.x), 2) + Math.pow((pointB.y - pointA.y), 2));
		
		return dist;
	}
	
	function calcVelocity(dist, timeChange) {
		if (dist > 0 && timeChange > 0) {
			return dist / timeChange
		} else {
			return -1;
		}
	}
		
	function dispatch(type) {
		//console.log("dispatch event: " + type);
		_self.dispatchEvent(new TouchEvent(type));
		
		// any way or reason to get this to work?
		//_target.dispatchEvent(new TouchEvent(type, _self));
	}
	
	function resetForNext() {		
		_isDrag = false;
		_isFlick = false;
	}
	
	function calcDegree(startPoint, endPoint) {
		var diffX = startPoint.x - endPoint.x;
		var diffY = endPoint.y - startPoint.y;
		
		return tangentAngle(diffX, diffY);
	}
	
	function tangentAngle(xVal, yVal) {
		var radians = Math.atan2(yVal, xVal);
		
		// handle going all the way around
		if (radians < 0) radians += 6.283185;
		
		// convert radians to degrees
		return radians * 57.29578;
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
			_target.removeEventListener("mousemove", mouseMoveHandler);
			window.removeEventListener("mouseup", mouseUpHandler);
		}
	}
	
	this.getDragDirection = function() {
		return _dragDirection;
	}
	
	this.getDragDistance = function() {
		return _dragDistance;
	}
	
	this.getFlickDirection = function() {
		return _flickDirection;
	}
	
	this.getFlickDistance = function() {
		return _flickDistance;
	}	
	
	this.getTouchX = function() {
		return _touchX;
	}
	
	this.getTouchY = function() {
		return _touchY;
	}
	
	this.getAverageVelocity = function() {
		return _averageVelocity;
	}
	
	this.getFlickVelocity = function() {
		return _flickVelocity;
	}	
	
}

TouchGestureHandler.prototype = new LAB.EventDispatcher;
TouchGestureHandler.prototype.constructor = TouchGestureHandler;



function TouchEvent(type) {	
	LAB.Event.call(this, type);
}

TouchEvent.TAP = "touchtap";
TouchEvent.FLICK = "touchflick";
TouchEvent.DRAG = "touchdrag";
TouchEvent.MOVE = "touchmove";
TouchEvent.RELEASE = "touchrelease";
TouchEvent.OUT = "touchout";
TouchEvent.PRESS = "touchPress";

TouchEvent.prototype = new LAB.Event;
TouchEvent.prototype.constructor = TouchEvent;