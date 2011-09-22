// ===========================================
// ===== RECTANGLE
// ===========================================

	function Rectangle( shapeShader ){
		
		var self = this;
		var rectMesh;
		
		this.x 	 	= 0;
		this.y 	 	= 0;
		this.width	= 100;
		this.height	= 100;
		
		this.colors = [new Color(0,0,0,1), new Color(0,0,0,1),new Color(0,0,0,1), new Color(0,0,0,1) ];
		
		rectMesh 		= new LabMesh();
		rectMesh.colors	= [0,0,0,1, 0,0,0,1, 0,0,0,1, 1,0,0,1];		
		rectMesh.pos 	= [this.x,this.y,0, this.x + this.width,this.y,0, this.x + this.width,this.y + this.height,0, this.x,this.y + this.height,0];
		
		//shapeShader.addAttribute( 'aColor' ); // why do we have to do this??
		rectMesh.posBuffer = rectMesh.addBuffer( shapeShader, rectMesh.pos, 3, 'aPosition' );
		rectMesh.colBuffer = rectMesh.addBuffer( shapeShader, rectMesh.colors, 4, 'aColor');
		rectMesh.addIndexBuffer( [0,1,2, 0,2,3] );
		
		this.update = function()
		{
			rectMesh.pos 	= [this.x,this.y,0, this.x + this.width,this.y,0, this.x + this.width,this.y + this.height,0, this.x,this.y + this.height,0];
			rectMesh.colors	= [this.x/window.innerWidth,0,0,1, 
								this.x/window.innerWidth, this.y/window.innerHeight,0,1, 
								1,this.x/window.innerWidth,this.y/window.innerHeight,1, 
								this.x/window.innerWidth,0,this.y/window.innerHeight,.1];
			rectMesh.updateBuffer( rectMesh.posBuffer, rectMesh.pos );
			rectMesh.updateBuffer( rectMesh.colBuffer, rectMesh.colors );
		}
		
		this.draw	= function()
		{
			shapeShader.begin();{
				rectMesh.draw();
			} shapeShader.end();
		}		
	}
	
	function Color( r, g, b, a )
	{
		var red 	= r || 1.0;
		var green 	= g || 1.0;
		var blue 	= b || 1.0;
		var alpha	= a || 1.0;
		
		this.r = red;
		this.g = green;
		this.b = blue;
		this.a = alpha;
		
		this.getArray = function(){
			return new Array(this.r, this.g, this.b, this.a);
		}
	}