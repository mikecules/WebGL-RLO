// Declare app level module which depends on views, and components
angular.module('WebGLRLOApp')  
  .controller('WebGLMainController', ['$scope', 'webGLUtilities', function($scope, webGLUtilities) {
    console.log('Main Controller Instantiated!');
    webGLUtilities.initCanvasModalWidget('canvas-modal-widget');
      var canvasModalWidget = webGLUtilities.getCanvasModalWidget();

      var demos = [
        {
          caption: 'Draw Fixed Point Example',
          details: 'Draw a 30 pixel dimensioned point on screen...',
          appFn: drawPointExample,
          screenShotURL: 'styles/app/images/demo1.png'
        },
        {
          caption: 'Free Draw Example',
          details: 'Freeform draw large pixels on screen...',
          appFn: drawSimpleShapeWithMouseExample,
          screenShotURL: 'styles/app/images/demo2.png'
        },
         {
          caption: 'Draw Modes and Translations Example',
          details: 'Draw some trinagles using different draw modes and do uniform translations to position 1 shape 3 different ways.',
          appFn: shapesExample,
          screenShotURL: 'styles/app/images/demo3.png'
        },
         {
          caption: 'Fragment Shader Interpolation Example',
          details: ' ',
          appFn: shapesFragmentVaryingExample,
          screenShotURL: 'styles/app/images/demo3.png'
        }
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





      







      // Only continue if WebGL is available and working

      function _DemoRunner() {

        this.run = function(index) {

          var demoObject = demos[index];

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