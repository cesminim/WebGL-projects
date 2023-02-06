class Renderer 
{
    // pos = vec4
    // up = vec4 -- needs to change when rotated
    constructor(gl, pos, up)
    {
        this.gl = gl;
        this.pos = pos;
        this.up = up;
        this.target = vec3.fromValues(0.0, 0.0, 0.0);
        this.aspectRatio = this.gl.canvas.width / this.gl.canvas.height;
        //
        this.maxRadius = 20;
        //
        this.view = mat4.create();
        this.projection = mat4.create();
        this.renderables = new Array();

        this.init();
    }
    init()
    {
        // Set camera transformation matrices:
        mat4.lookAt(this.view, [this.pos[0], this.pos[1], this.pos[2]], this.target, [this.up[0], this.up[1], this.up[2]]);
        mat4.perspective(this.projection, Math.PI / 4., (this.gl.canvas.width / this.gl.canvas.height), 1, 100);
        
        // Set GL state
        this.gl.clearColor(CLEAR_COL[0], CLEAR_COL[1], CLEAR_COL[2], CLEAR_COL[3]); // see settings
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND)
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }
    addARenderable(aRenderable)
    {
        this.renderables.push(aRenderable);
    }
    render(time)
    {
        resize(this.gl.canvas);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.aspectRatio = this.gl.canvas.width / this.gl.canvas.height;

        mat4.lookAt(this.view, [this.pos[0], this.pos[1], this.pos[2]], this.target, [this.up[0], this.up[1], this.up[2]]); 
        mat4.perspective(this.projection, Math.PI / 4., (this.gl.canvas.width / this.gl.canvas.height), 1, 100);
    
        for(let i in this.renderables)
        {
            this.renderables[i].render(time);
        }
    }
}