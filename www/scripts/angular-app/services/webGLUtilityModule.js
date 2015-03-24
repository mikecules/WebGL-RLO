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
          __viewportAspectRatio = 0.0,
          __viewportNeedsUpdate = true,
          __glProgram = null,
          __shaders = {};


      function __initProgram() {
          if (__context === null || __canvasType !== _Canvas.prototype.CANVAS_TYPES.CANVAS_3D) {
            return;
          }

          // create a program.
          __glProgram = __context.createProgram();

           // attach the shaders.
           var  vertexShaderResource = __shaders[_Canvas.prototype.SHADER_TYPES.VERTEX].resource,
                fragmentShaderResource = __shaders[_Canvas.prototype.SHADER_TYPES.FRAGMENT].resource;

           if (vertexShaderResource) {
            __context.attachShader(__glProgram, vertexShaderResource);
           }

           if (fragmentShaderResource) {
            __context.attachShader(__glProgram, fragmentShaderResource);
           }


           // link the program.
           __context.linkProgram(__glProgram);

           // Check if it linked.
           var success = __context.getProgramParameter(__glProgram, __context.LINK_STATUS);

           if (! success) {
               // something went wrong with the link
               throw new Error('Program filed to link: ' + __context.getProgramInfoLog(__glProgram));
           }

           __context.useProgram(__glProgram);

           return __glProgram;
      }


      function __getShaderContentsHelper(shaderStr) {
        var shaderContents = null;


        if (shaderStr[0] === '#') {
          var idDOM = $(shaderStr);

          if (idDOM.length) {
            shaderContents = idDOM.text();
          }
        }

        return shaderContents;
      }


      function __setShaders(vertexShaderStr, fragmentShaderStr) {

        if (! __context || typeof vertexShaderStr !== 'string' || typeof fragmentShaderStr !== 'string' || __canvasType !== _Canvas.prototype.CANVAS_TYPES.CANVAS_3D) {

          throw new Error('Could not set the vertex/fragment shaders!\nYou sent vertex shader contents: ' +
                            vertexShaderStr + '\nYou sent fragment shader contents: ' + fragmentShaderStr);
        }

        var vsContents = __getShaderContentsHelper(vertexShaderStr),
            fsContents = __getShaderContentsHelper(fragmentShaderStr);


        var compiledVertexShader = __compileShader(vsContents, __context.VERTEX_SHADER),
            compiledFragmentShader = __compileShader(fsContents, __context.FRAGMENT_SHADER);


        var vs = __shaders[_Canvas.prototype.SHADER_TYPES.VERTEX],
            fs = __shaders[_Canvas.prototype.SHADER_TYPES.FRAGMENT];

        vs.src = vsContents, vs.resource = compiledVertexShader;
        fs.src = fsContents, fs.resource = compiledFragmentShader;

        return __initProgram();
      }


      function __compileShader(shaderSource, shaderType) {

        if (__context === null || __canvasType !== _Canvas.prototype.CANVAS_TYPES.CANVAS_3D || typeof shaderSource !== 'string') {
          return null;
        }


        // Create the shader object
        var shader = __context.createShader(shaderType);

        // Set the shader source code.
        __context.shaderSource(shader, shaderSource);

        // Compile the shader
        __context.compileShader(shader);

        // Check if it compiled
        var success = __context.getShaderParameter(shader, __context.COMPILE_STATUS);

        if (! success ) {
          // Something went wrong during compilation; get the error
          throw new Error('Could not compile ' + (shaderType === __context.VERTEX_SHADER ? 'vertex' : 'fragment') +  ' shader: ' + __context.getShaderInfoLog(shader));
        }

        return shader;
      }


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


        __shaders[_Canvas.prototype.SHADER_TYPES.VERTEX] = {src: '', resource: null};
        __shaders[_Canvas.prototype.SHADER_TYPES.FRAGMENT] = {src: '', resource: null};

      }

      function __getVShadersObj() {
        return __shaders;
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
        __canvasJQObj.attr('height', h);
      }

      function __setWidth(w) {
        __width = w;
        __viewportNeedsUpdate = true;
        __canvasJQObj.attr('width', w);
      }

      function __updateViewportSize() {
        if (__canvasType === _Canvas.prototype.CANVAS_TYPES.CANVAS_3D && __context && __viewportNeedsUpdate) {
          __context.viewport(0, 0, __width, __height);
          __viewportAspectRatio = __width / __height;
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

      this.getViewportAspectRatio = function() {
        return __viewportAspectRatio;
      };

      this.getGLProgram = function() {
        return __glProgram;
      };


      this.setVertexAndFragmentShaders = __setShaders;
      this.getShaders = __getVShadersObj;

      this.updateViewportSize = __updateViewportSize;


      this.destroy = function() {
        if (__canvasJQObj !== null && __canvasJQObj.length) {
          __canvasJQObj.remove();

          __canvasJQObj = null;
          __canvasEl = null;
          __shaders = null;
          __glProgram = null;
          __context = null;
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
      SHADER_TYPES: {
        VERTEX: 'vertex',
        FRAGMENT: 'fragment'
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
          _modalDetailBody = null,
          _modalHideCallbackFn = null;


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

         __initCanvases();

       }



      }

      function __initCanvases() {
        _canvas2D = __addCanvas('hud-canvas', _Canvas.prototype.CANVAS_TYPES.CANVAS_2D);
        _canvas3D = __addCanvas('gl-canvas', _Canvas.prototype.CANVAS_TYPES.CANVAS_3D);


        if (_canvas2D && _canvas3D) {
          _modalBody
            .append(_canvas2D.getCanvasJQObj().hide().addClass('canvas canvas-hud'))
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

        return this;
      }

      function __show(callbackFn) {

        _modalJQObj.fadeIn('fast', function() {

        _modalBox.show('fast', function() {
          if (typeof callbackFn === 'function') {
            callbackFn.call(this);
          }
        });
      });


        return this;
      }

      function __hide(callbackFn) {

        _modalBox.hide('fast', function() {
          _modalJQObj.fadeOut('fast', function() {

            if (typeof callbackFn === 'function') {
              callbackFn.apply(this);
            }

            if (typeof _modalHideCallbackFn === 'function') {
              _modalHideCallbackFn.apply(this);
            }

            _modalHideCallbackFn = null;
            __resetCanvasWidget();
          });
        });

        return this;

      }


      // initialize the Canvas Widget
      __initCanvasWidget();


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

      this.getGLCanvasEl = function() {
        return _canvas3D.getCanvasJQObj();
      };

      this.getGLViewportAspectRatio = function() {
        return _canvas3D.getViewportAspectRatio();
      };

      this.get2DCanvasEl = function() {
        return _canvas2D.getCanvasJQObj();
      };

      this.showHUDCanvas = function() {
        _canvas2D.getCanvasJQObj().show().css({'zIndex': 1});
        return this;
      };

      this.hideHUDCanvas = function() {
        _canvas2D.getCanvasJQObj().hide().css({'zIndex': 0});
        _canvas3D.getCanvasJQObj().css({'zIndex': 1});
        return this;
      };

      this.setGLVertexAndFragmentShaders = function(vertexShaderStrOrID, fragmentShaderStrOrID) {
        return _canvas3D.setVertexAndFragmentShaders(vertexShaderStrOrID, fragmentShaderStrOrID);
      };

      this.getGLProgram = function() {
        return _canvas3D.getGLProgram();
      }

      this.setCaption = function(caption) {
        _modalCaptionElement.html(caption);
        return this;
      };

      this.setDetailText = function(details) {
        _modalDetailBody.html(details);
        return this;
      };

      this.onHide = function(callbackFn) {
        if (typeof callbackFn === 'function') {
          _modalHideCallbackFn = callbackFn;
        }

        return this;
      };


      // Canvas Widget Public API
      this.resetCanvasWidget = __resetCanvasWidget;


      return this;

    };

    /////////////////////////////////////////////////////////////////////////////

    function _initCanvasModalWidget(id) {
      var canvasID = (typeof id === 'string' && id.length) ? id : 'canvas-modal-container';
      _canvasModalWidget = new _CanvasModalWidget(canvasID);
    }

    // public API To Utility Service
    var _canvasModalWidget = null;

    this.initCanvasModalWidget = _initCanvasModalWidget;


    this.getCanvasModalWidget = function() {
      return _canvasModalWidget;
    };


    return this;
  }])
.service('webGLDrawUtilities', [function() {

  // generate square vertices
  // generate 3D-Cube vertices
  // generate Sphere vertices

  this.createCubeVertexData = function(scaleX, scaleY, scaleZ) {
    scaleX = scaleX || 1.0,
    scaleY = scaleY || 1.0,
    scaleZ = scaleZ || 1.0;

    var vertexPositionData = [
      // Front face
      -1.0 * scaleX, -1.0 * scaleY, 1.0 * scaleZ,
       1.0 * scaleX, -1.0 * scaleY,  1.0 * scaleZ,
       1.0 * scaleX,  1.0 * scaleY,  1.0 * scaleZ,
      -1.0 * scaleX,  1.0 * scaleY,  1.0 * scaleZ,

      // Back face
      -1.0 * scaleX, -1.0 * scaleY, -1.0 * scaleZ,
      -1.0 * scaleX,  1.0 * scaleY, -1.0 * scaleZ,
       1.0 * scaleX,  1.0 * scaleY, -1.0 * scaleZ,
       1.0 * scaleX, -1.0 * scaleY, -1.0 * scaleZ,

      // Top face
      -1.0 * scaleX,  1.0 * scaleY, -1.0 * scaleZ,
      -1.0 * scaleX,  1.0 * scaleY,  1.0 * scaleZ,
       1.0 * scaleX,  1.0 * scaleY,  1.0 * scaleZ,
       1.0 * scaleX,  1.0 * scaleY, -1.0 * scaleZ,

      // Bottom face
      -1.0 * scaleX, -1.0 * scaleY, -1.0 * scaleZ,
       1.0 * scaleX, -1.0 * scaleY, -1.0 * scaleZ,
       1.0 * scaleX, -1.0 * scaleY,  1.0 * scaleZ,
      -1.0 * scaleX, -1.0 * scaleY,  1.0 * scaleZ,

      // Right face
       1.0 * scaleX, -1.0 * scaleY, -1.0 * scaleZ,
       1.0 * scaleX,  1.0 * scaleY, -1.0 * scaleZ,
       1.0 * scaleX,  1.0 * scaleY,  1.0 * scaleZ,
       1.0 * scaleX, -1.0 * scaleY,  1.0 * scaleZ,

      // Left face
      -1.0 * scaleX, -1.0 * scaleY, -1.0 * scaleZ,
      -1.0 * scaleX, -1.0 * scaleY,  1.0 * scaleZ,
      -1.0 * scaleX,  1.0 * scaleY,  1.0 * scaleZ,
      -1.0 * scaleX,  1.0 * scaleY, -1.0 * scaleZ,
    ];

    var indexData = [
      // Front face
      0, 1, 2,
      0, 2, 3,

      // Back face
      4, 5, 6,
      4, 6, 7,

      // Top face
      8, 9, 10,
      8, 10, 11,

      // Bottom face
      12, 13, 14,
      12, 14, 15,

      // Right face
      16, 17, 18,
      16, 18, 19,

      // Left face
      20, 21, 22,
      20, 22, 23
    ];

    var vertexNormals = [
      // Front face
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,

      // Back face
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,

      // Top face
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,

      // Bottom face
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,

      // Right face
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,

      // Left face
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
    ];

     return {
      'vertexIndexData': indexData,
      'vertexPositionData': vertexPositionData,
      'vertexNormals': vertexNormals
    };


  }

  this.createSphereVertexData = function(r, latBands, longBands) {

    /* Algorithm accredited to "WebGL Lesson 11 – spheres, rotation matrices, and mouse events | Learning WebGL"
    from http://learningwebgl.com/blog/?p=1253, Retrieved: March 21, 2015 */
    var latitudeBands = latBands ? latBands : 30;
    var longitudeBands = longBands ? longBands : 30;
    var radius = r ? r : 1.0;

    var vertexPositionData = [];
    var vertexNormals = [];
    var textureCoordData = [];

    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      var theta = latNumber * Math.PI / latitudeBands;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        var phi = longNumber * 2 * Math.PI / longitudeBands;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var x = cosPhi * sinTheta;
        var y = cosTheta;
        var z = sinPhi * sinTheta;
        var u = 1 - (longNumber / longitudeBands);
        var v = 1 - (latNumber / latitudeBands);

        vertexNormals.push(x);
        vertexNormals.push(y);
        vertexNormals.push(z);
        textureCoordData.push(u);
        textureCoordData.push(v);
        vertexPositionData.push(radius * x);
        vertexPositionData.push(radius * y);
        vertexPositionData.push(radius * z);
      }
    }

    var indexData = [];

    /* first ----- first + 1
        |         /|
        |        / |
        |       /  |
        |      /   |
        |     /    |
        |    /     |
        |   /      |
        |  /       |
        | /        |
        |/         |
      second ----- second + 1
    */
    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * (longitudeBands + 1)) + longNumber;
        var second = first + longitudeBands + 1;
        indexData.push(first);
        indexData.push(second);
        indexData.push(first + 1);

        indexData.push(second);
        indexData.push(second + 1);
        indexData.push(first + 1);
      }
    }

    return {
      'vertexIndexData': indexData,
      'vertexPositionData': vertexPositionData,
      'vertexNormals': vertexNormals,
      'textureCoordData': textureCoordData
    };

  }

  return this;

}]);
