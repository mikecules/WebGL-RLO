'use strict';

angular.module('webGLUtilityModule', [])
  .service('webGLUtilities', [function() {


    function _Canvas(id, type) {
      var __context = null,
          __canvasEl = null,
          __canvasJQObj = null,
          __canvasID = id,
          __canvasType = ((type === _Canvas.prototype.CANVAS_TYPES.CANVAS_3D) ? _Canvas.prototype.CANVAS_TYPES.CANVAS_3D : _Canvas.prototype.CANVAS_TYPES.CANVAS_2D),
          __height = 480,
          __width = 640,
          __viewportNeedsUpdate = true;


      function __initCanvas() {
        __canvasJQObj = $('<canvas id="' + __canvasID +  '"></canvas>');

        if (! __canvasJQObj.length) {
          throw new Error('Unable to create canvas with ID "' + __canvasID + '"!');
        }

        __canvasEl = __canvasJQObj[0];

        __setHeight(__height);
        __setWidth(__width);

        __initContext();
        __updateViewportSize();


      }


      function __initContext() {

        __context = null;

        switch(__canvasType) {

          case _Canvas.prototype.CANVAS_TYPES.CANVAS_3D:
            try {
              // Try to grab the standard context. If it fails, fallback to experimental.
              __context = __canvasEl.getContext(__canvasType) || __canvasEl.getContext('experimental-webgl');
            }
            catch(e) {
              throw new Error(e);
            }
          break;

          default:
            try {
              // Try to grab the standard context. If it fails, fallback to experimental.
              __context = __canvasEl.getContext(__canvasType);
            }
            catch(e) {
              throw new Error(e);
            }
          break;

        }

        // If we don't have a context, give up now
        if (! __context) {
          throw new Error('Unable to initialize canvas context. Your browser may not support it.');
          __context = null;
        }

        console.log('Canvas Context: ', __context);
      }

      function __setHeight(h) {
        __height = h;
        __viewportNeedsUpdate = true;
        __canvasJQObj.height(h);
      }

      function __setWidth(w) {
        __width = w;
        __viewportNeedsUpdate = true;
        __canvasJQObj.width(w);
      }

      function __updateViewportSize() {
        if (__canvasType === _Canvas.prototype.CANVAS_TYPES.CANVAS_3D && __context && __viewportNeedsUpdate) {
          __context.viewport(0, 0, __width, __height);
          __viewportNeedsUpdate = false;
        }
      }

      // run initializer for the object
      __initCanvas(id);

      // public accessors for _Canvas
      this.getCanvasEl = function() {
        return __canvasEl;
      };

      this.getCanvasJQObj = function() {
        return __canvasJQObj;
      };

      this.getContext = function() {
        return __context;
      };

      this.updateViewportSize = __updateViewportSize;


      this.destroy = function() {
        if (__canvasJQObj !== null && __canvasJQObj.length) {
          __canvasJQObj.remove();

          __canvasJQObj = null;
          __canvasEl = null;
        }
      };

      return this;
    }

    // Set the canvas prototype with shared code
    _Canvas.prototype = {
      CANVAS_TYPES: {
        CANVAS_2D: '2d',
        CANVAS_3D: 'webgl'
      },
      constructor: _Canvas
    };
    ///////////////////




    function _CanvasModalWidget(id, anchorPoint) {

      var _modalJQObj =  null,
          _modalBox = null,
          _modalID = id,
          _modalHeight = 0,
          _modalWidth = 0,
          _isModalShowing = false,
          _canvas2D = null,
          _canvas3D = null,
          _modalCaptionElement = null,
          _modalBody = null,
          _modalDetailBody = null;


      function __addCanvas(id, type) {
        var canvas = new _Canvas(id, type);

        if (! canvas.getCanvasEl()) {
          return null;
        }

        return canvas;
      }

      function __initCanvasWidget() {
        var modalCanvasContainer =  _modalID + '-canvas-box';

        if (_modalJQObj === null) {

          _modalJQObj = $(
            '<div id="' + _modalID + '-container">' +
              '<div class="modal-container-bg"></div>' +
              '<div id="' + modalCanvasContainer + '">' +
                '<div class="modal-content-container">' +
                  '<div class="modal-caption-body">' +

                      //'<i class="fa fa-question-circle question-icon"></i>' +
                      '<div class="modal-caption"></div>' +
                      '<i class="fa fa-times close-icon"></i>' +
                  '</div>' +
                  '<div class="modal-body"></div>' +
                  '<div class="modal-detail-body"></div>' +
                '</div>' +
              '</div>' +
            '</div>'
            );


          if (! _modalJQObj.length) {
            throw new Error('Could not create modal used for the canvas!');
          }

          $(anchorPoint || 'body').prepend(_modalJQObj.addClass('modal-container'));


         _modalBox = $('#' + modalCanvasContainer);
         _modalCaptionElement = _modalBox.find('.modal-caption');
         _modalBody = _modalBox.find('.modal-body');
         _modalDetailBody = _modalBox.find('.modal-detail-body');

         _modalBox.find('.close-icon').click(__hide);
         _modalBox.click(function(e) { e.stopPropagation(); })
         _modalJQObj.click(__hide);


         _modalBox.addClass('modal-box');

         if (! _modalBox.length) {
           throw new Error('Could not create modal box used for the canvas!');
         }

       }



      }

      function __initCanvases() {
        _canvas2D = __addCanvas('hud-canvas', _Canvas.prototype.CANVAS_TYPES.CANVAS_2D);
        _canvas3D = __addCanvas('gl-canvas', _Canvas.prototype.CANVAS_TYPES.CANVAS_3D);


        if (_canvas2D && _canvas3D) {
          _modalBody
            .append(_canvas2D.getCanvasJQObj().addClass('canvas canvas-hud').css({zIndex: 1}))
            .append(_canvas3D.getCanvasJQObj().addClass('canvas canvas-gl'));
        }

        console.log(_canvas2D, _canvas3D);

      }

      function __resetCanvasWidget() {
        if (_canvas2D) {
          _canvas2D.destroy();
        }

        if (_canvas3D) {
          _canvas3D.destroy();
        }

        __initCanvases();

        return true;
      }

      function __show(callback) {
        var callbackFn = typeof callback === 'function' ? callback : function(){};

        _modalJQObj.show();

        _modalBox.show('fast', function() {
          __resetCanvasWidget();
          callbackFn.call(this);
        });


        return this;
      }

      function __hide(callback) {
        var callbackFn = typeof callback === 'function' ? callback : function(){};

        _modalBox.hide('fast', function() {
          _modalJQObj.hide();
            callbackFn.apply(this);
        });

        return this;

      }


      // Publically accessible Canvas Modal API
      this.show = __show;

      this.hide = __hide;

      this.setWidth = function(width) {
        return this;
      };

      this.isHidden = function() {
        return _isModalShowing;
      };

      this.getHUDContext = function() {
        return _canvas2D.getContext();
      };

      this.getGLContext = function() {
        return _canvas3D.getContext();
      };

      this.setCaption = function(caption) {
        _modalCaptionElement.text(caption);
      };

      this.setDetailText = function(details) {
        _modalDetailBody.text(details);
      };


      // initialize the Canvas Widget
      __initCanvasWidget();

      // Canvas Widget Public API
      this.resetCanvasWidget = __resetCanvasWidget;





      return this;

    };


    function _initCanvasModalWidget(id) {
      var canvasID = (typeof id === 'string' && id.length) ? id : 'canvas-modal-container';
      _canvasModalWidget = new _CanvasModalWidget(canvasID);
    }


    var _canvasModalWidget = null;

    this.initCanvasModalWidget = _initCanvasModalWidget;


    this.getCanvasModalWidget = function() {
      return _canvasModalWidget;
    };

    return this;
  }]);
