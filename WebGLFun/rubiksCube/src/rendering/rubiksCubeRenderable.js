/*
 *     A RubiksCube is a cubie vao that is instanced according to
 *     a transformation matrix array resembling a rubiks cube
 */

class RubiksCubeRenderable
{
    constructor(aRenderer)
    {
        this.renderer = aRenderer;
        //this.model = plyParser(lowPolyCubie);
        this.model = plyParser(highPolyCubie)
        //
        this.vao;
        this.vbo;

        this.matrixData;
        this.cubieTransforms;
        this.matrixBuffer;
        //
        this.vertCount = this.model.vertCount;
        this.primitiveType = this.renderer.gl.TRIANGLES;
        this.program;
        this.uniforms;

        // set program & vao
        this.setVAO();
        this.setProgram();

        // add it to renderer after letruction
        this.renderer.addARenderable(this);
    }
    setVAO()
    {
        this.vao = this.renderer.gl.createVertexArray();
        this.renderer.gl.bindVertexArray(this.vao);
        this.vbo = this.renderer.gl.createBuffer();
        this.renderer.gl.bindBuffer(this.renderer.gl.ARRAY_BUFFER, this.vbo);
        this.renderer.gl.bufferData(this.renderer.gl.ARRAY_BUFFER, new Float32Array(this.model.modelData), this.renderer.gl.STATIC_DRAW);
        //this.renderer.gl.vertexAttribPointer(positionAttribLoc, 3, this.renderer.gl.FLOAT, false, 0, 0);
        this.renderer.gl.vertexAttribPointer(positionAttribLoc, 3, this.renderer.gl.FLOAT, false, (10 * 4), 0);
        this.renderer.gl.enableVertexAttribArray(positionAttribLoc);
        this.renderer.gl.vertexAttribPointer(normalAttribLoc, 3, this.renderer.gl.FLOAT, false, (10 * 4), (3 * 4));
        this.renderer.gl.enableVertexAttribArray(normalAttribLoc);
        this.renderer.gl.vertexAttribPointer(colorAttribLoc, 4, this.renderer.gl.FLOAT, false, (10 * 4), (6 * 4));
        this.renderer.gl.enableVertexAttribArray(colorAttribLoc);

        // ------------ instancing here

        // setup matrixes, one per instance
        const numInstances = NUM_CUBIES;
        // make a typed array with one view per matrix
        this.matrixData = new Float32Array(numInstances * 16);
        this.cubieTransforms = [];
        for (let i = 0; i < numInstances; ++i) 
        {
            const byteOffsetToMatrix = i * 16 * 4;
            const numFloatsForView = 16;
            this.cubieTransforms.push(new Float32Array(
                this.matrixData.buffer,
                byteOffsetToMatrix,
                numFloatsForView));
        }

        let matricesIndexOffset = 0;
        for (let i = 0; i < this.cubieTransforms.length / rubicksLenSquared; i++)
        {
            for(let j = 0; j < this.cubieTransforms.length / rubicksLenSquared; j++)
            {
                for( let k = 0; k < this.cubieTransforms.length / rubicksLenSquared; k++)
                {
                    let transform = mat4.create();
                    mat4.translate(this.cubieTransforms[matricesIndexOffset],
                                   transform,
                                   [i * deltaLen - deltaLen, j * deltaLen -deltaLen, k * deltaLen -deltaLen]
                                  );
                    
                    matricesIndexOffset++;
                }
            }
        }

        this.matrixBuffer = this.renderer.gl.createBuffer();
        this.renderer.gl.bindBuffer(this.renderer.gl.ARRAY_BUFFER, this.matrixBuffer);
        
        // just allocate the buffer
        //this.renderer.gl.bufferData(this.renderer.gl.ARRAY_BUFFER, this.matrixData.byteLength, this.renderer.gl.DYNAMIC_DRAW);
        this.renderer.gl.bufferData(this.renderer.gl.ARRAY_BUFFER, this.matrixData, this.renderer.gl.DYNAMIC_DRAW);

        // set all 4 attributes for matrix, 4 x 4 vec4()
        const bytesPerMatrix = 4 * 16;
        for (let i = 0; i < 4; ++i) {
            const loc = modelMatrixAttribLoc + i;
            this.renderer.gl.enableVertexAttribArray(loc);
            // note the stride and offset
            const offset = i * 16;  // 4 floats per row, 4 bytes per float
            this.renderer.gl.vertexAttribPointer(
                loc,              // location
                4,                // size (num values to pull from buffer per iteration)
                this.renderer.gl.FLOAT,         // type of data in buffer
                false,            // normalize
                bytesPerMatrix,   // stride, num bytes to advance to get to next set of values
                offset,           // offset in buffer
            );
            // this line says this attribute only changes for each 1 instance
            this.renderer.gl.vertexAttribDivisor(loc, 1);
        }
       
        // // upload the new matrix data
        // this.renderer.gl.bindBuffer(this.renderer.gl.ARRAY_BUFFER, this.matrixBuffer);
        // this.renderer.gl.bufferSubData(this.renderer.gl.ARRAY_BUFFER, 0, this.matrixData);
    }
    setProgram()
    {
        //this.program = createProgramFromSources(this.renderer.gl, cubieDiffSpecVS, cubieDiffSpecFS);
        this.program = createProgramFromSources(this.renderer.gl, cubieDiffSpecVS, cubieDiffSpecFS);
        this.uniforms = 
        { 
            resolution: this.renderer.gl.getUniformLocation(this.program, "resolution"),
            time: this.renderer.gl.getUniformLocation(this.program, "time"),
            viewPos: this.renderer.gl.getUniformLocation(this.program, "viewPos"),
            view: this.renderer.gl.getUniformLocation(this.program, "view"),
            projection: this.renderer.gl.getUniformLocation(this.program, "projection")
        };
    }

    render(time)
    {
        this.renderer.gl.bindVertexArray(this.vao);
        this.renderer.gl.useProgram(this.program);
        //
        this.renderer.gl.uniform1f(this.uniforms["time"], time);
        this.renderer.gl.uniform2f(this.uniforms["resolution"], this.renderer.gl.canvas.width / 1., this.renderer.gl.canvas.height / 1.);
        this.renderer.gl.uniform3f(this.uniforms["viewPos"], this.renderer.pos[0], this.renderer.pos[1], this.renderer.pos[2]);        
        this.renderer.gl.uniformMatrix4fv(this.uniforms["view"], false, this.renderer.view); 
        this.renderer.gl.uniformMatrix4fv(this.uniforms["projection"], false, this.renderer.projection);
        //
        //this.renderer.gl.drawArrays(this.primitiveType, 0, this.vertCount);
        this.renderer.gl.drawArraysInstanced(this.primitiveType, 0, this.vertCount, NUM_CUBIES);
    }
}