'use strict';

// Declare app level module which depends on views, and components
// @author: Michael Moncada <michael.moncada@gmail.com>
angular.module('WebGLRLOApp', ['webGLUtilityModule'])
  .config(function ($compileProvider) {
    //We don't need routing, because the ng-controller will load automagically
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|javascript):/);
  })
  .run(function() {
  	
  	var _navContainer = $('#nav'),
  		_window = $(window),
  		_html = $('html');

  	_window
  		.on('resize.win', function(e){
  			
  			setTimeout(function() {

  				if (_html.hasClass('mobile') || _html.hasClass('narrower')) {
  					_navContainer.height('');
  					return;
  				}
  				//console.log(e);
  				var windowHeight = _window.height(),
  				logoContainerHeight = $('#logo').outerHeight(),
  				bottonHeight = $('.bottom').outerHeight();

  				_navContainer.height(windowHeight - logoContainerHeight - bottonHeight - 100);
  			}, 100);
  			
  		});

});