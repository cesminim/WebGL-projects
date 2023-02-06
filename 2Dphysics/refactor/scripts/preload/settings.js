
// ------------- Fixed Time Step -------------
var fps = 30;
var frameDuration = 1000 / fps;
var accumulator = 0;
var previous = 0;
var dt = 1 / 30;

// ------------- glMatrix Lib Aliases -------------
var vec2 = glMatrix.vec2;
var vec3 = glMatrix.vec3;
var vec4 = glMatrix.vec4;
var mat2 = glMatrix.mat2;
var mat3 = glMatrix.mat3;
var mat4 = glMatrix.mat4;

// ------------- Global variables -------------
var seekScale = 0.5;

// ------------- Renderer -------------
var CLEAR_COL = vec3.fromValues(0.14, 0.14, 0.14);
var CAM_POS = vec4.fromValues(0, 0, 1, 1.)
var WORLD_UP = vec4.fromValues(0.0, 1.0, 0.0, 1.0);

// ------------- World Settings -------------
var SCENE_HEIGHT = 30;

// ------------- Physics Settings -------------
var littleG = -9.8 * .1;

// ------------- Attribute binding points -------------
var positionAttribLoc = 0;
var normalAttribLoc = 1;
var colorAttribLoc = 2;

// ------------- Geometry Magic numbers -------------
var circleNumSides = 32;