var $demos = $demos || {};
  

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Pong!!!
///////////////////////////////////////////////////////////////////////////////////////////////////////////
$demos.Pong = function Pong(canvasModalWidget, webGLDrawUtilities) {

      // get the gl context from our modal widget
      var _gl = null,
          _HUDContext = null,
          _glProgram = null,
          _lastDrawTime = 0,
          _isAppRunning = true,
          _keyPressed = {};



        ///////////////////////////////////////////////////////////////////////////////////////////////////
        //  _Sphere(radius) Constructor method is used to represent and Sphere with a radius
        //  this sphere can draw itself and adjust its orientation on the canvas via the accessor methods.
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        function _Sphere(radius) {
          var __sphereData = null,
            __sphereVertexPositionBuffer = null,
            __sphereVertexIndexBuffer = null,
            __sphereVertexNormalBuffer = null,

            __colour = {r: 0.8, g: 0.8, b: 0.8, a: 1.0},
            __radius = radius || 1.0,
            __modelMatrix = mat4.create(),
            __rotationMatrix = mat4.create(),
            __translationMatrix = mat4.create(),
            __scaleMatrix = mat4.create(),
            __PVMMatrix = mat4.create(),
            __normalMatrix = mat3.create(),
            __shouldUpdateMatrices = true;

          function __init() {
            __sphereData = webGLDrawUtilities.createSphereVertexData(__radius);

            // create the buffer for vertex positions and assign it to that buffer to use for later
            __sphereVertexPositionBuffer = _gl.createBuffer();
            __sphereVertexPositionBuffer.itemSize = 3;
            __sphereVertexPositionBuffer.numItems = __sphereData.vertexPositionData.length / __sphereVertexPositionBuffer.itemSize;
            __sphereVertexPositionBuffer.items = new Float32Array(__sphereData.vertexPositionData);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, __sphereVertexPositionBuffer);
            _gl.bufferData(_gl.ARRAY_BUFFER, __sphereVertexPositionBuffer.items, _gl.STATIC_DRAW);

            // create the buffer for vertex positions indexes and assign it to that buffer to use for later
            __sphereVertexIndexBuffer = _gl.createBuffer();
            __sphereVertexIndexBuffer.itemSize = 1;
            __sphereVertexIndexBuffer.numItems = __sphereData.vertexIndexData.length;
            __sphereVertexIndexBuffer.items = new Uint16Array(__sphereData.vertexIndexData);

            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __sphereVertexIndexBuffer);
            _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, __sphereVertexIndexBuffer.items, _gl.STATIC_DRAW);


            // create the buffer for vertex positions indexes and assign it to that buffer to use for later
            __sphereVertexNormalBuffer = _gl.createBuffer();
            __sphereVertexNormalBuffer.itemSize = 3;
            __sphereVertexNormalBuffer.numItems = __sphereData.vertexNormals.length / __sphereVertexNormalBuffer.itemSize;
            __sphereVertexNormalBuffer.items = new Float32Array(__sphereData.vertexNormals);


            _gl.bindBuffer(_gl.ARRAY_BUFFER, __sphereVertexNormalBuffer);
            _gl.bufferData(_gl.ARRAY_BUFFER, __sphereVertexNormalBuffer.items, _gl.STATIC_DRAW);


          }

          function __draw() {


            mat4.multiply(__modelMatrix, __translationMatrix, __rotationMatrix);
            mat4.multiply(__modelMatrix, __modelMatrix, __scaleMatrix);

            mat3.normalFromMat4(__normalMatrix, __modelMatrix);

            mat4.multiply(__PVMMatrix, _glProgram.customAttribs.viewMatrix, __modelMatrix);
            mat4.multiply(__PVMMatrix, _glProgram.customAttribs.perspectiveMatrix, __PVMMatrix);




            _gl.uniformMatrix3fv(_glProgram.customAttribs.u_NormalMatrixRef, false, __normalMatrix);
            _gl.uniformMatrix4fv(_glProgram.customAttribs.u_PVMMatrixRef, false, __PVMMatrix);


            _gl.bindBuffer(_gl.ARRAY_BUFFER, __sphereVertexPositionBuffer);
            _gl.vertexAttribPointer(_glProgram.customAttribs.a_PositionRef, __sphereVertexPositionBuffer.itemSize, _gl.FLOAT, false, 0, 0);
            _gl.enableVertexAttribArray(_glProgram.customAttribs.a_PositionRef);


            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __sphereVertexIndexBuffer);


            _gl.bindBuffer(_gl.ARRAY_BUFFER, __sphereVertexNormalBuffer);
            _gl.vertexAttribPointer(_glProgram.customAttribs.a_VertexNormalRef, __sphereVertexNormalBuffer.itemSize, _gl.FLOAT, false, 0, 0);
            _gl.enableVertexAttribArray(_glProgram.customAttribs.a_VertexNormalRef);


            _gl.uniform4f(_glProgram.customAttribs.u_FragColourRef, __colour.r, __colour.g, __colour.b, __colour.a);

            _gl.drawElements(_gl.TRIANGLES, __sphereVertexIndexBuffer.numItems, _gl.UNSIGNED_SHORT, 0);

          }


          function __rotateOnAxisByDegrees(x, y, z) {

            if (typeof x === 'number') {
              mat4.rotateX(__rotationMatrix, __rotationMatrix, glMatrix.toRadian(x));
            }

            if (typeof y === 'number') {
              mat4.rotateY(__rotationMatrix, __rotationMatrix, glMatrix.toRadian(y));
            }

            if (typeof z === 'number') {
              mat4.rotateZ(__rotationMatrix, __rotationMatrix, glMatrix.toRadian(z));
            }

            __shouldUpdateMatrices = true;

            return this;

          }


          function __scale(s) {
            if (typeof s === 'number') {
              mat4.scale(__scaleMatrix, __scaleMatrix, vec3.fromValues(s, s, s));
            }

            __shouldUpdateMatrices = true;

            return this;
          }

          function __translate(x, y, z) {

            mat4.translate(__translationMatrix, __translationMatrix, vec3.fromValues(x, y, z));

            __shouldUpdateMatrices = true;

            return this;
          }

          __init();



          this.rotateOnAxisByDegrees = __rotateOnAxisByDegrees;

          this.draw = __draw;

          this.scale = __scale;

          this.translate = __translate;

          this.setColour = function(r, g, b, a) {
            __colour.r = r;
            __colour.g = g;
            __colour.b = b;
            __colour.a = a;

            return this;
          };

          this.getRadius = function() {
            return __radius;
          };


          return this;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //  _Quad(x, y, z) Constructor method is used to represent and Quadrilateral (rectangle) with
        //  width, height and depth (x, y ,z) dimensions respectively.ß
        //  This quadrilateral can draw itself and adjust its orientation on the canvas via the accessor methods.
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function _Quad(x, y, z) {

          var __quadData = null,
            __quadVertexPositionBuffer = null,
            __quadVertexIndexBuffer = null,
            __quadVertexNormalBuffer = null,

            __colour = {r: 1.0, g: 0.0, b: 1.0, a: 1.0},

            __modelMatrix = mat4.create(),
            __rotationMatrix = mat4.create(),
            __translationMatrix = mat4.create(),
            __scaleMatrix = mat4.create(),
            __PVMMatrix = mat4.create(),
            __normalMatrix = mat3.create(),
            __shouldUpdateMatrices = true;

          function __init() {
            __quadData = webGLDrawUtilities.createCubeVertexData(x, y, z);

            // create the buffer for vertex positions and assign it to that buffer to use for later
            __quadVertexPositionBuffer = _gl.createBuffer();
            __quadVertexPositionBuffer.itemSize = 3;
            __quadVertexPositionBuffer.numItems = __quadData.vertexPositionData.length / __quadVertexPositionBuffer.itemSize;
            __quadVertexPositionBuffer.items = new Float32Array(__quadData.vertexPositionData);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, __quadVertexPositionBuffer);
            _gl.bufferData(_gl.ARRAY_BUFFER, __quadVertexPositionBuffer.items, _gl.STATIC_DRAW);

            // create the buffer for vertex positions indexes and assign it to that buffer to use for later
            __quadVertexIndexBuffer = _gl.createBuffer();
            __quadVertexIndexBuffer.itemSize = 1;
            __quadVertexIndexBuffer.numItems = __quadData.vertexIndexData.length;
            __quadVertexIndexBuffer.items = new Uint16Array(__quadData.vertexIndexData);

            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __quadVertexIndexBuffer);
            _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, __quadVertexIndexBuffer.items, _gl.STATIC_DRAW);

            // create the buffer for vertex positions indexes and assign it to that buffer to use for later
            __quadVertexNormalBuffer = _gl.createBuffer();
            __quadVertexNormalBuffer.itemSize = 3;
            __quadVertexNormalBuffer.numItems = __quadData.vertexNormals.length / __quadVertexNormalBuffer.itemSize;
            __quadVertexNormalBuffer.items = new Float32Array(__quadData.vertexNormals);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, __quadVertexNormalBuffer);
            _gl.bufferData(_gl.ARRAY_BUFFER, __quadVertexNormalBuffer.items, _gl.STATIC_DRAW);


          }

          function __draw() {


            mat4.multiply(__modelMatrix, __translationMatrix, __rotationMatrix);
            mat4.multiply(__modelMatrix, __modelMatrix, __scaleMatrix);

            // calculate the inverse transformation that will remove caused by transforming the 3D surface
            mat3.normalFromMat4(__normalMatrix, __modelMatrix);

            mat4.multiply(__PVMMatrix, _glProgram.customAttribs.viewMatrix, __modelMatrix);
            mat4.multiply(__PVMMatrix, _glProgram.customAttribs.perspectiveMatrix, __PVMMatrix);

            __shouldUpdateMatrices = false;


            _gl.uniformMatrix3fv(_glProgram.customAttribs.u_NormalMatrixRef, false, __normalMatrix);
            _gl.uniformMatrix4fv(_glProgram.customAttribs.u_PVMMatrixRef, false, __PVMMatrix);


            _gl.bindBuffer(_gl.ARRAY_BUFFER, __quadVertexPositionBuffer);
            _gl.vertexAttribPointer(_glProgram.customAttribs.a_PositionRef, __quadVertexPositionBuffer.itemSize, _gl.FLOAT, false, 0, 0);
            _gl.enableVertexAttribArray(_glProgram.customAttribs.a_PositionRef);


            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, __quadVertexIndexBuffer);


            _gl.bindBuffer(_gl.ARRAY_BUFFER, __quadVertexNormalBuffer);
            _gl.vertexAttribPointer(_glProgram.customAttribs.a_VertexNormalRef, __quadVertexNormalBuffer.itemSize, _gl.FLOAT, false, 0, 0);
            _gl.enableVertexAttribArray(_glProgram.customAttribs.a_VertexNormalRef);


            _gl.uniform4f(_glProgram.customAttribs.u_FragColourRef, __colour.r, __colour.g, __colour.b, __colour.a);

            _gl.drawElements(_gl.TRIANGLES, __quadVertexIndexBuffer.numItems, _gl.UNSIGNED_SHORT, 0);

          }


          function __rotateOnAxisByDegrees(x, y, z) {

            if (typeof x === 'number') {
              mat4.rotateX(__rotationMatrix, __rotationMatrix, glMatrix.toRadian(x));
            }

            if (typeof y === 'number') {
              mat4.rotateY(__rotationMatrix, __rotationMatrix, glMatrix.toRadian(y));
            }

            if (typeof z === 'number') {
              mat4.rotateZ(__rotationMatrix, __rotationMatrix, glMatrix.toRadian(z));
            }

            __shouldUpdateMatrices = true;
            return this;

          }


          function __scale(s) {
            if (typeof s === 'number') {
              mat4.scale(__scaleMatrix, __scaleMatrix, vec3.fromValues(s, s, s));
            }
            __shouldUpdateMatrices = true;
            return this;
          }

          function __translate(x, y, z) {

            mat4.translate(__translationMatrix, __translationMatrix, vec3.fromValues(x, y, z));
            __shouldUpdateMatrices = true;
            return this;
          }

          __init();



          this.rotateOnAxisByDegrees = __rotateOnAxisByDegrees;

          this.draw = __draw;

          this.scale = __scale;

          this.translate = __translate;

          this.setColour = function(r, g, b, a) {
            __colour.r = r;
            __colour.g = g;
            __colour.b = b;
            __colour.a = a;

            return this;
          };




          return this;


        }


    //////////
    function _bindKeyEvents() {
      var KEY_PRESS_EVENT = 'keypress.pong3D',
          _window = $(window);

      _window
        .on(KEY_PRESS_EVENT, function(event) {
          event.stopPropagation();
          _keyPressed[event.which] = true;


          //console.log(event);

      });

      canvasModalWidget.onHide(function() {
        _isAppRunning = false;
        _window.unbind(KEY_PRESS_EVENT);
        //console.log('cancel request animation');
      });


  }


    ///////////////////////
    function _init() {

      _gl = canvasModalWidget.getGLContext();
      _HUDContext = canvasModalWidget.getHUDContext();

      if (! _gl) {
              throw new Error('Could not run lightingExample() WebGL Demo!');
          }





       // Set clear color to black, fully opaque
          _gl.clearColor(0.0, 0.0, 0.0, 1.0);

          // dealing with 3D space geometry so make sure this feature is enabled
          _gl.enable(_gl.DEPTH_TEST);

      // get the shaders and compile them - the resultant will be a program that is automatically joined to the gl context in the background
          _glProgram = canvasModalWidget.setGLVertexAndFragmentShaders('#v-shader-demo6', '#f-shader-demo6');
          _glProgram.customAttribs = {};


      // Get the storage locations of all the customizable shader variables
      _glProgram.customAttribs.a_PositionRef = _gl.getAttribLocation(_glProgram, 'a_Position'),
      _glProgram.customAttribs.a_VertexNormalRef = _gl.getAttribLocation(_glProgram, 'a_VertexNormal'),

      _glProgram.customAttribs.u_FragColourRef = _gl.getUniformLocation(_glProgram, 'u_FragColour'),
      _glProgram.customAttribs.u_PVMMatrixRef = _gl.getUniformLocation(_glProgram, 'u_PVMMatrix'),
      _glProgram.customAttribs.u_NormalMatrixRef = _gl.getUniformLocation(_glProgram, 'u_NormalMatrix'),


      _glProgram.customAttribs.u_AmbientColourRef = _gl.getUniformLocation(_glProgram, 'u_AmbientColour'),
      _glProgram.customAttribs.u_LightingDirectionRef = _gl.getUniformLocation(_glProgram, 'u_LightingDirection'),
      _glProgram.customAttribs.u_DirectionalColourRef = _gl.getUniformLocation(_glProgram, 'u_DirectionalColour');


      _glProgram.customAttribs.eyePosition = vec3.fromValues(0, 0, 5);
      _glProgram.customAttribs.centerPoint = vec3.fromValues(0, 0, -50);


      var perspectiveMatrix = mat4.create(), // get the identity matrix
        viewMatrix = mat4.create(),
        modelMatrix = mat4.create(),
        PVMMatrix = mat4.create();


      mat4.perspective(perspectiveMatrix, glMatrix.toRadian(45.0), canvasModalWidget.getGLViewportAspectRatio(), 1, 1000);
      mat4.lookAt(viewMatrix, _glProgram.customAttribs.eyePosition, _glProgram.customAttribs.centerPoint, vec3.fromValues(0, 1, 0));

      _glProgram.customAttribs.viewMatrix = viewMatrix;
      _glProgram.customAttribs.modelMatrix = modelMatrix;
      _glProgram.customAttribs.perspectiveMatrix = perspectiveMatrix;

      mat4.multiply(PVMMatrix, perspectiveMatrix, viewMatrix);

      _glProgram.customAttribs.PVMMatrix = PVMMatrix;

      _gl.uniformMatrix4fv(_glProgram.customAttribs.u_PVMMatrixRef, false, _glProgram.customAttribs.PVMMatrix);

      _glProgram.customAttribs.lightingDirection  = _setLightingDirection(-20.0, 10.0, 1.0);

      _gl.uniform3fv(_glProgram.customAttribs.u_LightingDirectionRef, _glProgram.customAttribs.lightingDirection);
      _gl.uniform3f(_glProgram.customAttribs.u_AmbientColourRef, 0.5, 0.5, 0.5);

      _gl.uniform3f(_glProgram.customAttribs.u_DirectionalColourRef, 1.0, 1.0, 1.0);





      _initGame();


      //_tick();


      }

      function _setLightingDirection(x, y, z) {
        var n = vec3.create(),
            v = vec3.fromValues(x, y, z);

        vec3.normalize(n, v);
        //vec3.scale(n, n, -1.0);

        return n;
      }


      ///////////////////////////////////////////////////////////////////////


      function _showTitleScreen() {
        var HUDEl = canvasModalWidget.get2DCanvasEl();
        
        canvasModalWidget.clearHUDCanvas();

        _HUDContext.font = '24px "Verdana"';
        _HUDContext.fillStyle = 'rgba(255, 255, 255, 1.0)'; // Set the font colour
        _HUDContext.fillText('Pong', 270, 180);

        _HUDContext.fillStyle = 'rgba(204, 229, 255, 1.0)'; 
        _HUDContext.fillText('GL', 330, 180);

        _HUDContext.fillStyle = 'rgba(255, 204, 204, 1.0)'; 
        _HUDContext.font = '18px "Verdana"';
        _HUDContext.fillText('Press Space Bar to begin...', 200, 210);
       

        canvasModalWidget.showHUDCanvas();
      }

      function _Player(tx, ty, tz, playerType) {
        var __paddle = null,
            __score = 0,
            __playerType = playerType === _Player.prototype.PLAYER_TYPE.HUMAN ? playerType : _Player.prototype.PLAYER_TYPE.ROBOT,
            __playerPosition = {x: (tx || 0.0), y: (ty || 0.0), z: (tz || 0.0)};


        function __init() {
          var paddleDimensions = {x: 0.5, y: 0.05, z: 0.1}
          __paddle = new _Quad(paddleDimensions.x, paddleDimensions.y, paddleDimensions.z);
          __paddle.translate(__playerPosition.x, __playerPosition.y, __playerPosition.z);
        }


        function __draw(tickMS) {
          __paddle.draw();
        }


        __init();

        this.getScore = function() {
          return __score;
        }


        this.draw = __draw;

        this.setColour = function(r, g, b) {
          __paddle.setColour(r, g, b, 1);
          return this;
        };


        return this;

      }

      _Player.prototype.PLAYER_TYPE = {ROBOT: 0, HUMAN: 1};


      ////////////////////////////////
      function _Ball(tx, ty, tz) {
        var   __ball = null,
              __ballPosition = {x: (tx || 0.0), y: (ty || 0.0), z: (tz || 0.0)};


        function __init() {
          __ball = new _Sphere(0.1);
          __ball.translate(__ballPosition.x, __ballPosition.y, __ballPosition.z);
        }

        function __draw(tickMS) {
          __ball.draw();
        }

        __init();

        this.draw = __draw;


        return this;
      }


      function _Map() {
        var __leftWall = null,
            __rightWall = null;

        function __init() {
          var wallDimensions = {x: 0.05, y: 2, z: 0.1},
              wallColour = {r:0.4, g:0.4, b:0.5},
              translate = {x: 2.6, y: 0, z: 0};


          __leftWall = new _Quad(wallDimensions.x, wallDimensions.y, wallDimensions.z);
          __leftWall
            .setColour(wallColour.r, wallColour.g , wallColour.b, 1)
            .translate(-translate.x, translate.y, translate.z);

         __rightWall = new _Quad(wallDimensions.x, wallDimensions.y, wallDimensions.z);
         __rightWall
            .setColour(wallColour.r, wallColour.g , wallColour.b, 1)
            .translate(translate.x, translate.y, translate.z);
        }

        function __draw(tickMS) {
          __leftWall.draw();
          __rightWall.draw();
        }

        function __start() {

        }


        __init();

        this.draw = __draw;
        this.start = __start;

        return this;
      }




      var _GAME_STATES = {RUNNING: 0, PAUSED: 1, INTRO_SCREEN: 2},
          _game = {ball: null, isRunning: true, players: [], map: null, status: _GAME_STATES.INTRO_SCREEN};



      function _initGame() {
        _showTitleScreen();

        canvasModalWidget.setFPSVal(1000);

        var playerPosition = {x: 0.0, y: -1.9, z: 0.0};

        _game.map = new _Map();

        _game.ball = new _Ball();

        _game.players.push(new _Player(playerPosition.x, playerPosition.y, playerPosition.z,  _Player.prototype.PLAYER_TYPE.HUMAN).setColour(0,0,1));
        _game.players.push(new _Player(playerPosition.x, -playerPosition.y, playerPosition.z,  _Player.prototype.PLAYER_TYPE.ROBOT).setColour(0,1,0));

        _bindKeyEvents();

        _tick();
      }



      function _rotateMap(rotationX, rotationY) {

        var viewMatrix = mat4.create();


        if (rotationX) {
          var rotationInRadsX = glMatrix.toRadian(rotationX);
          vec3.rotateX(_glProgram.customAttribs.eyePosition, _glProgram.customAttribs.eyePosition, vec3.fromValues(0,0,0), rotationInRadsX);
          vec3.rotateX(_glProgram.customAttribs.centerPoint, _glProgram.customAttribs.centerPoint, vec3.fromValues(0,0,0), rotationInRadsX);
        }

        if (rotationY) {
          var rotationInRadsY = glMatrix.toRadian(rotationY);
          vec3.rotateY(_glProgram.customAttribs.eyePosition, _glProgram.customAttribs.eyePosition, vec3.fromValues(0,0,0), rotationInRadsY);
          vec3.rotateY(_glProgram.customAttribs.centerPoint, _glProgram.customAttribs.centerPoint, vec3.fromValues(0,0,0), rotationInRadsY);
        }


        mat4.lookAt(viewMatrix, _glProgram.customAttribs.eyePosition, _glProgram.customAttribs.centerPoint, vec3.fromValues(0, 1, 0));
        _glProgram.customAttribs.viewMatrix = viewMatrix;

      }


    function _processInput() {
      var degreeInc = 2.0;
      //console.log(_keyPressed);
      for (var keyCode in _keyPressed) {

        if (! _keyPressed[keyCode]) {
          continue;
        }

        var key = parseInt(keyCode);


        switch(key) {
          case 87: // rotate up
          case 119:
            _rotateMap(degreeInc);
          break;

          case 83:  // rotate down
          case 115:
            _rotateMap(-degreeInc);
          break;

          case 65: // rotate left
          case 97:
            _rotateMap(null, degreeInc);
          break;

          case 68: // rotate right
          case 100:
            _rotateMap(null, -degreeInc);
          break;
          default:
            console.log('Did not recognize key with code: ' + keyCode)
          break;
        }

        _keyPressed[keyCode] = false;

      }
    }


    function _tick() {

        // Clear the color and depth buffer because now we are dealing with perspective and camera space.
        // and we want everything to look natural...
        _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);

        //vec3.rotateY(_glProgram.customAttribs.lightingDirection, _glProgram.customAttribs.lightingDirection, vec3.fromValues(0,0,0), glMatrix.toRadian(0.5));
        //vec3.rotateZ(_glProgram.customAttribs.lightingDirection, _glProgram.customAttribs.lightingDirection, vec3.fromValues(0,0,0), glMatrix.toRadian(0.5));
        //console.log(vec3.str(_glProgram.customAttribs.lightingDirection))
        //_gl.uniform3fv(_glProgram.customAttribs.u_LightingDirectionRef, _glProgram.customAttribs.lightingDirection);

        _processInput();

        _game.map.draw();
        _game.ball.draw();

        for (var i = 0; i < _game.players.length; i++) {
          var player = _game.players[i];
          player.draw();
        }


        // stop calling the browser's animate when ready callback function when the modal has closed
        if (_isAppRunning) {
          requestAnimationFrame(_tick);
        }
    }




     // start this demo up!
  _init();


  	}