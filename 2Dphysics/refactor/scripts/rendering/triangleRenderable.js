class TriangleRenderable extends Renderable
{
    constructor(aRenderer, aTransform)
    {
        super(aRenderer, aTransform);
        this.shape = "triangle";
        this.vao = this.renderer.availableVaos.get(this.shape);
        this.vertCount = 3;
        this.renderer.add(this);
    }

    render(time)
    {
        this.renderer.gl.bindVertexArray(this.vao);
        this.renderer.gl.useProgram(this.program);
        //
        this.renderer.gl.uniform1f(this.uniforms["time"], time);
        this.renderer.gl.uniform2f(this.uniforms["resolution"], this.renderer.gl.canvas.width, this.renderer.gl.canvas.height);
        this.renderer.gl.uniformMatrix4fv(this.uniforms["model"], false, this.transform);
        this.renderer.gl.uniformMatrix4fv(this.uniforms["view"], false, this.renderer.view); 
        this.renderer.gl.uniformMatrix4fv(this.uniforms["projection"], false, this.renderer.projection);
        //
        this.renderer.gl.drawArrays(this.primitiveType, 0, this.vertCount);
    }
    setProgram(programName)
    {
        super.setProgram(programName);
    }
}