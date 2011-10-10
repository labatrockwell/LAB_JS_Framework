//if(!window['ApplicationMessageHandler']){

// ======================================================================================
// ===== APPICATION MESSAGE HANDLES
// ======================================================================================

if(!window['ECS']){
    
    /** @namespace ECS */
    var ECS = ECS || {};
    
    /** 
	@constructor
    */
	ECS.ApplicationMessageHandler = function (uuid){
		
	    // private vars
	    var _self           =   this;
		var inSocket;
		var outSocket;
		
		var bVerbose		= 	false;
		
		// public vars
	    this.name          	=   'ApplicationMessageHandler';
		this.bECSconnected 	= 	false;
		this.appUUID		= 	uuid;
		
		// events
		this.events 		= 	[];
            
        // ===========================================
        // ===== CALLABLE
        // ===========================================

        this.connect = function (inport, outport)
        {
            if (!inport) inport = -1;
            if (!outport) outport = -1;
            // CONNECT
            if (inport != -1 && outport != -1) {
                // Initialize Socket Objects
                inSocket = new ECS.Socket();
                outSocket = new ECS.Socket();
                //outgoing = new ECSSocketOut(outPort,incoming.getInPort(),"43a47b6c-6ad9-449c-9ab8-90ca53aab265");

                inSocket.connect(inport, 'localhost');
                outSocket.connect(outport, 'localhost');
                
                inSocket.addEventListener("message", _self.processXMLMessage);
                bECSconnected = true;
            } else {
                console.log("NOT CONNECTED TO ECS");   
            }
        }
        
        this.joinRoom 			= function (room) {
            if (bVerbose) console.log("join room "+room);
            var joinRoomMess = "<message><type>join_room</type><destination><type>controller</type><room>" + room + "</room><controller/><application>" + _self.appUUID + "</application></destination></message>";   
            outSocket.send(joinRoomMess);
        }
        
        this.leaveRoom			= function(room)
        {
            var configMessage = "<message><type>leave_room</type><destination><type>controller</type><room>"+room+"</room><controller/><application>" + _self.appUUID + "</application></destination></message>";
            outSocket.send(configMessage);
        }

        this.sendConfigTo		= function(dest_controller, dest_uuid, key, value)
        {
            var configMessage = "<message><type>config_update</type><destination><type>direct</type><room/><controller>"+ dest_controller +"</controller><application>"+ dest_uuid +"</application></destination><configs><config><key>"+key+"</key><value>"+ value +"</value></config></configs></message>";
            outSocket.send(configMessage);
        }

        this.sendConfigToRoom 	= function (room, key, value) {
            var roomConfigMess = "<message><type>config_update</type><destination><type>room</type><room>" + room + "</room><controller/><application/></destination><configs><config><key>" + key + "</key><value>" + value + "</value></config></configs></message>";
            outSocket.send(roomConfigMess);
        }
        
        // ===========================================
        // ===== UTILS
        // ===========================================

        // Preconditions: Passed in a root node <message> in an XML "tree"
        // Postconditions: Appropriate handler will be called based on the message's <type>
        this.processXMLMessage	= function (_message) {	
            // throw away auth for now
            var start 	= _message.indexOf("<");
            _message	= _message.substr(start);
            if (bVerbose) console.log("Processing message... ");

            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(_message,"text/xml");

            // Analyze the type of this message
            if (xmlDoc.getElementsByTagName("type").length < 1) return;
            var type = xmlDoc.getElementsByTagName("type")[0];
            var messType = type.childNodes[0].nodeValue;
            if (bVerbose) console.log("type: " + messType);


            // Call the appropriate handlers based on the type of this message
            if (messType == "connection_data") {
                _self.handleConnectionEstablished();  

            } else if (messType == "start_performance") {
                _self.handleStartPerformance();

            } else if (messType == "stop_performance") {
                _self.handleStopPerformance();

            } else if (messType == "performance_config_update") {
                var configs = xmlDoc.getElementsByTagName("configs")[0];
                var curList = configs.childNodes;

                // Iterate through all of the "config" tags
                for (var i=0; i < curList.length; i++) {
                    var a_key 		= null;
                    var a_value 	= null;
                    var children = curList[i].childNodes;

                    // Iterate through all child tags (i.e., <key>  and  <value>  tags).
                    for (var j=0; j < children.length; j++) {
                        var curChild = children[j];

                        if ("key" == curChild.nodeName) {
                            a_key = curChild.childNodes[0].nodeValue;                        
                        } else if ("value" == curChild.nodeName) {
                            a_value = curChild.childNodes[0].nodeValue;                        
                        }
                    }

                    // Call function if we have a key/value pair from this config (which we should).
                    if (a_key != null && a_value != null) {
                        _self.handlePerformanceConfig(a_key, a_value);
                    }
                }


            } else if (messType == "config_update") {
                var configs = xmlDoc.getElementsByTagName("configs")[0];
                var curList = configs.childNodes;
                
                //pass along destination object!
                var dest	= xmlDoc.getElementsByTagName("destination")[0];
                
                var type	= "";
                var room	= "";
                var cont	= "";
                var app		= "";
                
                for (var i=0; i<dest.childNodes.length; i++){
                    if (dest.childNodes[i].childNodes.length > 0){
                        if (dest.childNodes[i].nodeName == "type"){
                            type	= dest.childNodes[i].childNodes[0].nodeValue;
                        } else if (dest.childNodes[i].nodeName == "room"){
                            room	= dest.childNodes[i].childNodes[0].nodeValue;
                        } else if (dest.childNodes[i].nodeName == "controller"){
                            cont	= dest.childNodes[i].childNodes[0].nodeValue;
                        }
                        else if (dest.childNodes[i].nodeName == "application"){
                            app		= dest.childNodes[i].childNodes[0].nodeValue;
                        }
                    }
                }
                
                var destObj	= {"type":type, "room":room, "controller":cont, "application":app};
                
                // Iterate through all of the "config" tags
                for (var i=0; i < curList.length; i++) {
                    var a_key 		= null;
                    var a_value 	= null;
                    var children 	= curList[i].childNodes;

                    // Iterate through all child tags (i.e., <key>  and  <value>  tags).
                    for (var j=0; j < children.length; j++) {
                        var curChild = children[j];

                        if ("key" == curChild.nodeName ) {
                            a_key = curChild.childNodes[0].nodeValue;                        
                        } else if ("value" == curChild.nodeName ) {
                            a_value = curChild.childNodes[0].nodeValue;                        
                        }
                    }

                    // Call function if we have a key/value pair from this config (which we should).
                    if (a_key != null && a_value != null) {
                        _self.handleConfig(a_key, a_value, destObj);
                    }
                }

            } else {
                if (bVerbose) console.log("Not yet processing messages of type " + messType + ".");
            }
        }

        // ===========================================
        // ===== EVENTS
        // ===========================================

        this.addEventListener = function addEventListener(event, callback){
            _self.events[event] = _self.events[event] || []; // check for undefined arg
            if (_self.events[event]){
                _self.events[event].push(callback);
            }
        }

        this.removeEventListener = function removeEventlistener(event,callback){
            if ( _self.events[event] ) {
                var listeners = _self.events[event];
                for ( var i = listeners.length-1; i>=0; --i ){
                    if ( listeners[i] === callback ) {
                        listeners.splice( i, 1 );
                        return true;
                    }
                }
            }
            return false
        }

        this.dispatchEvent = function dispatchEvent(event, data){
            if ( _self.events[event] ) {
                var listeners = _self.events[event], len = listeners.length;
                while ( len-- ) {
                    listeners[len](data);	//callback with self
                }		
            }
        }

        /*********************************************************
        XML message received by the controller which triggers this handle:
        <message>
        <type>connection_data</type>
        <destination>
            <type>direct</type>
            <room/>
            <controller>controller1.localhost</controller>
            <application>43a47b6c-6ad9-449c-9ab8-90ca53aab263</application>
        </destination>
         </message>
        *********************************************************/
        
        this.handleConnectionEstablished = function()
        {	
            _self.dispatchEvent("handleConnectionEstablished", null);
        };

        /*********************************************************
        XML message received by the controller which triggers this handle:
        <message>
        <type>start_performance</type>
        </message>
        *********************************************************/
        this.handleStartPerformance = function()
        {	
            _self.dispatchEvent("handleStartPerformance", null);
        };

        /*********************************************************
        XML message received by the controller which triggers this handle:
        <message>
        <type>stop_performance</type>
        </message>
        *********************************************************/  
        this.handleStopPerformance	 	= function()
        {	
            _self.dispatchEvent("handleStopPerformance", null);
        };
        
         // NOT YET IMPLEMENTED
        this.handleReceivedFile			= function(a_path)
        {	
            _self.dispatchEvent("handleReceivedFile", a_path);
        };

         // NOT YET IMPLEMENTED
        this.handleControllerList		= function(a_controllers)
        {	
            _self.dispatchEvent("handleControllerList", a_controllers);
        };

         // NOT YET IMPLEMENTED
        this.handleControllerData		= function(a_controller, a_ip, a_apps)
        {
            var data = {"a_controller":a_controller, "a_ip":a_ip, "a_apps":a_apps };			
            _self.dispatchEvent("handleControllerList", data);			
        };


        /*********************************************************
        XML message received by the controller which triggers this handle:
        <message>
        <type>config_update</type>
        <destination>
            <type/>
            <room/>
            <controller/>
            <application/>
        </destination>
        <configs>
                 <config>
                     <key>SOME_KEY</key>
                     <value>SOME_VALUE</value>
                 </config>
        </configs>
        </message>
        *********************************************************/       
        this.handleConfig			= function(a_key, a_value, destObj)
        {	
            var data = {"a_key":a_key, "a_value":a_value, "destination":destObj };
            _self.dispatchEvent("handleConfig", data);
        };

        /*********************************************************
        XML message received by the controller which triggers this handle:
        <message>
        <type>performance_config_update</type>
        <destination>
            <type/>
            <room/>
            <controller/>
            <application/>
        </destination>
        <configs>
            <config>
                <key>colorSet</key>
                <value>0</value>
            </config>
            <config>
                <key>density</key>
                <value>0</value>
            </config>
            <config>
                <key>duration</key>
                <value>0</value>
            </config>
            <config>
                <key>intensity</key>
                <value>0</value>
            </config>
            <config>
                <key>interactive</key>
                <value>0</value>
            </config>
            <config>
                <key>scale</key>
                <value>0</value>
            </config>
        </configs>
        </message>
        *********************************************************/       
        this.handlePerformanceConfig	= function(a_key, a_value)
        {	
            var data = {"a_key":a_key, "a_value":a_value };
            _self.dispatchEvent("handlePerformanceConfig", data);
        };
    }
    
}

// ======================================================================================
// ===== ECS SOCKET
// ======================================================================================

	ECS.Socket = function (){
		// private vars
        var _self       		=   this;
		var _port;		// this comes from the controller
		var _server				= 'localhost';
		var _outSocket;
		var bConnected			=	false;
		var bVerbose			= 	false;
		
		// events
		this.events 			= 	[];

		// public vars
	    this.name               =   'ECS_Connection';

		this.connect = function(port, server){
			_port 	= port;
			if (!server) server = _server;
			_server = server;

			//*
			var serverStr = 'ws://' + _server + ':' + _port;

			if (bVerbose) console.log('Attempting connection to ' + serverStr);
			//ws://localhost:60600

			_outSocket = new WebSocket(serverStr);
			_outSocket.onopen = function () {
				if (bVerbose) console.log('port open!');
				_self.dispatchEvent("open", null);
				bConnected	= true;
			};

			_outSocket.onmessage = function(msg){
				if (bVerbose) console.log('got message:', msg);
				_self.dispatchEvent("message", msg.data);
			};

			_outSocket.onclose = function(){
				if (bVerbose) console.log('socket connection closed');
				_self.dispatchEvent("close", null);
				bConnected	= false;
			}

		};

		this.send	= function (data)
		{
			//this could be smarter, but for now directly send
			if (bConnected){				
				var bodyLen = data.length;
				var headerLen = 0;
				var tempLength = bodyLen;
				while (tempLength > 0) {
				  tempLength = Math.floor( tempLength / 10);
				  headerLen++;
				}

				var _messageLength = 1 + headerLen + bodyLen;
				var _message = headerLen + "" + bodyLen + data;

				_outSocket.send(_message);
				if (bVerbose) console.log("sending "+_message);
			}
		}
		
		// ===========================================
		// ===== EVENTS
		// ===========================================
	
		this.addEventListener = function addEventListener(event, callback){
			_self.events[event] = _self.events[event] || []; // check for undefined arg
			if (_self.events[event]){
				_self.events[event].push(callback);
			}
		}
	
		this.removeEventListener = function removeEventlistener(event,callback){
			if ( _self.events[event] ) {
				var listeners = _self.events[event];
				for ( var i = listeners.length-1; i>=0; --i ){
					if ( listeners[i] === callback ) {
						listeners.splice( i, 1 );
						return true;
					}
				}
			}
			return false
		}
	
		this.dispatchEvent = function dispatchEvent(event, data){
			if ( _self.events[event] ) {
				var listeners = _self.events[event], len = listeners.length;
				while ( len-- ) {
					listeners[len](data);	//callback with self
				}		
			}
		}
	}
}


//}