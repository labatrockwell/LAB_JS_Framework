//<!-- Event Examples -->
LAB.require("js/ClassA.js");
LAB.require("js/ClassB.js");
LAB.require("js/ClassC.js");

$(document).ready(function() {

	var a = new ClassA();
	var b = new ClassB();
	var c = new ClassC();

	a.addEventListener("timeout", onTimeout);
	b.addEventListener("timeout", onTimeout);

	// Class c tests not passing a reference to the target to the
	// EventDispatcher constructor
	c.addEventListener("timeout", onTimeoutNoTarget);

	// testing hasEventListener method
	if (c.hasEventListener("timeout")) {
		console.log("class c has registered a listener for timeout");
	} else {
		console.log("no timeout listener found for class c");
	}

	function onTimeout(evt) {
		console.log("target = " + evt.target.className);
		console.log("secret = " + evt.secret);
		console.log(evt);
	}

	function onTimeoutNoTarget(evt) {
		console.log("no reference to target in ClassC");
		console.log(evt);
	}
			
});