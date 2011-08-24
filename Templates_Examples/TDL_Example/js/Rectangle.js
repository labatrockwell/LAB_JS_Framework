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
		
		rectMesh 		= new LabMesh();
		rectMesh.colors	= [1.0,0.0,0.0,.5, 1.0,0.0,1.0,.5, 1.0,1.0,0.0,.5, 1.0,0.0,1.0,.5];		
		rectMesh.pos 	= [this.x,this.y,0, this.x + this.width,this.y,0, this.x + this.width,this.y + this.height,0, 0,this.y + this.height,0];
		
		rectMesh.posBuffer = rectMesh.addBuffer( shapeShader, rectMesh.pos, 3, 'aPosition' );
		rectMesh.colBuffer = rectMesh.addBuffer( shapeShader, rectMesh.colors, 4, 'aColor');
		rectMesh.addIndexBuffer( [0,1,2, 0,2,3] );
		
		this.update = function()
		{
			rectMesh.pos 	= [this.x,this.y,0, this.x + this.width,this.y,0, this.x + this.width,this.y + this.height,0, this.x,this.y + this.height,0];
			rectMesh.colors	= [1.0,0.0,0.0,.5, 1.0,0.0,1.0,.5, 1.0,1.0,0.0,.5, 1.0,0.0,1.0,.5];
			
			rectMesh.updateBuffer( rectMesh.posBuffer, rectMesh.pos );
			//rectMesh.updateBuffer( rectMesh.colBuffer, rectMesh.colors );
		}
		
		this.draw	= function()
		{
			shapeShader.begin();{
				rectMesh.draw();
			} shapeShader.end();
		}		
	}