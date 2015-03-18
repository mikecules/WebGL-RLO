angular.module('webGLUtilityModule', [])
  .service('webGLUtilities', [function() {
    return this;
  }])
  .directive('webGlStage', ['webGLUtilities', function(webGLUtilities) {

    function linkFn(scope, element, attrs) {

    }

    return {
      restrict: 'A',
      scope: {
        options: '=webGlStage'
      },
      link: linkFn
    };

  }]);
