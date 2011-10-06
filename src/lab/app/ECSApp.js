// ===========================================
// ===== ECS
// ===========================================

/** @namespace LAB.app */
	LAB.require(LAB.src+"../ecs/ApplicationMessageHandler.js");

/** @constructor */
	LAB.app.ECSApp = function()
	{
		this._api				= null;
		this.uuid				= 0; // dummy val
		this.bECSSetup			= false;
		this.bPerformanceStarted	= false;
	}

/** 
	setup: call this from your main app
	@function 
	@public
*/

	LAB.app.ECSApp.prototype.setupECS 		= 	function(uuid, inport, outport)
	{	
		this.uuid			= uuid;
		this.ecs_in_port 	= inport;
		this.ecs_out_port 	= outport;

		this._api = new ApplicationMessageHandler(uuid);

		this._api.addEventListener("handleStartPerformance", this.handleStartPerformance);
		this._api.addEventListener("handleStopPerformance", this.handleStopPerformance);
		this._api.addEventListener("handleConfig", this.handleConfig);
		this._api.addEventListener("handlePerformanceConfig", this.handlePerformanceConfig);
				
		this._api.connect(this.ecs_in_port, this.ecs_out_port);
		this.bECSSetup = true;	
	};

/******************************************************
	METHODS: OVERRIDE THESE TO CATCH IN YOUR CLASS
******************************************************/

	/** 
		start performace: assumes all is good, starts updating / drawing.
		@function 
		@public
	*/
	
	LAB.app.ECSApp.prototype.handleStartPerformance		= function()
	{
		console.log("ECS::performance started");
		this.bPerformanceStarted = true;
	}

	/** 
		stop performace: teardown is happening, time to start shutting down
		@function 
		@public
	*/
	
	LAB.app.ECSApp.prototype.handleStopPerformance		= function()
	{
		console.log("ECS::performance stopped");
		this.bPerformanceStarted = false;
	}

	/** 
		handle configs sent from your role or from other apps
		override this in your main app to make custom handlers
		@function 
		@public
		@param {Object} data contains data.a_key, data.a_value
	*/

	LAB.app.ECSApp.prototype.handleConfig				= function(data)
	{
		//unpack object for legibility
		var a_key 	= data.a_key;
		var a_value	= data.a_value;

		//console.log("ECS::handle config "+a_key);

		// setup configs
		if (a_key == "something"){
			// do something with a_value
		}
	}

	/** 
		catches performance configs (sent to all members of a performance)
		override this in your main app to make custom handler
		@function 
		@public
	*/

	LAB.app.ECSApp.prototype.handlePerformanceConfig	= function(data)
	{
		console.log("handle performance config "+data.a_key+":"+data.a_value);	
	}
