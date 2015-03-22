// Declare app level module which depends on views, and components
angular.module('WebGLRLOApp')  
  .controller('WebGLMainController', ['$scope', 'webGLUtilities', 'webGLDrawUtilities', function($scope, webGLUtilities, webGLDrawUtilities) {
	    

    webGLUtilities.initCanvasModalWidget('canvas-modal-widget');

	var canvasModalWidget = webGLUtilities.getCanvasModalWidget();

      

      
	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Demo 1: Draws points at various extremes of the x, y, z axis which ranges from -1 to 1
	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	function drawPointExample() {

        // get the gl context from our modal widget
        var gl = canvasModalWidget.getGLContext();

        if (! gl) {
          throw new Error('Could not run drawPointExample() WebGL Demo!');
        }

        // get the shaders and compile them - the resultant will be a program that is automatically joined to the gl context in the background
        var program = canvasModalWidget.setGLVertexAndFragmentShaders('#v-shader-demo1', '#f-shader-demo1');

        


        // create vertex data and the buffer then bind them!
        var vertices = new Float32Array([
            0.0, 0.0, 0.0, // x , y, z coordinatates
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
           -1.0, 0.0, 0.0,
           -1.0,-1.0, 0.0,
           -1.0, 1.0, 0.0,
            1.0,-1.0, 0.0,
            0.0,-1.0, 0.0
          ]);

        var NUM_OF_COORDS = 3,
            vertexBuffer = gl.createBuffer();


        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


        // get the location of the a_Position attribute in the vertex shader
        var a_Position = gl.getAttribLocation(program, 'a_Position');

        // Assign the pointer
        gl.vertexAttribPointer(a_Position, NUM_OF_COORDS, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);


        // Set clear color to black, fully opaque
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // Clear the color buffer.
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw the points
        gl.drawArrays(gl.POINTS, 0, vertices.length / NUM_OF_COORDS);




        function a() {
	      	//render sphere

	       	//var sphereData = webGLDrawUtilities.createSphereVertexData(0.5); 
	       	var sphereData = webGLDrawUtilities.createCubeVertexData(0.5, 0.5);
	      	/*var sphereVertexNormalBuffer = gl.createBuffer();
	        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereData.normalData), gl.STATIC_DRAW);
	        sphereVertexNormalBuffer.itemSize = 3;
	        sphereVertexNormalBuffer.numItems = sphereData.normalData.length / sphereVertexNormalBuffer.itemSize;*/


	        var sphereVertexPositionBuffer = gl.createBuffer();
	        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereData.vertexPositionData), gl.STATIC_DRAW);
	        sphereVertexPositionBuffer.itemSize = 3;
	        sphereVertexPositionBuffer.numItems = sphereData.vertexPositionData.length / sphereVertexPositionBuffer.itemSize;

	        var sphereVertexIndexBuffer = gl.createBuffer();
	        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
	        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereData.vertexIndexData), gl.STATIC_DRAW);
	        sphereVertexIndexBuffer.itemSize = 1;
	        sphereVertexIndexBuffer.numItems = sphereData.vertexIndexData.length;



	        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	        gl.vertexAttribPointer(a_Position, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);


	        //gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	        //gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
	   
	        gl.drawElements(gl.LINE_LOOP, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	    }

      }

      



	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Demo 2: Draws points at various extremes of the x, y, z axis which ranges from -1 to 1
	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	function drawSimpleShapeWithMouseExample() {

	    // get the gl context from our modal widget
	    var gl = canvasModalWidget.getGLContext(),
	    	RESIZE_EVENT_NAME = 'resize.demo2',
	    	_window = $(window);

	    if (! gl) {
	      throw new Error('Could not run drawPointExample() WebGL Demo!');
	    }

	    

	    canvasModalWidget.onHide(function() {
	    	console.log('Closed');
	    	_window.unbind(RESIZE_EVENT_NAME);
	    });

	    // get the shaders and compile them - the resultant will be a program that is automatically joined to the gl context in the background
	    var program = canvasModalWidget.setGLVertexAndFragmentShaders('#v-shader-demo1', '#f-shader-demo1');
	    var freeFormPoints = [];



	    var NUM_OF_COORDS = 2;
	    var vertexBuffer = gl.createBuffer();
	    var _canvasRect = null;
	    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	    gl.vertexAttribPointer(a_Position, NUM_OF_COORDS, gl.FLOAT, false, 0, 0);

	    // get the location of the a_Position attribute in the vertex shader
	    var a_Position = gl.getAttribLocation(program, 'a_Position');

	    gl.enableVertexAttribArray(a_Position);

	    _window.on(RESIZE_EVENT_NAME, function() { console.log('window resized!'); _canvasRect = null; })


	    function _draw() {
	      gl.clear(gl.COLOR_BUFFER_BIT);
	      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(freeFormPoints), gl.STATIC_DRAW);
	      gl.drawArrays(gl.POINTS, 0, freeFormPoints.length / 2);
	    }




	    function _bindMouseEvents() {
	      	var __startTracking = false,
	          	__glCanvas = canvasModalWidget.getGLCanvasEl(),
	          	__midCanvasHeight = __glCanvas.height() / 2,
	          	__midCanvasWidth = __glCanvas.width() / 2;
	          

	    	function __captureMouseCoords(e) {
				var x = e.clientX, // x coordinate of a mouse pointer
				y = e.clientY; // y coordinate of a mouse pointer

	          	_canvasRect = _canvasRect || e.target.getBoundingClientRect();



	          	x = ((x - _canvasRect.left) - __midCanvasWidth) / __midCanvasWidth;
	          	y = (__midCanvasHeight - (y - _canvasRect.top))  / __midCanvasHeight;


	          	freeFormPoints.push(x), freeFormPoints.push(y);
	          	//console.log(freeFormPoints.length/2)

	          	_draw();
	          	//console.log(e);
	    	}

			__glCanvas
				.on('mousedown', function(event) {
				  __startTracking = true;
				  event.stopPropagation();

				  __captureMouseCoords(event);

				})
				.on('mousemove', function(event) {

				  if (! __startTracking) {
				    return;
				  }
				 
				  __captureMouseCoords(event);
				 
				})
				.on('mouseup', function(e) {
				  __startTracking = false;
				});

		}





		    function _init() {
		      // Set clear color to black, fully opaque
		      gl.clearColor(0.0, 0.0, 0.0, 1.0);



		      // Clear the color buffer.
		      gl.clear(gl.COLOR_BUFFER_BIT);

		      _bindMouseEvents();
		    }

		    _init();


	}


	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Demo 3: Draws points at various extremes of the x, y, z axis which ranges from -1 to 1
	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	function shapesExample() {

      	// get the gl context from our modal widget
        var gl = canvasModalWidget.getGLContext();

        if (! gl) {
          throw new Error('Could not run shapesExample() WebGL Demo!');
        }

        // get the shaders and compile them - the resultant will be a program that is automatically joined to the gl context in the background
        var program = canvasModalWidget.setGLVertexAndFragmentShaders('#v-shader-demo3', '#f-shader-demo3');




        // create vertex data and the buffer then bind them!
        var vertices = new Float32Array([
           	-0.5, 0.0, 0.0, // x , y, z coordinatates
            0.5, 0.0, 0.0,
        	0.0, 1.0, 0.0
          ]);

        var NUM_OF_COORDS = 3,
            vertexBuffer = gl.createBuffer();


        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


        // get the location of the a_Position attribute in the vertex shader
        var a_Position = gl.getAttribLocation(program, 'a_Position');
        var u_Translation = gl.getUniformLocation(program, 'u_Translation');
        var u_FragColour =  gl.getUniformLocation(program, 'u_FragColour'); 

        // Assign the pointer
        gl.vertexAttribPointer(a_Position, NUM_OF_COORDS, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);


        // Set clear color to black, fully opaque
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // Clear the color buffer.
        gl.clear(gl.COLOR_BUFFER_BIT);


        var translations = [
        	{x: 0, y: 0, z: 0, drawMode: gl.TRIANGLES, colour: [1.0, 0.0, 0.0, 1.0]},
        	{x: -0.5, y: -1.0, z: 0, drawMode: gl.LINE_LOOP, colour: [0.0, 1.0, 0.0, 1.0]},
        	{x: 0.5, y: -1.0, z: 0, drawMode: gl.TRIANGLE_STRIP,  colour: [0.0, 0.0, 1.0, 1.0]}
        ];

        for (var i = 0; i < translations.length; i++) {
        	var t = translations[i],
        		RGBComponent = t.colour;

        	gl.uniform4f(u_Translation, t.x, t.y, t.z, 0.0);
        	gl.uniform4f(u_FragColour, RGBComponent[0], RGBComponent[1], RGBComponent[2], 1.0);


        	// Draw the points
        	gl.drawArrays(t.drawMode, 0, 3);	
        }

        
    }

	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Demo 4: Draws points at various extremes of the x, y, z axis which ranges from -1 to 1
	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	function shapesFragmentVaryingExample() {
		// get the gl context from our modal widget
		var gl = canvasModalWidget.getGLContext();

		if (! gl) {
		  throw new Error('Could not run shapesExample() WebGL Demo!');
		}

		// get the shaders and compile them - the resultant will be a program that is automatically joined to the gl context in the background
		var program = canvasModalWidget.setGLVertexAndFragmentShaders('#v-shader-demo4', '#f-shader-demo4');




		// create vertex data and the buffer then bind them!
		var verticesWithColours = new Float32Array([
		   	-1.0, -1.0, 0.0, /* Colors (RGB) --> */ 1.0, 0.0, 0.0, // x , y, z, r, g, b, a coordinatates
		    1.0, -1.0, 0.0, /* Colors (RGB) --> */ 0.0, 1.0, 0.0,
			0.0, 1.0, 0.0, /* Colors (RGB) --> */ 0.0, 0.0, 1.0
		  ]);

		var NUM_OF_COORDS = 3,
		    vertexBuffer = gl.createBuffer();

		// create vertex buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, verticesWithColours, gl.STATIC_DRAW);

		// create colour buffer
		var vertexColourBuffer = gl.createBuffer();
		gl.bufferData(gl.ARRAY_BUFFER, verticesWithColours, gl.STATIC_DRAW);

		// get the location of the a_Position attribute in the vertex shader
		var a_Position = gl.getAttribLocation(program, 'a_Position');
		var a_Colour = gl.getAttribLocation(program, 'a_Colour');


		var SIZE_OF_ELEMENT = verticesWithColours.BYTES_PER_ELEMENT;

		// Assign the pointer
		gl.vertexAttribPointer(a_Position, NUM_OF_COORDS, gl.FLOAT, false, SIZE_OF_ELEMENT * 6, 0);
		gl.enableVertexAttribArray(a_Position);

		gl.vertexAttribPointer(a_Colour, NUM_OF_COORDS, gl.FLOAT, false,  SIZE_OF_ELEMENT * 6, SIZE_OF_ELEMENT * NUM_OF_COORDS);
		gl.enableVertexAttribArray(a_Colour); 


		// Set clear color to black, fully opaque
		gl.clearColor(0.0, 0.0, 0.0, 1.0);

		// Clear the color buffer.
		gl.clear(gl.COLOR_BUFFER_BIT);


		// Draw the points
		gl.drawArrays(gl.TRIANGLES, 0, NUM_OF_COORDS);	

	}


	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Demo 5: Draws points at various extremes of the x, y, z axis which ranges from -1 to 1
	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	function animating3DPrimativesExample() {

		// get the gl context from our modal widget
        var _gl = null,
        	_glProgram = null,
        	_sphere = null,
        	_quad = null,
        	_lastDrawTime = 0,
        	_isAppRunning = true;
        	

        ///////////////////////////////////////////////////////////////////////////////////////////////////
        //	_Sphere(radius) Constructor method is used to represent and Sphere with a radius
        //  this sphere can draw itself and adjust its orientation on the canvas via the accessor methods.
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        function _Sphere(radius) {
        	var __sphereData = null,
        		__sphereVertexPositionBuffer = null,
        		__sphereVertexIndexBuffer = null,
        		
        		__colour = {r: 0.8, g: 0.8, b: 0.8, a: 1.0},
        		__radius = radius || 1.0,
        		__modelMatrix = mat4.create(),
        		__rotationMatrix = mat4.create(),
        		__translationMatrix = mat4.create(),
        		__scaleMatrix = mat4.create();

        	function __init() {
        		__sphereData = webGLDrawUtilities.createSphereVertexData(__radius);

        		// create the buffer for vertex positions and assign it to that buffer to use for later
        		__sphereVertexPositionBuffer = _gl.createBuffer();        		
        		__sphereVertexPositionBuffer.itemSize = 3;
        		__sphereVertexPositionBuffer.numItems = __sphereData.vertexPositionData.length / __sphereVertexPositionBuffer.itemSize;
        		__sphereVertexPositionBuffer.items = new Float32Array(__sphereData.vertexPositionData);

        		// create the buffer for vertex positions indexes and assign it to that buffer to use for later
        		__sphereVertexIndexBuffer = _gl.createBuffer();
        		__sphereVertexIndexBuffer.itemSize = 1;
        		__sphereVertexIndexBuffer.numItems = __sphereData.vertexIndexData.length;
        		__sphereVertexIndexBuffer.items = new Uint16Array(__sphereData.vertexIndexData);


        	}

        	function __draw() {
        		mat4.multiply(__modelMatrix, __translationMatrix, __rotationMatrix);
        		mat4.multiply(__modelMatrix, __modelMatrix, __scaleMatrix);
        		
        		_gl.uniformMatrix4fv(_glProgram.customAttribs.u_ModelMatrixRef, false, __modelMatrix);

        		_gl.bindBuffer(_gl.ARRAY_BUFFER, __sphereVertexPositionBuffer);
        		_gl.bufferData(_gl.ARRAY_BUFFER, __sphereVertexPositionBuffer.items, _gl.STATIC_DRAW);

        		_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __sphereVertexIndexBuffer);
        		_gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, __sphereVertexIndexBuffer.items, _gl.STATIC_DRAW);
        		
        		_gl.vertexAttribPointer(_glProgram.customAttribs.a_PositionRef, __sphereVertexPositionBuffer.itemSize, _gl.FLOAT, false, 0, 0);
        		_gl.enableVertexAttribArray(_glProgram.customAttribs.a_PositionRef); 


        		_gl.uniform4f(_glProgram.customAttribs.u_FragColourRef, __colour.r, __colour.g, __colour.b, __colour.a);
        	
        		_gl.drawElements(_gl.LINE_LOOP, __sphereVertexIndexBuffer.numItems, _gl.UNSIGNED_SHORT, 0);

        	}


        	function __rotateOnAxisByDegrees(x, y, z) {

        		if (typeof x === 'number') {	
      				mat4.rotateX(__rotationMatrix, __rotationMatrix, glMatrix.toRadian(x));
        		}
        		
        		if (typeof y === 'number') {
        			mat4.rotateY(__rotationMatrix, __rotationMatrix, glMatrix.toRadian(y)); 
        		}

        		if (typeof z === 'number') {
        			mat4.rotateZ(__rotationMatrix, __rotationMatrix, glMatrix.toRadian(z)); 
        		}

        		return this;

        	}


        	function __scale(s) {
        		if (typeof s === 'number') {
        			mat4.scale(__scaleMatrix, __scaleMatrix, vec3.fromValues(s, s, s));
        		}

        		return this;
        	}

        	function __translate(x, y, z) {
        		
        		mat4.translate(__translationMatrix, __translationMatrix, vec3.fromValues(x, y, z));
        		
        		return this;
        	}

        	__init();

        	
        	
        	this.rotateOnAxisByDegrees = __rotateOnAxisByDegrees;

        	this.draw = __draw;

        	this.scale = __scale;

        	this.translate = __translate;

        	this.setColour = function(r, g, b, a) {
        		__colour.r = r;
        		__colour.g = g;
        		__colour.b = b;
        		__colour.a = a;
        	};

        	this.getRadius = function() {
        		return __radius;
        	};


       		return this; 		
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //	_Quad(x, y, z) Constructor method is used to represent and Quadrilateral (rectangle) with 
        //  width, height and depth (x, y ,z) dimensions respectively.ß
        //  This quadrilateral can draw itself and adjust its orientation on the canvas via the accessor methods.
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function _Quad(x, y, z) {

        	var __quadData = null,
        		__quadVertexPositionBuffer = null,
        		__quadVertexIndexBuffer = null,
        		__colour = {r: 1.0, g: 0.0, b: 1.0, a: 1.0},
        		
        		__modelMatrix = mat4.create(),
        		__rotationMatrix = mat4.create(),
        		__translationMatrix = mat4.create(),
        		__scaleMatrix = mat4.create();

        	function __init() {
        		__quadData = webGLDrawUtilities.createCubeVertexData(x, y, z);

        		// create the buffer for vertex positions and assign it to that buffer to use for later
        		__quadVertexPositionBuffer = _gl.createBuffer();        		
        		__quadVertexPositionBuffer.itemSize = 3;
        		__quadVertexPositionBuffer.numItems = __quadData.vertexPositionData.length / __quadVertexPositionBuffer.itemSize;
        		__quadVertexPositionBuffer.items = new Float32Array(__quadData.vertexPositionData);

        		// create the buffer for vertex positions indexes and assign it to that buffer to use for later
        		__quadVertexIndexBuffer = _gl.createBuffer();
        		__quadVertexIndexBuffer.itemSize = 1;
        		__quadVertexIndexBuffer.numItems = __quadData.vertexIndexData.length;
        		__quadVertexIndexBuffer.items = new Uint16Array(__quadData.vertexIndexData);


        	}

        	function __draw() {
        		mat4.multiply(__modelMatrix, __translationMatrix, __rotationMatrix);
        		mat4.multiply(__modelMatrix, __modelMatrix, __scaleMatrix);
        		
        		_gl.uniformMatrix4fv(_glProgram.customAttribs.u_ModelMatrixRef, false, __modelMatrix);

        		_gl.bindBuffer(_gl.ARRAY_BUFFER, __quadVertexPositionBuffer);
        		_gl.bufferData(_gl.ARRAY_BUFFER, __quadVertexPositionBuffer.items, _gl.STATIC_DRAW);

        		_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __quadVertexIndexBuffer);
        		_gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, __quadVertexIndexBuffer.items, _gl.STATIC_DRAW);
        		
        		_gl.vertexAttribPointer(_glProgram.customAttribs.a_PositionRef, __quadVertexPositionBuffer.itemSize, _gl.FLOAT, false, 0, 0);
        		_gl.enableVertexAttribArray(_glProgram.customAttribs.a_PositionRef); 

        		_gl.uniform4f(_glProgram.customAttribs.u_FragColourRef, __colour.r, __colour.g, __colour.b, __colour.a);
        		

        		_gl.drawElements(_gl.LINE_LOOP, __quadVertexIndexBuffer.numItems, _gl.UNSIGNED_SHORT, 0);

        	}


        	function __rotateOnAxisByDegrees(x, y, z) {

        		if (typeof x === 'number') {	
      				mat4.rotateX(__rotationMatrix, __rotationMatrix, glMatrix.toRadian(x));
        		}
        		
        		if (typeof y === 'number') {
        			mat4.rotateY(__rotationMatrix, __rotationMatrix, glMatrix.toRadian(y)); 
        		}

        		if (typeof z === 'number') {
        			mat4.rotateZ(__rotationMatrix, __rotationMatrix, glMatrix.toRadian(z)); 
        		}

        		return this;

        	}


        	function __scale(s) {
        		if (typeof s === 'number') {
        			mat4.scale(__scaleMatrix, __scaleMatrix, vec3.fromValues(s, s, s));
        		}

        		return this;
        	}

        	function __translate(x, y, z) {
        		
        		mat4.translate(__translationMatrix, __translationMatrix, vec3.fromValues(x, y, z));
        		
        		return this;
        	}

        	__init();

        	
        	
        	this.rotateOnAxisByDegrees = __rotateOnAxisByDegrees;

        	this.draw = __draw;

        	this.scale = __scale;

        	this.translate = __translate;

        	this.setColour = function(r, g, b, a) {
        		__colour.r = r;
        		__colour.g = g;
        		__colour.b = b;
        		__colour.a = a;
        	};




       		return this;


        } 

        

		function _init() {

			var glCanvas  = webGLUtilities;

			_gl = canvasModalWidget.getGLContext();

		 	if (! _gl) {
          		throw new Error('Could not run animating3DPrimativesExample() WebGL Demo!');
        	}

			canvasModalWidget.onHide(function() {
				_isAppRunning = false;
				//console.log('cancel request animation');
			});

			 // Set clear color to black, fully opaque
        	_gl.clearColor(0.0, 0.0, 0.0, 1.0);	

        	// dealing with 3D space geometry so make sure this feature is enabled
        	_gl.enable(_gl.DEPTH_TEST);

			// get the shaders and compile them - the resultant will be a program that is automatically joined to the gl context in the background
        	_glProgram = canvasModalWidget.setGLVertexAndFragmentShaders('#v-shader-demo5', '#f-shader-demo5');
        	_glProgram.customAttribs = {};
		
			// Get the storage locations of all the customizable shader variables 
			_glProgram.customAttribs.a_PositionRef = _gl.getAttribLocation(_glProgram, 'a_Position'),
			_glProgram.customAttribs.u_FragColourRef = _gl.getUniformLocation(_glProgram, 'u_FragColour'),
			_glProgram.customAttribs.u_ViewMatrixRef = _gl.getUniformLocation(_glProgram,'u_ViewMatrix'),
			_glProgram.customAttribs.u_ModelMatrixRef = _gl.getUniformLocation(_glProgram, 'u_ModelMatrix'),
			_glProgram.customAttribs.u_PerspectiveRef = _gl.getUniformLocation(_glProgram, 'u_PerspectiveMatrix');

			var perspectiveMatrix = mat4.create(), // get the identity matrix
				viewMatrix = mat4.create(),
				modelMatrix = mat4.create();

			/*
				mat4.perspective(out, fovy, aspect, near, far)
				Generates a perspective projection matrix with the given bounds
				from: http://glmatrix.net/docs/2.2.0/symbols/mat4.html
			*/

			mat4.perspective(perspectiveMatrix, glMatrix.toRadian(45.0), canvasModalWidget.getGLViewportAspectRatio(), 1, 1000);
			_glProgram.customAttribs.perspectiveMatrix = perspectiveMatrix;


			


			/*
				{mat4} mat4.lookAt(out, eye, center, up)
				Generates a look-at matrix with the given eye position, focal point, and up axis
				from: http://glmatrix.net/docs/2.2.0/symbols/mat4.html
			*/
			mat4.lookAt(viewMatrix, vec3.fromValues(0, 0, 5), vec3.fromValues(0, 0, -50), vec3.fromValues(0, 1, 0));
			_glProgram.customAttribs.viewMatrix = viewMatrix;

			_glProgram.customAttribs.modelMatrix = modelMatrix;

			//_gl.uniformMatrix4fv(_glProgram.customAttribs.u_ModelMatrixRef, false, _glProgram.customAttribs.modelMatrix);
			_gl.uniformMatrix4fv(_glProgram.customAttribs.u_ViewMatrixRef, false, _glProgram.customAttribs.viewMatrix);
			_gl.uniformMatrix4fv(_glProgram.customAttribs.u_PerspectiveRef, false, _glProgram.customAttribs.perspectiveMatrix);


			// create some primitives that can keep track of their own orientation and draw themselves
			_sphere = new _Sphere();			
			_sphere.translate(-1.6,0,0);

			_quad = new _Quad(2, 0.5, 0.5);
			_quad.translate(0, 0, 2).scale(0.5);

			_tick();

		      	
      }

      
    var _frameCount = 0,
   		_xInc = 0.01,
  	  	_yInc = 0.001,
  	  	_zInc = 0.005;

    function _tick() {
           	
      	// Clear the color and depth buffer because now we are dealing with perspective and camera space.
      	// and we want everything to look natural...
        _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);


        // show some arbitrary movement along 3D space and do some rotations while we are at it
       	_sphere
       		.rotateOnAxisByDegrees(1,1,0)
			.translate(_xInc, _yInc, _zInc)
       		.draw();

       	_quad
       		.rotateOnAxisByDegrees(-1,-1,0)
       		.draw();

       	// counter used to create a pattern for the primitives to move and rotate along the screen
       	_frameCount++;


       	if (_frameCount >= 220) {
       		_xInc = - _xInc;
       		_yInc = - _yInc;
       		_zInc = - _zInc;
       		_frameCount = 0;
       	}
       	
       	// stop calling the browser's animate when ready callback function when the modal has closed
       	if (_isAppRunning) {
       		requestAnimationFrame(_tick);
       	}
    }


     // start this demo up!
	_init();


	}


	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Demo 6: Draws points at various extremes of the x, y, z axis which ranges from -1 to 1
	///////////////////////////////////////////////////////////////////////////////////////////////////////////
  	function lightingExample() {

	}

    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Pong!!!
	/////////////////////////////////////////////////////////////////////////////////////////////////////////// 	
  	function PongGLGame() {

  	}
      





  	////////////////////////////////////////////////////
  	////////////////////////////////////////////////////

  	var demos = [
        [
	        {
	          caption: 'Draw Fixed Points',
	          details: 'Draw a 30 pixel dimensioned point on screen...',
	          appFn: drawPointExample,
	          screenShotURL: 'styles/app/images/demo1.png'
	        },
	        {
	          caption: 'Free Draw Example',
	          details: 'Freeform draw large pixels on screen...',
	          appFn: drawSimpleShapeWithMouseExample,
	          screenShotURL: 'styles/app/images/demo2.png'
	        }
        ],
        [
	        {
	          caption: 'Draw Modes and Translations',
	          details: 'Draw some trinagles using different draw modes and do uniform translations to position 1 shape 3 different ways.',
	          appFn: shapesExample,
	          screenShotURL: 'styles/app/images/demo3.png'
	        },
	         {
	          caption: 'Fragment Shader Interpolation',
	          details: ' ',
	          appFn: shapesFragmentVaryingExample,
	          screenShotURL: 'styles/app/images/demo4.png'
	        }
	     ],
	     [
	         {
	          caption: 'Animation of 3D Primitives',
	          details: ' ',
	          appFn: animating3DPrimativesExample,
	          screenShotURL: 'styles/app/images/demo5.png'
	        },
	        {
	          caption: 'Lighting Example',
	          details: ' ',
	          appFn: lightingExample,
	          screenShotURL: 'styles/app/images/demo4.png'
	        }
        ],
        [
        	{
	          caption: 'PongGL!',
	          details: ' ',
	          appFn: PongGLGame,
	          screenShotURL: 'styles/app/images/demo4.png'
	        }
        ]
      ];

      // Only continue if WebGL is available and working

      function _DemoRunner() {

        this.run = function(demo) {

          var demoObject = demo;

          if (typeof demoObject === 'undefined') {
            throw new Error('Could not find the demo app you were refering too...');
          }

          canvasModalWidget.setCaption(demoObject.caption || null)
          	.setDetailText(demoObject.details || null)
          	.show(demoObject.appFn);

        };


        this.getDemos = function(index) {

          if (typeof index === 'number') {
            if (index < demos.length) {
              return demos[index];
            }
            else if (index >= demos.length) {
              return false;
            }
          }

          return demos;

        };

        return this;
      }

      $scope.demoRunner = new _DemoRunner();


  }]);