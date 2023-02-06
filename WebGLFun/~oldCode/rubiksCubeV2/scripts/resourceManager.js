/*
    A one off thing to hold 
*/

class ResourceManager
{
    constructor(gl)
    {
        this.gl = gl;
        this.instancedRenderables = [];
        this.renderables = [];

        this.model;
        //makeTheGUI();
    }
    init()
    {
        //  ---- Programs
        // -- Instanced Cubie
        var cubieProgram = createProgramFromSources(gl, cubieVS, cubieFS);
        var cubieProgramUTime = gl.getUniformLocation(cubieProgram, "time");
        var cubieProgramUResolution = gl.getUniformLocation(cubieProgram, "resoluton");
        var cubieProgramUView = gl.getUniformLocation(cubieProgram, "view");
        var cubieProgramUProjection = gl.getUniformLocation(cubieProgram, "projection");

        // //  -- Instanced PBR Cubie
        // var rubicksPBRProgram = createProgramFromSources(this.gl, cubiePBR_VS, cubiePBR_FS);
        // var rubicksPBRProgramUResolution = this.gl.getUniformLocation(rubicksPBRProgram, "resolution");
        // var rubicksPBRProgramUTime = this.gl.getUniformLocation(rubicksPBRProgram, "time");
        // var rubicksPBRProgramUCamPos = this.gl.getUniformLocation(rubicksPBRProgram, "camPos");
        // var rubicksPBRProgramUModel = this.gl.getUniformLocation(rubicksPBRProgram, "model");
        // var rubicksPBRProgramUView = this.gl.getUniformLocation(rubicksPBRProgram, "view");
        // var rubicksPBRProgramUProjection = this.gl.getUniformLocation(rubicksPBRProgram, "projection");

        //  ---- Model Parser
        // -- #-- This has global scope variables theVertAttribDataToSend & thePlyVertCount - change this
        //testPlyParser();
        this.model = plyParser2(highPolyCubie);

        //  ---- VAOs & Push to Render Queue
        var cubieVAO = gl.createVertexArray();
        gl.bindVertexArray(cubieVAO);
        var cubieVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubieVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.model.modelData), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(positionAttribLoc, 3, this.gl.FLOAT, false, (10 * 4), 0);
        this.gl.enableVertexAttribArray(positionAttribLoc);
        this.gl.vertexAttribPointer(normalAttribLoc, 3, this.gl.FLOAT, false, (10 * 4), (3 * 4));
        this.gl.enableVertexAttribArray(normalAttribLoc);
        this.gl.vertexAttribPointer(colorAttribLoc, 4, this.gl.FLOAT, false, (10 * 4), (6 * 4));
        this.gl.enableVertexAttribArray(colorAttribLoc);

        //
        const cubieModelAttribData = new Float32Array(numCubies * 16); // 16 floats per mat4, 
        const cubieModelData = [];

        for (let i = 0; i < numCubies; i++) 
        {
            const byteOffsetToMatrix = i * 16 * 4; // 4 bytes per float, each mat4 has 16 floats
            const numFloatsForView = 16;
            // new Float32Array(buffer [, byteOffset [, length]]);
            cubieModelData.push
                (
                    new Float32Array
                        (
                        cubieModelAttribData.buffer,
                        byteOffsetToMatrix,
                        numFloatsForView
                        )
                );
        }
    
        // ---------------- Make the transform attrib data
        // for each z layer
        let cubeDataIndexOffset = 0;
        for (let i = 0; i < cubieModelData.length / rubicksLenSquared; i++)
        {
            for(let j = 0; j < cubieModelData.length / rubicksLenSquared; j++)
            {
                for( let k = 0; k < cubieModelData.length / rubicksLenSquared; k++)
                {
                    let tt = mat4.create();
                    mat4.translate(cubieModelData[cubeDataIndexOffset],
                                   tt,
                                  [i * deltaLen - deltaLen, j * deltaLen -deltaLen, k * deltaLen -deltaLen]
                                  );
                    
                    cubeDataIndexOffset++;
                }
            }
        }
        
        // ---------------- Set the transform attrib
        const cubieModelVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubieModelVBO);
        //  gl.bufferData(gl.ARRAY_BUFFER, cubieModelAttribData.byteLength, gl.DYNAMIC_DRAW);
        gl.bufferData(gl.ARRAY_BUFFER, cubieModelAttribData, gl.DYNAMIC_DRAW);

        // ---- if we need to change the transform data, can be done in real time if gl draw hint is set to gl.DYNAMIC_DRAW:
        // gl.bindBuffer(gl.ARRAY_BUFFER, cubieModelVBO);
        // gl.bufferSubData(gl.ARRAY_BUFFER, 0, cubieModelAttribData);

        // ---------------- Init model attribute ----------------
        // set all 4 attributes for model attribute; mat4 in glsl is actually 4 vec4s
        for (let i = 0; i < 4; ++i)
        {
            const attribLocation = modelAttribLoc + i;
            gl.enableVertexAttribArray(attribLocation);
            // note the stride and offset
            const offset = i * 16;  // 4 floats per row, 4 bytes per float
            gl.vertexAttribPointer(
                attribLocation,   // location
                4,                // size (num values to pull from buffer per iteration)
                gl.FLOAT,         // type of data in buffer
                false,            // normalize
                bytesPerMatrix,   // stride, num bytes to advance to get to next set of values
                offset,           // offset in buffer
            );
            // this line says this attribute only changes for each 1 instance
            gl.vertexAttribDivisor(attribLocation, 1);
        }

        this.instancedRenderables.push(
            {tag: "cubie",
            vao: cubieVAO,
            attribMatrixData: cubieModelData,
            fl32: cubieModelAttribData,
            primitiveType: gl.TRIANGLES,
            numInstances: numCubies,
            vertCount: this.model.vertCount,
            program: cubieProgram,
            uniformLocations: { resolution: cubieProgramUResolution,
                                time: cubieProgramUTime,
                                view: cubieProgramUView,
                                projection: cubieProgramUProjection
                            }
            });
        // this.instancedRenderables.push(
        //     {tag: "cubie",
        //     vao: cubieVAO,
        //     attribMatrixData: cubieModelData,
        //     fl32: cubieModelAttribData,
        //     primitiveType: gl.TRIANGLES,
        //     numInstances: numCubies,
        //     vertCount: thePlyVertCount,
        //     program: rubicksPBRProgram,
        //     uniformLocations: {resolution: rubicksPBRProgramUResolution,
        //                         time: rubicksPBRProgramUTime,
        //                         camPos: rubicksPBRProgramUCamPos,
        //                         model: rubicksPBRProgramUModel,
        //                         view: rubicksPBRProgramUView,
        //                         projection: rubicksPBRProgramUProjection
        //                     }
        //     });
    }
}