'use strict';

// Declare app level module which depends on views, and components
angular.module('WebGLRLOApp', ['ngAria', 'ngTouch', 'webGLUtilityModule'])
.controller('WebGLMainController', ['$scope', 'webGLUtilities', function($scope, webGLUtilities) {
  console.log('Main Controller Instantiated!');
  webGLUtilities.initCanvasModalWidget('canvas-modal-widget');
  var canvasModalWidget = webGLUtilities.getCanvasModalWidget();

  canvasModalWidget.setCaption('Mikey!!!');

  var HUDContext = canvasModalWidget.getHUDContext(),
      glContext = canvasModalWidget.getGLContext();



    // Only continue if WebGL is available and working

    if (glContext) {
      glContext.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
      glContext.enable(glContext.DEPTH_TEST);                               // Enable depth testing
      glContext.depthFunc(glContext.LEQUAL);                                // Near things obscure far things
      glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
    }
}]);
