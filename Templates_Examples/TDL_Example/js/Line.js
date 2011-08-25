// ===========================================
// ===== LINE
// ===========================================

	function Line( shapeShader ){
		
		var self = this;
		var lineMesh;
				
		this.x 	 	= 0;
		this.y 	 	= 0;
		this.width	= 100;
		this.height	= 100;
		
		var index	= 1;
				
		lineMesh 		= new LabMesh();
		lineMesh.setRenderType(GL.LINE_STRIP);
		
		var points = [window.innerWidth/2,window.innerHeight/2,0];
		var colors = [1,1,1,1];
		var indices = [0];
				
		this.addPoint = function(x,y)
		{
			// fade back z of other points
			for (var i=0; i<points.length; i+=3)
			{
				points[i+2] -= 10;
			}
			
			points.push(x);
			points.push(y);
			points.push(0);
			
			colors.push(Math.random());
			colors.push(Math.random());
			colors.push(Math.random());
			colors.push(1);
			
			//indices.push(index);
			indices.push(index++);
			
			if (points.length > 500){
				points.unshift();
				colors.unshift();
				indices.unshift();
			}
			
		}
		
		this.update = function()
		{
			// normally we'd update a buffer, but since the size of our indices
			// have changed, we need to recreate the buffers
			
			lineMesh.deleteBuffer(lineMesh.posBuffer);
			lineMesh.deleteBuffer(lineMesh.colBuffer);
			lineMesh.deleteBuffer(lineMesh.indexBuffer);
			
			lineMesh.posBuffer 		= lineMesh.addBuffer( shapeShader, points, 3, 'aPosition' );
			lineMesh.colBuffer 		= lineMesh.addBuffer( shapeShader, colors, 4, 'aColor');
			lineMesh.indexBuffer 	= lineMesh.addIndexBuffer( indices );
			
			//lineMesh.updateBuffer( lineMesh.posBuffer, points );
			//lineMesh.updateBuffer( lineMesh.colBuffer, colors );
			//lineMesh.updateIndexBuffer( indices );
			//lineMesh.addIndexBuffer( indices );
		}
		
		this.draw	= function()
		{
			shapeShader.begin();{
				lineMesh.draw();
			} shapeShader.end();
		}
		
		
		for (var i=0; i<10; i++){
			this.addPoint(Math.random()*window.innerWidth, Math.random()*window.innerHeight)
		}
		
		//shapeShader.addAttribute( 'aColor' ); // why do we have to do this??
		lineMesh.posBuffer = lineMesh.addBuffer( shapeShader, points, 3, 'aPosition' );
		lineMesh.colBuffer = lineMesh.addBuffer( shapeShader, colors, 4, 'aColor');
		lineMesh.indexBuffer = lineMesh.addIndexBuffer( indices );
	}