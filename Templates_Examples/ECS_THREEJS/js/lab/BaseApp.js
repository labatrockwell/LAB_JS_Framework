// LAB BASE

lab.BaseApp = function()
{
	lab.self 	= this;
}

lab.BaseApp.prototype = {
	constructor:lab.BaseApp,
	begin: function(){
		console.log("base app set up");
		lab.self.setup();
		lab.self.animate();
	},
	setup: 		function(){},
	preupdate: 	function(){},
	update: 	function(){},
	predraw: 	function(){},
	draw: 		function(){},
	animate: 	function(){
		requestAnimationFrame(lab.self.animate);
				
		lab.self.preupdate();
	   	lab.self.update();
		lab.self.predraw();
		lab.self.draw();
	}
}