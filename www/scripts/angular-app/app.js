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
            caption: 'Clear Screen Example',
            details: 'Clears the screen with a black colour...',
            appFn: clearScreenExample
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





      function clearScreenExample() {
          var HUDContext = canvasModalWidget.getHUDContext(),
              glContext = canvasModalWidget.getGLContext();

          if (glContext) {
            glContext.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
            glContext.enable(glContext.DEPTH_TEST);                               // Enable depth testing
            glContext.depthFunc(glContext.LEQUAL);                                // Near things obscure far things
            glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
          }

          canvasModalWidget.setCaption('Clear Screen Example');
          canvasModalWidget.setDetailText('Clears the screen with a black colour...');
      }









      $scope.demoRunner = new _DemoRunner();







      // Only continue if WebGL is available and working


  }]);
