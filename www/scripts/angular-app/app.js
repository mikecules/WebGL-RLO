'use strict';

// Declare app level module which depends on views, and components
angular.module('WebGLRLOApp', ['ngAria', 'ngTouch', 'webGLUtilityModule'])
  .config(function ($compileProvider) {
    //We don't need routing, because the ng-controller will load automagically
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|javascript):/);
  })
  .controller('WebGLMainController', ['$scope', 'webGLUtilities', function($scope, webGLUtilities) {
    console.log('Main Controller Instantiated!');
    webGLUtilities.initCanvasModalWidget('canvas-modal-widget');
      var canvasModalWidget = webGLUtilities.getCanvasModalWidget();

      function _DemoRunner() {

        var __demos = [
          {
            caption: 'Draw Point Example',
            details: 'Draw a 30 pixel dimensioned point on screen...',
            appFn: drawPointExample
          }
        ];


        this.run = function(index) {

          var demoObject = __demos[index];

          if (typeof demoObject === 'undefined') {
            throw new Error('Could not find the demo app you were refering too...');
          }

          canvasModalWidget.setCaption(demoObject.caption || null);
          canvasModalWidget.setDetailText(demoObject.details || null);
          canvasModalWidget.show(demoObject.appFn);

        };



        return this;
      }





      function drawPointExample() {
          var gl = canvasModalWidget.getGLContext();

          if (! gl) {
            throw new Error('Could not run drawPointExample() WebGL Demo!');
          }


          var program = canvasModalWidget.setGLVertexAndFragmentShaders('#v-shader-demo1', '#f-shader-demo1');




          // create vertex data and the buffer (bind them!)
          var vertices = new Float32Array([
              0.0, 0.0, 0.0, // x , y, z coordinatates
              1.0, 0.0, 0.0,
              0.0, 1.0, 0.0,
              1.0, 1.0, 0.0,
             -1.0, 0.0, 0.0,
             -1.0,-1.0, 0.0,
             -1.0, 1.0, 0.0,
              1.0,-1.0, 0.0,
              0.0, -1.0, 0.0
            ]);

          var NUM_OF_COORDS = 3,
              vertexBuffer = gl.createBuffer();


          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

          // Bind the position to the first attribute in the program
          gl.bindAttribLocation(program, 0, 'a_Position');

          // Assign the pointer
          gl.vertexAttribPointer(0, NUM_OF_COORDS, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(0);


          // Set clear color to black, fully opaque
          gl.clearColor(0.0, 0.0, 0.0, 1.0);

          // Clear the color buffer.
          gl.clear(gl.COLOR_BUFFER_BIT);

          // draw the point
          gl.drawArrays(gl.POINTS, 0, vertices.length / NUM_OF_COORDS);

      }









      $scope.demoRunner = new _DemoRunner();







      // Only continue if WebGL is available and working


  }]);
