'use strict';

// Declare app level module which depends on views, and components
angular.module('WebGLRLOApp', [/*'ngAria', 'ngTouch', */ 'webGLUtilityModule'])
  .config(function ($compileProvider) {
    //We don't need routing, because the ng-controller will load automagically
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|javascript):/);
  });
