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

            _gl.bindBuffer(_gl.ARRAY_BUFFER, __sphereVertexPositionBuffer);
            _gl.bufferData(_gl.ARRAY_BUFFER, __sphereVertexPositionBuffer.items, _gl.STATIC_DRAW);

        		// create the buffer for vertex positions indexes and assign it to that buffer to use for later
        		__sphereVertexIndexBuffer = _gl.createBuffer();
        		__sphereVertexIndexBuffer.itemSize = 1;
        		__sphereVertexIndexBuffer.numItems = __sphereData.vertexIndexData.length;
        		__sphereVertexIndexBuffer.items = new Uint16Array(__sphereData.vertexIndexData);

            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __sphereVertexIndexBuffer);
            _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, __sphereVertexIndexBuffer.items, _gl.STATIC_DRAW);


        	}

        	function __draw() {
        		mat4.multiply(__modelMatrix, __translationMatrix, __rotationMatrix);
        		mat4.multiply(__modelMatrix, __modelMatrix, __scaleMatrix);

        		_gl.uniformMatrix4fv(_glProgram.customAttribs.u_ModelMatrixRef, false, __modelMatrix);

        		_gl.bindBuffer(_gl.ARRAY_BUFFER, __sphereVertexPositionBuffer);
        		_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __sphereVertexIndexBuffer);

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

            _gl.bindBuffer(_gl.ARRAY_BUFFER, __quadVertexPositionBuffer);
            _gl.bufferData(_gl.ARRAY_BUFFER, __quadVertexPositionBuffer.items, _gl.STATIC_DRAW);

        		// create the buffer for vertex positions indexes and assign it to that buffer to use for later
        		__quadVertexIndexBuffer = _gl.createBuffer();
        		__quadVertexIndexBuffer.itemSize = 1;
        		__quadVertexIndexBuffer.numItems = __quadData.vertexIndexData.length;
        		__quadVertexIndexBuffer.items = new Uint16Array(__quadData.vertexIndexData);

            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __quadVertexIndexBuffer);
            _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, __quadVertexIndexBuffer.items, _gl.STATIC_DRAW);


        	}

        	function __draw() {
        		mat4.multiply(__modelMatrix, __translationMatrix, __rotationMatrix);
        		mat4.multiply(__modelMatrix, __modelMatrix, __scaleMatrix);

        		_gl.uniformMatrix4fv(_glProgram.customAttribs.u_ModelMatrixRef, false, __modelMatrix);

        		_gl.bindBuffer(_gl.ARRAY_BUFFER, __quadVertexPositionBuffer);
        		_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __quadVertexIndexBuffer);

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

	//////////////////////////////////////////////////








	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Demo 6: Draws points at various extremes of the x, y, z axis which ranges from -1 to 1
	///////////////////////////////////////////////////////////////////////////////////////////////////////////
  	function lightingExample() {
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
        		__sphereVertexNormalBuffer = null,

        		__colour = {r: 0.8, g: 0.8, b: 0.8, a: 1.0},
        		__radius = radius || 1.0,
        		__modelMatrix = mat4.create(),
        		__rotationMatrix = mat4.create(),
        		__translationMatrix = mat4.create(),
        		__scaleMatrix = mat4.create(),
            __PVMMatrix = mat4.create(),
            __normalMatrix = mat3.create(),
            __shouldUpdateMatrices = true;

        	function __init() {
        		__sphereData = webGLDrawUtilities.createSphereVertexData(__radius);

        		// create the buffer for vertex positions and assign it to that buffer to use for later
        		__sphereVertexPositionBuffer = _gl.createBuffer();
        		__sphereVertexPositionBuffer.itemSize = 3;
        		__sphereVertexPositionBuffer.numItems = __sphereData.vertexPositionData.length / __sphereVertexPositionBuffer.itemSize;
        		__sphereVertexPositionBuffer.items = new Float32Array(__sphereData.vertexPositionData);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, __sphereVertexPositionBuffer);
            _gl.bufferData(_gl.ARRAY_BUFFER, __sphereVertexPositionBuffer.items, _gl.STATIC_DRAW);

        		// create the buffer for vertex positions indexes and assign it to that buffer to use for later
        		__sphereVertexIndexBuffer = _gl.createBuffer();
        		__sphereVertexIndexBuffer.itemSize = 1;
        		__sphereVertexIndexBuffer.numItems = __sphereData.vertexIndexData.length;
        		__sphereVertexIndexBuffer.items = new Uint16Array(__sphereData.vertexIndexData);

            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __sphereVertexIndexBuffer);
            _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, __sphereVertexIndexBuffer.items, _gl.STATIC_DRAW);


            // create the buffer for vertex positions indexes and assign it to that buffer to use for later
            __sphereVertexNormalBuffer = _gl.createBuffer();
            __sphereVertexNormalBuffer.itemSize = 3;
            __sphereVertexNormalBuffer.numItems = __sphereData.vertexNormals.length / __sphereVertexNormalBuffer.itemSize;
            __sphereVertexNormalBuffer.items = new Float32Array(__sphereData.vertexNormals);


            _gl.bindBuffer(_gl.ARRAY_BUFFER, __sphereVertexNormalBuffer);
            _gl.bufferData(_gl.ARRAY_BUFFER, __sphereVertexNormalBuffer.items, _gl.STATIC_DRAW);


        	}

        	function __draw() {

            if (__shouldUpdateMatrices) {
              mat4.multiply(__modelMatrix, __translationMatrix, __rotationMatrix);
          		mat4.multiply(__modelMatrix, __modelMatrix, __scaleMatrix);

              mat3.normalFromMat4(__normalMatrix, __modelMatrix);

              mat4.multiply(__PVMMatrix, _glProgram.customAttribs.viewMatrix, __modelMatrix);
              mat4.multiply(__PVMMatrix, _glProgram.customAttribs.perspectiveMatrix, __PVMMatrix);

              __shouldUpdateMatrices = false;
            }


            _gl.uniformMatrix3fv(_glProgram.customAttribs.u_NormalMatrixRef, false, __normalMatrix);
            _gl.uniformMatrix4fv(_glProgram.customAttribs.u_PVMMatrixRef, false, __PVMMatrix);


        		_gl.bindBuffer(_gl.ARRAY_BUFFER, __sphereVertexPositionBuffer);
            _gl.vertexAttribPointer(_glProgram.customAttribs.a_PositionRef, __sphereVertexPositionBuffer.itemSize, _gl.FLOAT, false, 0, 0);
            _gl.enableVertexAttribArray(_glProgram.customAttribs.a_PositionRef);


        		_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __sphereVertexIndexBuffer);


            _gl.bindBuffer(_gl.ARRAY_BUFFER, __sphereVertexNormalBuffer);
            _gl.vertexAttribPointer(_glProgram.customAttribs.a_VertexNormalRef, __sphereVertexNormalBuffer.itemSize, _gl.FLOAT, false, 0, 0);
            _gl.enableVertexAttribArray(_glProgram.customAttribs.a_VertexNormalRef);


        		_gl.uniform4f(_glProgram.customAttribs.u_FragColourRef, __colour.r, __colour.g, __colour.b, __colour.a);

        		_gl.drawElements(_gl.TRIANGLES, __sphereVertexIndexBuffer.numItems, _gl.UNSIGNED_SHORT, 0);

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

            __shouldUpdateMatrices = true;

        		return this;

        	}


        	function __scale(s) {
        		if (typeof s === 'number') {
        			mat4.scale(__scaleMatrix, __scaleMatrix, vec3.fromValues(s, s, s));
        		}

            __shouldUpdateMatrices = true;

        		return this;
        	}

        	function __translate(x, y, z) {

        		mat4.translate(__translationMatrix, __translationMatrix, vec3.fromValues(x, y, z));

            __shouldUpdateMatrices = true;

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
        		__quadVertexNormalBuffer = null,

        		__colour = {r: 1.0, g: 0.0, b: 1.0, a: 1.0},

        		__modelMatrix = mat4.create(),
        		__rotationMatrix = mat4.create(),
        		__translationMatrix = mat4.create(),
        		__scaleMatrix = mat4.create(),
            __PVMMatrix = mat4.create(),
            __normalMatrix = mat3.create(),
            __shouldUpdateMatrices = true;

        	function __init() {
        		__quadData = webGLDrawUtilities.createCubeVertexData(x, y, z);

        		// create the buffer for vertex positions and assign it to that buffer to use for later
        		__quadVertexPositionBuffer = _gl.createBuffer();
        		__quadVertexPositionBuffer.itemSize = 3;
        		__quadVertexPositionBuffer.numItems = __quadData.vertexPositionData.length / __quadVertexPositionBuffer.itemSize;
        		__quadVertexPositionBuffer.items = new Float32Array(__quadData.vertexPositionData);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, __quadVertexPositionBuffer);
            _gl.bufferData(_gl.ARRAY_BUFFER, __quadVertexPositionBuffer.items, _gl.STATIC_DRAW);

        		// create the buffer for vertex positions indexes and assign it to that buffer to use for later
        		__quadVertexIndexBuffer = _gl.createBuffer();
        		__quadVertexIndexBuffer.itemSize = 1;
        		__quadVertexIndexBuffer.numItems = __quadData.vertexIndexData.length;
        		__quadVertexIndexBuffer.items = new Uint16Array(__quadData.vertexIndexData);

            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __quadVertexIndexBuffer);
            _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, __quadVertexIndexBuffer.items, _gl.STATIC_DRAW);

            // create the buffer for vertex positions indexes and assign it to that buffer to use for later
            __quadVertexNormalBuffer = _gl.createBuffer();
            __quadVertexNormalBuffer.itemSize = 3;
            __quadVertexNormalBuffer.numItems = __quadData.vertexNormals.length / __quadVertexNormalBuffer.itemSize;
            __quadVertexNormalBuffer.items = new Float32Array(__quadData.vertexNormals);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, __quadVertexNormalBuffer);
            _gl.bufferData(_gl.ARRAY_BUFFER, __quadVertexNormalBuffer.items, _gl.STATIC_DRAW);


        	}

        	function __draw() {

            if (__shouldUpdateMatrices) {
              mat4.multiply(__modelMatrix, __translationMatrix, __rotationMatrix);
              mat4.multiply(__modelMatrix, __modelMatrix, __scaleMatrix);

              // calculate the inverse transformation that will remove caused by transforming the 3D surface
              mat3.normalFromMat4(__normalMatrix, __modelMatrix);

              mat4.multiply(__PVMMatrix, _glProgram.customAttribs.viewMatrix, __modelMatrix);
              mat4.multiply(__PVMMatrix, _glProgram.customAttribs.perspectiveMatrix, __PVMMatrix);

              __shouldUpdateMatrices = false;
          }

            _gl.uniformMatrix3fv(_glProgram.customAttribs.u_NormalMatrixRef, false, __normalMatrix);
            _gl.uniformMatrix4fv(_glProgram.customAttribs.u_PVMMatrixRef, false, __PVMMatrix);


            _gl.bindBuffer(_gl.ARRAY_BUFFER, __quadVertexPositionBuffer);
            _gl.vertexAttribPointer(_glProgram.customAttribs.a_PositionRef, __quadVertexPositionBuffer.itemSize, _gl.FLOAT, false, 0, 0);
            _gl.enableVertexAttribArray(_glProgram.customAttribs.a_PositionRef);


            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __quadVertexIndexBuffer);


            _gl.bindBuffer(_gl.ARRAY_BUFFER, __quadVertexNormalBuffer);
            _gl.vertexAttribPointer(_glProgram.customAttribs.a_VertexNormalRef, __quadVertexNormalBuffer.itemSize, _gl.FLOAT, false, 0, 0);
            _gl.enableVertexAttribArray(_glProgram.customAttribs.a_VertexNormalRef);


            _gl.uniform4f(_glProgram.customAttribs.u_FragColourRef, __colour.r, __colour.g, __colour.b, __colour.a);

            _gl.drawElements(_gl.TRIANGLES, __quadVertexIndexBuffer.numItems, _gl.UNSIGNED_SHORT, 0);

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

            __shouldUpdateMatrices = true;
        		return this;

        	}


        	function __scale(s) {
        		if (typeof s === 'number') {
        			mat4.scale(__scaleMatrix, __scaleMatrix, vec3.fromValues(s, s, s));
        		}
            __shouldUpdateMatrices = true;
        		return this;
        	}

        	function __translate(x, y, z) {

        		mat4.translate(__translationMatrix, __translationMatrix, vec3.fromValues(x, y, z));
            __shouldUpdateMatrices = true;
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
          		throw new Error('Could not run lightingExample() WebGL Demo!');
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
        	_glProgram = canvasModalWidget.setGLVertexAndFragmentShaders('#v-shader-demo6', '#f-shader-demo6');
        	_glProgram.customAttribs = {};


			// Get the storage locations of all the customizable shader variables
			_glProgram.customAttribs.a_PositionRef = _gl.getAttribLocation(_glProgram, 'a_Position'),
			_glProgram.customAttribs.a_VertexNormalRef = _gl.getAttribLocation(_glProgram, 'a_VertexNormal'),

			_glProgram.customAttribs.u_FragColourRef = _gl.getUniformLocation(_glProgram, 'u_FragColour'),
			_glProgram.customAttribs.u_PVMMatrixRef = _gl.getUniformLocation(_glProgram, 'u_PVMMatrix'),
      _glProgram.customAttribs.u_NormalMatrixRef = _gl.getUniformLocation(_glProgram, 'u_NormalMatrix'),


			_glProgram.customAttribs.u_AmbientColourRef = _gl.getUniformLocation(_glProgram, 'u_AmbientColour'),
			_glProgram.customAttribs.u_LightingDirectionRef = _gl.getUniformLocation(_glProgram, 'u_LightingDirection'),
			_glProgram.customAttribs.u_DirectionalColourRef = _gl.getUniformLocation(_glProgram, 'u_DirectionalColour');



			var perspectiveMatrix = mat4.create(), // get the identity matrix
				viewMatrix = mat4.create(),
				modelMatrix = mat4.create(),
				PVMMatrix = mat4.create();


			mat4.perspective(perspectiveMatrix, glMatrix.toRadian(45.0), canvasModalWidget.getGLViewportAspectRatio(), 1, 1000);
			mat4.lookAt(viewMatrix, vec3.fromValues(0, 0, 5), vec3.fromValues(0, 0, -50), vec3.fromValues(0, 1, 0));

			_glProgram.customAttribs.viewMatrix = viewMatrix;
			_glProgram.customAttribs.modelMatrix = modelMatrix;
      _glProgram.customAttribs.perspectiveMatrix = perspectiveMatrix;

      mat4.multiply(PVMMatrix, perspectiveMatrix, viewMatrix);

      _glProgram.customAttribs.PVMMatrix = PVMMatrix;

			_gl.uniformMatrix4fv(_glProgram.customAttribs.u_PVMMatrixRef, false, _glProgram.customAttribs.PVMMatrix);

      _glProgram.customAttribs.lightingDirection  = _setLightingDirection(-20.0, 0.0, 1.0);

			_gl.uniform3fv(_glProgram.customAttribs.u_LightingDirectionRef, _glProgram.customAttribs.lightingDirection);
			_gl.uniform3f(_glProgram.customAttribs.u_AmbientColourRef, 0.1, 0.1, 0.1);

			_gl.uniform3f(_glProgram.customAttribs.u_DirectionalColourRef, 1.0, 1.0, 1.0);





			// create some primitives that can keep track of their own orientation and draw themselves
			_sphere = new _Sphere();
			_sphere.translate(-1.6,0,0);

			_quad = new _Quad(2, 0.5, 0.5);
			_quad.translate(0, 0, -1);


			_tick();


      }

      function _setLightingDirection(x, y, z) {
        var n = vec3.create(),
            v = vec3.fromValues(x, y, z);

        vec3.normalize(n, v);
        //vec3.scale(n, n, -1.0);

        return n;
      }


    var _frameCount = 0,
   		_xInc = 0.01,
  	  	_yInc = 0.001,
  	  	_zInc = 0.005;

    function _tick() {

      	// Clear the color and depth buffer because now we are dealing with perspective and camera space.
      	// and we want everything to look natural...
        _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);

        vec3.rotateY(_glProgram.customAttribs.lightingDirection, _glProgram.customAttribs.lightingDirection, vec3.fromValues(0,0,0), glMatrix.toRadian(0.5));
        vec3.rotateZ(_glProgram.customAttribs.lightingDirection, _glProgram.customAttribs.lightingDirection, vec3.fromValues(0,0,0), glMatrix.toRadian(0.5));
        //console.log(vec3.str(_glProgram.customAttribs.lightingDirection))
        _gl.uniform3fv(_glProgram.customAttribs.u_LightingDirectionRef, _glProgram.customAttribs.lightingDirection);



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
	// Pong!!!
	///////////////////////////////////////////////////////////////////////////////////////////////////////////
  	function PongGLGame() {

      // get the gl context from our modal widget
      var _gl = null,
          _glProgram = null,
          _lastDrawTime = 0,
          _isAppRunning = true,
          _keyPressed = {};



        ///////////////////////////////////////////////////////////////////////////////////////////////////
        //  _Sphere(radius) Constructor method is used to represent and Sphere with a radius
        //  this sphere can draw itself and adjust its orientation on the canvas via the accessor methods.
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        function _Sphere(radius) {
          var __sphereData = null,
            __sphereVertexPositionBuffer = null,
            __sphereVertexIndexBuffer = null,
            __sphereVertexNormalBuffer = null,

            __colour = {r: 0.8, g: 0.8, b: 0.8, a: 1.0},
            __radius = radius || 1.0,
            __modelMatrix = mat4.create(),
            __rotationMatrix = mat4.create(),
            __translationMatrix = mat4.create(),
            __scaleMatrix = mat4.create(),
            __PVMMatrix = mat4.create(),
            __normalMatrix = mat3.create(),
            __shouldUpdateMatrices = true;

          function __init() {
            __sphereData = webGLDrawUtilities.createSphereVertexData(__radius);

            // create the buffer for vertex positions and assign it to that buffer to use for later
            __sphereVertexPositionBuffer = _gl.createBuffer();
            __sphereVertexPositionBuffer.itemSize = 3;
            __sphereVertexPositionBuffer.numItems = __sphereData.vertexPositionData.length / __sphereVertexPositionBuffer.itemSize;
            __sphereVertexPositionBuffer.items = new Float32Array(__sphereData.vertexPositionData);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, __sphereVertexPositionBuffer);
            _gl.bufferData(_gl.ARRAY_BUFFER, __sphereVertexPositionBuffer.items, _gl.STATIC_DRAW);

            // create the buffer for vertex positions indexes and assign it to that buffer to use for later
            __sphereVertexIndexBuffer = _gl.createBuffer();
            __sphereVertexIndexBuffer.itemSize = 1;
            __sphereVertexIndexBuffer.numItems = __sphereData.vertexIndexData.length;
            __sphereVertexIndexBuffer.items = new Uint16Array(__sphereData.vertexIndexData);

            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __sphereVertexIndexBuffer);
            _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, __sphereVertexIndexBuffer.items, _gl.STATIC_DRAW);


            // create the buffer for vertex positions indexes and assign it to that buffer to use for later
            __sphereVertexNormalBuffer = _gl.createBuffer();
            __sphereVertexNormalBuffer.itemSize = 3;
            __sphereVertexNormalBuffer.numItems = __sphereData.vertexNormals.length / __sphereVertexNormalBuffer.itemSize;
            __sphereVertexNormalBuffer.items = new Float32Array(__sphereData.vertexNormals);


            _gl.bindBuffer(_gl.ARRAY_BUFFER, __sphereVertexNormalBuffer);
            _gl.bufferData(_gl.ARRAY_BUFFER, __sphereVertexNormalBuffer.items, _gl.STATIC_DRAW);


          }

          function __draw() {


            mat4.multiply(__modelMatrix, __translationMatrix, __rotationMatrix);
            mat4.multiply(__modelMatrix, __modelMatrix, __scaleMatrix);

            mat3.normalFromMat4(__normalMatrix, __modelMatrix);

            mat4.multiply(__PVMMatrix, _glProgram.customAttribs.viewMatrix, __modelMatrix);
            mat4.multiply(__PVMMatrix, _glProgram.customAttribs.perspectiveMatrix, __PVMMatrix);




            _gl.uniformMatrix3fv(_glProgram.customAttribs.u_NormalMatrixRef, false, __normalMatrix);
            _gl.uniformMatrix4fv(_glProgram.customAttribs.u_PVMMatrixRef, false, __PVMMatrix);


            _gl.bindBuffer(_gl.ARRAY_BUFFER, __sphereVertexPositionBuffer);
            _gl.vertexAttribPointer(_glProgram.customAttribs.a_PositionRef, __sphereVertexPositionBuffer.itemSize, _gl.FLOAT, false, 0, 0);
            _gl.enableVertexAttribArray(_glProgram.customAttribs.a_PositionRef);


            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __sphereVertexIndexBuffer);


            _gl.bindBuffer(_gl.ARRAY_BUFFER, __sphereVertexNormalBuffer);
            _gl.vertexAttribPointer(_glProgram.customAttribs.a_VertexNormalRef, __sphereVertexNormalBuffer.itemSize, _gl.FLOAT, false, 0, 0);
            _gl.enableVertexAttribArray(_glProgram.customAttribs.a_VertexNormalRef);


            _gl.uniform4f(_glProgram.customAttribs.u_FragColourRef, __colour.r, __colour.g, __colour.b, __colour.a);

            _gl.drawElements(_gl.TRIANGLES, __sphereVertexIndexBuffer.numItems, _gl.UNSIGNED_SHORT, 0);

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

            __shouldUpdateMatrices = true;

            return this;

          }


          function __scale(s) {
            if (typeof s === 'number') {
              mat4.scale(__scaleMatrix, __scaleMatrix, vec3.fromValues(s, s, s));
            }

            __shouldUpdateMatrices = true;

            return this;
          }

          function __translate(x, y, z) {

            mat4.translate(__translationMatrix, __translationMatrix, vec3.fromValues(x, y, z));

            __shouldUpdateMatrices = true;

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

            return this;
          };

          this.getRadius = function() {
            return __radius;
          };


          return this;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //  _Quad(x, y, z) Constructor method is used to represent and Quadrilateral (rectangle) with
        //  width, height and depth (x, y ,z) dimensions respectively.ß
        //  This quadrilateral can draw itself and adjust its orientation on the canvas via the accessor methods.
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function _Quad(x, y, z) {

          var __quadData = null,
            __quadVertexPositionBuffer = null,
            __quadVertexIndexBuffer = null,
            __quadVertexNormalBuffer = null,

            __colour = {r: 1.0, g: 0.0, b: 1.0, a: 1.0},

            __modelMatrix = mat4.create(),
            __rotationMatrix = mat4.create(),
            __translationMatrix = mat4.create(),
            __scaleMatrix = mat4.create(),
            __PVMMatrix = mat4.create(),
            __normalMatrix = mat3.create(),
            __shouldUpdateMatrices = true;

          function __init() {
            __quadData = webGLDrawUtilities.createCubeVertexData(x, y, z);

            // create the buffer for vertex positions and assign it to that buffer to use for later
            __quadVertexPositionBuffer = _gl.createBuffer();
            __quadVertexPositionBuffer.itemSize = 3;
            __quadVertexPositionBuffer.numItems = __quadData.vertexPositionData.length / __quadVertexPositionBuffer.itemSize;
            __quadVertexPositionBuffer.items = new Float32Array(__quadData.vertexPositionData);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, __quadVertexPositionBuffer);
            _gl.bufferData(_gl.ARRAY_BUFFER, __quadVertexPositionBuffer.items, _gl.STATIC_DRAW);

            // create the buffer for vertex positions indexes and assign it to that buffer to use for later
            __quadVertexIndexBuffer = _gl.createBuffer();
            __quadVertexIndexBuffer.itemSize = 1;
            __quadVertexIndexBuffer.numItems = __quadData.vertexIndexData.length;
            __quadVertexIndexBuffer.items = new Uint16Array(__quadData.vertexIndexData);

            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __quadVertexIndexBuffer);
            _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, __quadVertexIndexBuffer.items, _gl.STATIC_DRAW);

            // create the buffer for vertex positions indexes and assign it to that buffer to use for later
            __quadVertexNormalBuffer = _gl.createBuffer();
            __quadVertexNormalBuffer.itemSize = 3;
            __quadVertexNormalBuffer.numItems = __quadData.vertexNormals.length / __quadVertexNormalBuffer.itemSize;
            __quadVertexNormalBuffer.items = new Float32Array(__quadData.vertexNormals);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, __quadVertexNormalBuffer);
            _gl.bufferData(_gl.ARRAY_BUFFER, __quadVertexNormalBuffer.items, _gl.STATIC_DRAW);


          }

          function __draw() {


            mat4.multiply(__modelMatrix, __translationMatrix, __rotationMatrix);
            mat4.multiply(__modelMatrix, __modelMatrix, __scaleMatrix);

            // calculate the inverse transformation that will remove caused by transforming the 3D surface
            mat3.normalFromMat4(__normalMatrix, __modelMatrix);

            mat4.multiply(__PVMMatrix, _glProgram.customAttribs.viewMatrix, __modelMatrix);
            mat4.multiply(__PVMMatrix, _glProgram.customAttribs.perspectiveMatrix, __PVMMatrix);

            __shouldUpdateMatrices = false;


            _gl.uniformMatrix3fv(_glProgram.customAttribs.u_NormalMatrixRef, false, __normalMatrix);
            _gl.uniformMatrix4fv(_glProgram.customAttribs.u_PVMMatrixRef, false, __PVMMatrix);


            _gl.bindBuffer(_gl.ARRAY_BUFFER, __quadVertexPositionBuffer);
            _gl.vertexAttribPointer(_glProgram.customAttribs.a_PositionRef, __quadVertexPositionBuffer.itemSize, _gl.FLOAT, false, 0, 0);
            _gl.enableVertexAttribArray(_glProgram.customAttribs.a_PositionRef);


            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __quadVertexIndexBuffer);


            _gl.bindBuffer(_gl.ARRAY_BUFFER, __quadVertexNormalBuffer);
            _gl.vertexAttribPointer(_glProgram.customAttribs.a_VertexNormalRef, __quadVertexNormalBuffer.itemSize, _gl.FLOAT, false, 0, 0);
            _gl.enableVertexAttribArray(_glProgram.customAttribs.a_VertexNormalRef);


            _gl.uniform4f(_glProgram.customAttribs.u_FragColourRef, __colour.r, __colour.g, __colour.b, __colour.a);

            _gl.drawElements(_gl.TRIANGLES, __quadVertexIndexBuffer.numItems, _gl.UNSIGNED_SHORT, 0);

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

            __shouldUpdateMatrices = true;
            return this;

          }


          function __scale(s) {
            if (typeof s === 'number') {
              mat4.scale(__scaleMatrix, __scaleMatrix, vec3.fromValues(s, s, s));
            }
            __shouldUpdateMatrices = true;
            return this;
          }

          function __translate(x, y, z) {

            mat4.translate(__translationMatrix, __translationMatrix, vec3.fromValues(x, y, z));
            __shouldUpdateMatrices = true;
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

            return this;
          };




          return this;


        }


    //////////
    function _bindKeyEvents() {
      var KEY_PRESS_EVENT = 'keypress.pong3D',
          _window = $(window);

      _window
        .on(KEY_PRESS_EVENT, function(event) {
          event.stopPropagation();
          _keyPressed[event.which] = true;


          //console.log(event);

      });

      canvasModalWidget.onHide(function() {
        _isAppRunning = false;
        _window.unbind(KEY_PRESS_EVENT);
        //console.log('cancel request animation');
      });


  }


    ///////////////////////
    function _init() {

      var glCanvas  = webGLUtilities;

      _gl = canvasModalWidget.getGLContext();

      if (! _gl) {
              throw new Error('Could not run lightingExample() WebGL Demo!');
          }





       // Set clear color to black, fully opaque
          _gl.clearColor(0.0, 0.0, 0.0, 1.0);

          // dealing with 3D space geometry so make sure this feature is enabled
          _gl.enable(_gl.DEPTH_TEST);

      // get the shaders and compile them - the resultant will be a program that is automatically joined to the gl context in the background
          _glProgram = canvasModalWidget.setGLVertexAndFragmentShaders('#v-shader-demo6', '#f-shader-demo6');
          _glProgram.customAttribs = {};


      // Get the storage locations of all the customizable shader variables
      _glProgram.customAttribs.a_PositionRef = _gl.getAttribLocation(_glProgram, 'a_Position'),
      _glProgram.customAttribs.a_VertexNormalRef = _gl.getAttribLocation(_glProgram, 'a_VertexNormal'),

      _glProgram.customAttribs.u_FragColourRef = _gl.getUniformLocation(_glProgram, 'u_FragColour'),
      _glProgram.customAttribs.u_PVMMatrixRef = _gl.getUniformLocation(_glProgram, 'u_PVMMatrix'),
      _glProgram.customAttribs.u_NormalMatrixRef = _gl.getUniformLocation(_glProgram, 'u_NormalMatrix'),


      _glProgram.customAttribs.u_AmbientColourRef = _gl.getUniformLocation(_glProgram, 'u_AmbientColour'),
      _glProgram.customAttribs.u_LightingDirectionRef = _gl.getUniformLocation(_glProgram, 'u_LightingDirection'),
      _glProgram.customAttribs.u_DirectionalColourRef = _gl.getUniformLocation(_glProgram, 'u_DirectionalColour');


      _glProgram.customAttribs.eyePosition = vec3.fromValues(0, 0, 5);
      _glProgram.customAttribs.centerPoint = vec3.fromValues(0, 0, -50);


      var perspectiveMatrix = mat4.create(), // get the identity matrix
        viewMatrix = mat4.create(),
        modelMatrix = mat4.create(),
        PVMMatrix = mat4.create();


      mat4.perspective(perspectiveMatrix, glMatrix.toRadian(45.0), canvasModalWidget.getGLViewportAspectRatio(), 1, 1000);
      mat4.lookAt(viewMatrix, _glProgram.customAttribs.eyePosition, _glProgram.customAttribs.centerPoint, vec3.fromValues(0, 1, 0));

      _glProgram.customAttribs.viewMatrix = viewMatrix;
      _glProgram.customAttribs.modelMatrix = modelMatrix;
      _glProgram.customAttribs.perspectiveMatrix = perspectiveMatrix;

      mat4.multiply(PVMMatrix, perspectiveMatrix, viewMatrix);

      _glProgram.customAttribs.PVMMatrix = PVMMatrix;

      _gl.uniformMatrix4fv(_glProgram.customAttribs.u_PVMMatrixRef, false, _glProgram.customAttribs.PVMMatrix);

      _glProgram.customAttribs.lightingDirection  = _setLightingDirection(-20.0, 10.0, 1.0);

      _gl.uniform3fv(_glProgram.customAttribs.u_LightingDirectionRef, _glProgram.customAttribs.lightingDirection);
      _gl.uniform3f(_glProgram.customAttribs.u_AmbientColourRef, 0.5, 0.5, 0.5);

      _gl.uniform3f(_glProgram.customAttribs.u_DirectionalColourRef, 1.0, 1.0, 1.0);





      _initGame();


      //_tick();


      }

      function _setLightingDirection(x, y, z) {
        var n = vec3.create(),
            v = vec3.fromValues(x, y, z);

        vec3.normalize(n, v);
        //vec3.scale(n, n, -1.0);

        return n;
      }

      ///////////////////////////////////////////////////////////////////////
      function _Player(tx, ty, tz, playerType) {
        var __paddle = null,
            __score = 0,
            __playerType = playerType === _Player.prototype.PLAYER_TYPE.HUMAN ? playerType : _Player.prototype.PLAYER_TYPE.ROBOT,
            __playerPosition = {x: (tx || 0.0), y: (ty || 0.0), z: (tz || 0.0)};


        function __init() {
          var paddleDimensions = {x: 0.5, y: 0.05, z: 0.1}
          __paddle = new _Quad(paddleDimensions.x, paddleDimensions.y, paddleDimensions.z);
          __paddle.translate(__playerPosition.x, __playerPosition.y, __playerPosition.z);
        }


        function __draw(tickMS) {
          __paddle.draw();
        }


        __init();

        this.getScore = function() {
          return __score;
        }


        this.draw = __draw;

        this.setColour = function(r, g, b) {
          __paddle.setColour(r, g, b, 1);
          return this;
        };


        return this;

      }

      _Player.prototype.PLAYER_TYPE = {ROBOT: 0, HUMAN: 1};


      ////////////////////////////////
      function _Ball(tx, ty, tz) {
        var   __ball = null,
              __ballPosition = {x: (tx || 0.0), y: (ty || 0.0), z: (tz || 0.0)};


        function __init() {
          __ball = new _Sphere(0.1);
          __ball.translate(__ballPosition.x, __ballPosition.y, __ballPosition.z);
        }

        function __draw(tickMS) {
          __ball.draw();
        }

        __init();

        this.draw = __draw;


        return this;
      }


      function _Map() {
        var __leftWall = null,
            __rightWall = null;

        function __init() {
          var wallDimensions = {x: 0.05, y: 2, z: 0.1},
              wallColour = {r:0.4, g:0.4, b:0.5},
              translate = {x: 2.6, y: 0, z: 0};


          __leftWall = new _Quad(wallDimensions.x, wallDimensions.y, wallDimensions.z);
          __leftWall
            .setColour(wallColour.r, wallColour.g , wallColour.b, 1)
            .translate(-translate.x, translate.y, translate.z);

         __rightWall = new _Quad(wallDimensions.x, wallDimensions.y, wallDimensions.z);
         __rightWall
            .setColour(wallColour.r, wallColour.g , wallColour.b, 1)
            .translate(translate.x, translate.y, translate.z);
        }

        function __draw(tickMS) {
          __leftWall.draw();
          __rightWall.draw();
        }

        function __start() {

        }


        __init();

        this.draw = __draw;
        this.start = __start;

        return this;
      }




      var _GAME_STATES = {RUNNING: 0, PAUSED: 1, INTRO_SCREEN: 2},
          _game = {ball: null, isRunning: true, players: [], map: null, status: _GAME_STATES.INTRO_SCREEN};



      function _initGame() {

        var playerPosition = {x: 0.0, y: -1.9, z: 0.0};

        _game.map = new _Map();

        _game.ball = new _Ball();

        _game.players.push(new _Player(playerPosition.x, playerPosition.y, playerPosition.z,  _Player.prototype.PLAYER_TYPE.HUMAN).setColour(0,0,1));
        _game.players.push(new _Player(playerPosition.x, -playerPosition.y, playerPosition.z,  _Player.prototype.PLAYER_TYPE.ROBOT).setColour(0,1,0));

        _bindKeyEvents();

        _tick();
      }



      function _rotateMap(rotationX, rotationY) {

        var viewMatrix = mat4.create();


        if (rotationX) {
          var rotationInRadsX = glMatrix.toRadian(rotationX);
          vec3.rotateX(_glProgram.customAttribs.eyePosition, _glProgram.customAttribs.eyePosition, vec3.fromValues(0,0,0), rotationInRadsX);
          vec3.rotateX(_glProgram.customAttribs.centerPoint, _glProgram.customAttribs.centerPoint, vec3.fromValues(0,0,0), rotationInRadsX);
        }

        if (rotationY) {
          var rotationInRadsY = glMatrix.toRadian(rotationY);
          vec3.rotateY(_glProgram.customAttribs.eyePosition, _glProgram.customAttribs.eyePosition, vec3.fromValues(0,0,0), rotationInRadsY);
          vec3.rotateY(_glProgram.customAttribs.centerPoint, _glProgram.customAttribs.centerPoint, vec3.fromValues(0,0,0), rotationInRadsY);
        }


        mat4.lookAt(viewMatrix, _glProgram.customAttribs.eyePosition, _glProgram.customAttribs.centerPoint, vec3.fromValues(0, 1, 0));
        _glProgram.customAttribs.viewMatrix = viewMatrix;

      }


    function _processInput() {
      var degreeInc = 2.0;
      //console.log(_keyPressed);
      for (var keyCode in _keyPressed) {

        if (! _keyPressed[keyCode]) {
          continue;
        }

        var key = parseInt(keyCode);


        switch(key) {
          case 87: // rotate up
          case 119:
            _rotateMap(degreeInc);
          break;

          case 83:  // rotate down
          case 115:
            _rotateMap(-degreeInc);
          break;

          case 65: // rotate left
          case 97:
            _rotateMap(null, degreeInc);
          break;

          case 68: // rotate right
          case 100:
            _rotateMap(null, -degreeInc);
          break;
          default:
            console.log('Did not recognize key with code: ' + keyCode)
          break;
        }

        _keyPressed[keyCode] = false;

      }
    }


    function _tick() {

        // Clear the color and depth buffer because now we are dealing with perspective and camera space.
        // and we want everything to look natural...
        _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);

        //vec3.rotateY(_glProgram.customAttribs.lightingDirection, _glProgram.customAttribs.lightingDirection, vec3.fromValues(0,0,0), glMatrix.toRadian(0.5));
        //vec3.rotateZ(_glProgram.customAttribs.lightingDirection, _glProgram.customAttribs.lightingDirection, vec3.fromValues(0,0,0), glMatrix.toRadian(0.5));
        //console.log(vec3.str(_glProgram.customAttribs.lightingDirection))
        //_gl.uniform3fv(_glProgram.customAttribs.u_LightingDirectionRef, _glProgram.customAttribs.lightingDirection);

        _processInput();

        _game.map.draw();
        _game.ball.draw();

        for (var i = 0; i < _game.players.length; i++) {
          var player = _game.players[i];
          player.draw();
        }


        // stop calling the browser's animate when ready callback function when the modal has closed
        if (_isAppRunning) {
          requestAnimationFrame(_tick);
        }
    }




     // start this demo up!
  _init();


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
	          screenShotURL: 'styles/app/images/demo6.png'
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