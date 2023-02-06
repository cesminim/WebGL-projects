
// ------------- glMatrix Lib Aliases -------------
var vec2 = glMatrix.vec2;
var vec3 = glMatrix.vec3;
var vec4 = glMatrix.vec4;
var mat2 = glMatrix.mat2;
var mat3 = glMatrix.mat3;
var mat4 = glMatrix.mat4;

// Basis Vectors
var iBasis = vec3.fromValues(1, 0, 0);
var jBasis = vec3.fromValues(0, 1, 0);
var kBasis = vec3.fromValues(0, 0, 1);

// ------------- Attribute binding points -------------
var positionAttribLoc = 0;
var normalAttribLoc = 1;
var colorAttribLoc = 2;
var modelMatrixAttribLoc = 3;

// ------------- Renderer Init Settings -------------
var CAM_POS = vec4.fromValues(0, 0, 20, 1);
var WORLD_UP = vec4.fromValues(0, 1, 0, 1);
var CLEAR_COL = vec4.fromValues(0.14, 0.14, 0.14, 1.);

// ------------- Cube parameters -------------
var NUM_CUBIES = 27;
var rubicksLen = 3;
var cubieLen = 2;
var cubeSideLenFromOrigin = cubieLen * rubicksLen / 2;
var cubeBoxObj = {A: [-1 * cubeSideLenFromOrigin, -1 * cubeSideLenFromOrigin, 1 * cubeSideLenFromOrigin],
                  B: [1 * cubeSideLenFromOrigin, 1 * cubeSideLenFromOrigin, -1 * cubeSideLenFromOrigin]};
var numCubies = Math.pow(rubicksLen, 3);
var rubicksLenSquared = rubicksLen * rubicksLen;
//var deltaLen = cubieLen - 0.05;
deltaLen = cubieLen;