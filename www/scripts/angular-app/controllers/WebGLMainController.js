// Declare app level module which depends on views, and components
angular.module('WebGLRLOApp')  
  .controller('WebGLMainController', ['$scope', 'webGLUtilities', 'webGLDrawUtilities', function($scope, webGLUtilities, webGLDrawUtilities) {
    console.log('Main Controller Instantiated!');
    webGLUtilities.initCanvasModalWidget('canvas-modal-widget');
      var canvasModalWidget = webGLUtilities.getCanvasModalWidget();

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
	          screenShotURL: 'styles/app/images/demo4.png'
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

        //a();


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





        function _drawPointGrid() {



          return;
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);





          // Draw the points
          gl.drawArrays(gl.POINTS, 0, vertices.length / NUM_OF_COORDS);

        }

        function _init() {
          // Set clear color to black, fully opaque
          gl.clearColor(0.0, 0.0, 0.0, 1.0);



          // Clear the color buffer.
          gl.clear(gl.COLOR_BUFFER_BIT);
          _drawPointGrid();
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

	function animating3DPrimativesExample() {

	}



  	function lightingExample() {

	}
	
      	
  	function PongGLGame() {

  	}
      







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