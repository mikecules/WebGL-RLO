'use strict';

var $demos = $demos || {};

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Demo 6: Uses Lambert Shading to make our 3D objects from demo 5 look more realistic. Note that
// the resultant shading is not as accurate had we done this in the fragment shader.
///////////////////////////////////////////////////////////////////////////////////////////////////////////

$demos.lightingExample = function lightingExample(canvasModalWidget, webGLDrawUtilities) {
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
        		// Up the number of vertices so the lighting artifacts caused by shading at the vertex are reduced -
        		// this is way fragment level lighting is desired even though it's more GPU intensive
        		__sphereData = webGLDrawUtilities.createSphereVertexData(__radius, 60, 60);

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

            // calculate the perspective matrix
			mat4.perspective(perspectiveMatrix, glMatrix.toRadian(45.0), canvasModalWidget.getGLViewportAspectRatio(), 1, 1000);
			
            // calculate the view matrix (camera view)
            mat4.lookAt(viewMatrix, vec3.fromValues(0, 0, 5), vec3.fromValues(0, 0, -50), vec3.fromValues(0, 1, 0));

			_glProgram.customAttribs.viewMatrix = viewMatrix;
			_glProgram.customAttribs.modelMatrix = modelMatrix;
            _glProgram.customAttribs.perspectiveMatrix = perspectiveMatrix;

            mat4.multiply(PVMMatrix, perspectiveMatrix, viewMatrix);

            _glProgram.customAttribs.PVMMatrix = PVMMatrix;

            // optimization: we are now only passing one multiplied matrix into our vertex shader rather than
            // doing the multiplications 3 times for each vertex triplet
			_gl.uniformMatrix4fv(_glProgram.customAttribs.u_PVMMatrixRef, false, _glProgram.customAttribs.PVMMatrix);

            // set our directional light
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