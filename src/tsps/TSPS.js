/** @namespace TSPS */
var TSPS = TSPS || {};

/** 
	Creates a new TSPS parser + dispatcher
	@constructor
*/

TSPS.Dispatcher = function(){
	/**
		latestPeople
		@type Array
		array of last set of people received
	*/
	this.latestPeople 	= [];
	
	/**
		people
		@type Object
		Object with all current people sorted by ID
	*/
	this.people			= {};
}

/**
	pass in formatted string from TSPS WebSocket
	@function
	@param {String} formatted string from WebSocket
*/

TSPS.Dispatcher.prototype.parseMessage		= function(data)
{
	this.latestPeople = [];			

	// parse message
	var allMessages = data.split("\\");
	for (var h=0; h<allMessages.length; h++){
		var TSPSObj = new TSPS.person();

		var dataArray = allMessages[h].split(";");
		if (dataArray.length > 0){
			TSPSObj.type = dataArray[0];
			for (var i=1; i<dataArray.length; i++){
				var dObj = dataArray[i].split("/");
				if (dObj.length < 2){

				} else if (dObj[1].indexOf(",") != -1){
					var unpked = dObj[1].split(",");
					TSPSObj[dObj[0]] = [];
					for (var j=0; j<unpked.length; j++){
						TSPSObj[dObj[0]][j] = {};
						var obj = unpked[j].split(":");
						for (var k=0; k<obj.length; k++){
							var point = obj[k].split(">");
							TSPSObj[dObj[0]][j][point[0]] = point[1];								
						}
					}
				} else if (dObj[1].indexOf(":") != -1){
					var unpked = dObj[1].split(":");
					TSPSObj[dObj[0]] = {};

					for (var j=0; j<unpked.length; j++){
						var split = unpked[j].split(">");
						TSPSObj[dObj[0]][split[0]] = split[1];
					}						
				} else {
					TSPSObj[dObj[0]] = dObj[1];						
				}
			}

			if (TSPSObj.type == "TSPS/personEntered/") this._onPersonEntered(TSPSObj);
			else if (TSPSObj.type == "TSPS/personMoved/") this._onPersonUpdated(TSPSObj);
			else if (TSPSObj.type == "TSPS/personUpdated/") this._onPersonMoved(TSPSObj);
			else if (TSPSObj.type == "TSPS/personWillLeave/") this._onPersonLeft(TSPSObj);
		}

		this.latestPeople[this.latestPeople.length] = TSPSObj;
		//console.log(TSPSObj);
	}

	return this.latestPeople;
}
/**
@function
@private
*/
TSPS.Dispatcher.prototype._onPersonEntered	= function(tspsObj){
	this.people[tspsObj.id] = tspsObj;
	this.onPersonEntered(tspsObj);
}

/**
@function
@private
*/
TSPS.Dispatcher.prototype._onPersonUpdated	= function(tspsObj){
	this.people[tspsObj.id] = tspsObj;
	this.onPersonUpdated(tspsObj);
}

/**
@function
@private
*/
TSPS.Dispatcher.prototype._onPersonMoved	= function(tspsObj){
	this.people[tspsObj.id] = tspsObj;
	this.onPersonMoved(tspsObj);
}

/**
@function
@private
*/
TSPS.Dispatcher.prototype._onPersonLeft 	= function(tspsObj){
	delete this.people[tspsObj.id];
	this.onPersonLeft(tspsObj);		
}

/**
override in your main app
@function
@example
var tsps = new TSPS.Dispatcher();
tsps.onPersonEntered = this.onPersonEntered;
tsps.onPersonUpdated = this.onPersonUpdated;
tsps.onPersonMoved = this.onPersonMoved;
tsps.onPersonLeft = this.onPersonLeft;	
*/
TSPS.Dispatcher.prototype.onPersonEntered  = function(person){};
/**
override in your main app
@function
*/
TSPS.Dispatcher.prototype.onPersonUpdated  = function(person){};
/**
override in your main app
@function
*/
TSPS.Dispatcher.prototype.onPersonMoved  = function(person){};
/**
override in your main app
@function
*/
TSPS.Dispatcher.prototype.onPersonLeft  = function(person){};

/** 
	Creates a new TSPS person
	TO-DO: add template of all the properties this should have
	@constructor
*/

TSPS.person = function()
{
};