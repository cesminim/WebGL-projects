class Renderer
{
    constructor(gl)
    {
        this.gl = gl;
        this.clearCol = CLEAR_COL;
        this.renderables = new Array();
        //
        this.aspectRatio = this.gl.canvas.width / this.gl.canvas.height;
        this.orthoHeight = SCENE_HEIGHT; // settings
        this.orthoWidth = this.orthoHeight * this.aspectRatio;
        //
        this.pos = CAM_POS;
        this.up = WORLD_UP;
        this.target = vec3.fromValues(0.0, 0.0, 0.0);
        this.view = mat4.create();
        this.projection = mat4.create();
        //
        this.availableVaos = new Map();
        this.availablePrograms = new Map();
        //
        this.init();
    }
    init()
    {
        // correct projection
        mat4.lookAt(this.view, [this.pos[0], this.pos[1], this.pos[2]], this.target, [this.up[0], this.up[1], this.up[2]]);
        mat4.ortho(this.projection, -this.orthoWidth / 2., this.orthoWidth / 2., -this.orthoHeight / 2., this.orthoHeight / 2., 1, 100);
        // STATE
        this.gl.clearColor(this.clearCol[0], this.clearCol[1], this.clearCol[2], 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND)
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        // make VAOs & Shader Programs
        this.initVAOS();
        this.initShaderPrograms();
    }
    initVAOS()
    {
        // ---- Triangle ----
        var triangleVAO = this.gl.createVertexArray();
        this.gl.bindVertexArray(triangleVAO);
        var triangleVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, triangleVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangleRenderingVertices), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(positionAttribLoc, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(positionAttribLoc);
        this.availableVaos.set("triangle", triangleVAO);
        
        // ---- Rectangle ----
        var rectangleVAO = this.gl.createVertexArray();
        this.gl.bindVertexArray(rectangleVAO);
        var rectangleVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, rectangleVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(rectangleRenderingVertices), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(positionAttribLoc, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(positionAttribLoc);
        this.availableVaos.set("rectangle", rectangleVAO);

        // // ---- Circle ----
        // var circleVAO = this.gl.createVertexArray();
        // this.gl.bindVertexArray(circleVAO);
        // var circleVBO = this.gl.createBuffer();
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, circleVBO);
        // let aCircleData = makeACircle(circleNumSides, 1.0);
        // this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(aCircleData.vertexData), this.gl.STATIC_DRAW);
        // this.gl.vertexAttribPointer(positionAttribLoc, 2, this.gl.FLOAT, false, 0, 0);
        // this.gl.enableVertexAttribArray(positionAttribLoc);
        // this.availableVaos.set("circle", circleVAO);
    }
    initShaderPrograms()
    {
        let program = createProgramFromSources(this.gl, baseVS, baseFS);
        let programUTime = this.gl.getUniformLocation(program, "time");
        let programUResolution = this.gl.getUniformLocation(program, "resolution");
        let programUModel = this.gl.getUniformLocation(program, "model");
        let programUView = this.gl.getUniformLocation(program, "view");
        let programUProjection = this.gl.getUniformLocation(program, "projection");
        this.availablePrograms.set("wireframe", 
            {program: program,
            programUTime: programUTime,
            programUResolution: programUResolution,
            programUModel: programUModel,
            programUView: programUView,
            programUProjection: programUProjection
            });
        
        let shadedProgram = createProgramFromSources(this.gl, shadedPolygonVS, shadedPolygonFS);
        let shadedProgramUTime = this.gl.getUniformLocation(shadedProgram, "time");
        let shadedProgramUResolution = this.gl.getUniformLocation(shadedProgram, "resolution");
        let shadedProgramUModel = this.gl.getUniformLocation(shadedProgram, "model");
        let shadedProgramUView = this.gl.getUniformLocation(shadedProgram, "view");
        let shadedProgramUProjection = this.gl.getUniformLocation(shadedProgram, "projection");
        this.availablePrograms.set("shaded", 
                                    {program:            shadedProgram,
                                     programUTime:       shadedProgramUTime,
                                     programUResolution: shadedProgramUResolution,
                                     programUModel:      shadedProgramUModel,
                                     programUView:       shadedProgramUView,
                                     programUProjection: shadedProgramUProjection
                                    });
        
    }
    add(aRendrable)
    {
        this.renderables.push(aRendrable);
    }
    render(time)
    {
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
        resize(this.gl.canvas);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.aspectRatio = this.gl.canvas.width / this.gl.canvas.height;
        this.orthoWidth = this.aspectRatio * this.orthoHeight;
        this.projection = mat4.create();
        mat4.ortho(this.projection, -this.orthoWidth / 2., this.orthoWidth / 2., -this.orthoHeight / 2., this.orthoHeight / 2., 1, 100);

        for(let i in this.renderables)
        {
            this.renderables[i].render(time);
        }
    }
}