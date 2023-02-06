class InputManager
{
    constructor(gl, aRenderer)
    {
        this.gl = gl;
        this.renderer = aRenderer;
        this.selectionSwitch = false;
        this.firstMouseBtnRayCastSwitch = false;
        this.clickRayDirWorld = vec3.create();
        
        this.theSelectedIndex;
        this.theSubArr = new Float32Array(16); // When called with a length argument, an internal array buffer is created in memory, of size length multiplied by BYTES_PER_ELEMENT bytes, containing zeros.
        
        this.totalAngle = 0;
        this.rotationSwitch = false;
        this.rotationSign = -1;
        this.matrixTranslationIndexNum = 14;
        this.rotationAxis;

        window.addEventListener( "mousedown", this.mouseDown);
        window.addEventListener( "mousemove", this.mouseMove);
        window.addEventListener( "mouseup", this.mouseUp);
    }
    mouseDown = event => 
    {
        // Normalized mouse coords
        let mouseClickX = event.offsetX;
        mouseClickX = (2. * mouseClickX / gl.canvas.width - 1.);
        let mouseClickY = event.offsetY;
        mouseClickY = -1 * (2. * mouseClickY / gl.canvas.height - 1.);

        // #---------- RAY CASTING -------------#
        // RAY IN NDC SPACE
        let ray_clip = vec4.fromValues(mouseClickX, mouseClickY, -1.0, 1.0);
        let inverseProjectionMatrix = mat4.create();
        mat4.invert(inverseProjectionMatrix, this.renderer.projection);

        vec4.transformMat4(ray_clip, ray_clip, inverseProjectionMatrix);
        // we only needed to un-project the x,y part,
        // so let's manually set the z, w part to mean "forwards, and not a point
        let ray_eye = vec4.fromValues(ray_clip[0], ray_clip[1], -1.0, 0.0);

        let inverseViewMatrix = mat4.create();
        mat4.invert(inverseViewMatrix, this.renderer.view);
        let tmp = vec4.create();
        vec4.transformMat4(tmp, ray_eye, inverseViewMatrix);
        this.clickRayDirWorld = vec3.fromValues(tmp[0], tmp[1], tmp[2]);

        vec3.normalize(this.clickRayDirWorld, this.clickRayDirWorld);

        // check to see if it intersects the cube at all:
        // see settings for cubeBoxObj
        let intersectionObj = aabbRayIntersect(cubeBoxObj, {ro: this.renderer.pos, rd: this.clickRayDirWorld})
        
        if(intersectionObj.hit)
        {   
            // if there's a ray intersection with the cube, check which cubie got hit 
            if(!this.selectionSwitch)
            {
                this.selectionSwitch = true;
                let hitIndices = [];
                let hitCount = 0;
                for(let i = 0; i < numCubies; i++)
                {
                    // each aabb is just the aabb of a unit cubie translated by the cubie's translation
                    let A = [-1, -1, 1, 1];
                    let B = [1, 1, -1, 1];
                    vec4.transformMat4(A, A, this.renderer.instancedRenderables[0].attribMatrixData[i]);
                    vec4.transformMat4(B, B, this.renderer.instancedRenderables[0].attribMatrixData[i]);
                    
                    let secondIntersectionObj = aabbRayIntersect({A: A, B: B}, {ro: this.renderer.pos, rd: this.clickRayDirWorld});
                    if(secondIntersectionObj.hit)
                    {
                        hitCount++;
                        hitIndices.push(i);
                        if(hitCount >= 2 * rubicksLen)
                        {
                            // no need to collect more than the diagonal cross section num cubes
                            break;
                        }
                    }
                }

                let theDist;
                for(let i = 0; i < hitIndices.length; i++)
                {
                    //console.log(hitIndices[i]);
                    let x = this.renderer.instancedRenderables[0].attribMatrixData[hitIndices[i]][12];
                    let y = this.renderer.instancedRenderables[0].attribMatrixData[hitIndices[i]][13];
                    let z = this.renderer.instancedRenderables[0].attribMatrixData[hitIndices[i]][14];
                    
                    let cubiePos = vec4.fromValues(x, y, z, 1); // using vec4 because camera is a vec4 for affine transformations
                    let dist = vec4.squaredDistance(cubiePos, this.renderer.pos);

                    if(i == 0)
                    {
                        theDist = dist;
                        //console.log(theDist);
                        this.theSelectedIndex = hitIndices[i];
                        //console.log(hitIndices[i]); 
                    }
                    else
                    {
                        if(dist < theDist)
                        {
                            theDist = dist
                            //console.log(theDist);
                            this.theSelectedIndex = hitIndices[i];
                            //console.log(hitIndices[i]);
                        }
                    }
                }
                // console.log(
                //     "#------------------------#\n" +
                //     this.theSelectedIndex +   "\n"   + 
                //     this.renderer.instancedRenderables[0].attribMatrixData[this.theSelectedIndex][12] + ", " +
                //     this.renderer.instancedRenderables[0].attribMatrixData[this.theSelectedIndex][13] + ", " +
                //     this.renderer.instancedRenderables[0].attribMatrixData[this.theSelectedIndex][14]
                // );
            }
        }
        else
        {
            this.firstMouseBtnRayCastSwitch = true;
        }
    }
    mouseMove = event => 
    {
        // ---- Camera Rotation
        if(this.firstMouseBtnRayCastSwitch)
        {
            let mousePosX = event.offsetX;
            mousePosX = (2. * mousePosX / gl.canvas.width - 1.);
            let mousePosY = event.offsetY;
            mousePosY = -1 * (2. * mousePosY / gl.canvas.height - 1.);

            // #---------- RAY CASTING -------------#
            // RAY IN NDC SPACE
            let ray_clip = vec4.fromValues(mousePosX, mousePosY, -1.0, 1.0);
            let inverseProjectionMatrix = mat4.create();
            mat4.invert(inverseProjectionMatrix, this.renderer.projection);

            vec4.transformMat4(ray_clip, ray_clip, inverseProjectionMatrix);
            // we only needed to un-project the x,y part,
            // so let's manually set the z, w part to mean "forwards, and not a point
            let ray_eye = vec4.fromValues(ray_clip[0], ray_clip[1], -1.0, 0.0);

            let inverseViewMatrix = mat4.create();
            mat4.invert(inverseViewMatrix, this.renderer.view);
            let tmp = vec4.create();
            vec4.transformMat4(tmp, ray_eye, inverseViewMatrix);
            let rayDirWorld = vec3.fromValues(tmp[0], tmp[1], tmp[2]);

            let angle = vec3.angle(this.clickRayDirWorld, rayDirWorld);

            // easing function for angle as a function of camera radius
            // simple lerping (1-interpolatingVal)min + interpolatingVal * max
            let camRadius = vec3.create();
            vec3.subtract(camRadius, [this.renderer.pos[0], this.renderer.pos[1], this.renderer.pos[2]], this.renderer.target); 
            let len = vec3.length(camRadius)
            let interopolatingVal = Math.min(1, len/this.renderer.maxRadius);
            angle = (1 - interopolatingVal)*(angle/4) + interopolatingVal * (angle/2);

            let mouseMoveRotionAxis = vec3.create();
            vec3.cross(mouseMoveRotionAxis, this.clickRayDirWorld, rayDirWorld);

            let rotMat = mat4.create();
            mat4.rotate(rotMat, rotMat, angle, mouseMoveRotionAxis);
            vec4.transformMat4(this.renderer.up, this.renderer.up, rotMat);
            vec4.transformMat4(this.renderer.pos, this.renderer.pos, rotMat);
            
            // we need to get the angle per mouse move, --> set the vector from last
            // move to this vector so the next mouse move calculation is possible
            this.clickRayDirWorld = rayDirWorld;
        }
        // #---------- Rubiks Rotation ---------- #
        if(this.selectionSwitch == true)
        {
            let mousePosX = event.offsetX;
            mousePosX = (2. * mousePosX / gl.canvas.width - 1.);
            let mousePosY = event.offsetY;
            mousePosY = -1 * (2. * mousePosY / gl.canvas.height - 1.);

            // #---------- RAY CASTING -------------#
            // RAY IN NDC SPACE
            let ray_clip = vec4.fromValues(mousePosX, mousePosY, -1.0, 1.0);
            let inverseProjectionMatrix = mat4.create();
            mat4.invert(inverseProjectionMatrix, this.renderer.projection);

            vec4.transformMat4(ray_clip, ray_clip, inverseProjectionMatrix);
            // we only needed to un-project the x,y part,
            // so let's manually set the z, w part to mean "forwards, and not a point
            let ray_eye = vec4.fromValues(ray_clip[0], ray_clip[1], -1.0, 0.0);

            let inverseViewMatrix = mat4.create();
            mat4.invert(inverseViewMatrix, this.renderer.view);
            let tmp = vec4.create();
            vec4.transformMat4(tmp, ray_eye, inverseViewMatrix);
            let rayDirWorld = vec3.fromValues(tmp[0], tmp[1], tmp[2]);

            let angle = vec3.angle(this.clickRayDirWorld, rayDirWorld) * rotationSpeedMultiplier;
            this.totalAngle += angle;
            let rotMat = mat4.create();

            if(this.totalAngle >= angleThreshold)
            {
                if(this.rotationSwitch == false)
                {
                    let dif = vec3.create();
                    dif = vec3.sub(dif, rayDirWorld, this.clickRayDirWorld);
                    vec3.normalize(dif, dif);
                    vec3.round(dif, dif);
                    console.log(dif);

                    switch(this.matrixTranslationIndexNum)
                    {
                        case 12:
                            this.rotationAxis = "x";
                            mat4.rotateX(rotMat, rotMat, this.rotationSign * angle);
                            break;
                        case 13:
                            this.rotationAxis = "y";
                            mat4.rotateY(rotMat, rotMat, this.rotationSign * angle);
                            break;
                        case 14:
                            this.rotationAxis = "z";
                            mat4.rotateZ(rotMat, rotMat, this.rotationSign * angle);
                            break;
                    }
                    this.rotationSwitch = true;
                }
                else
                {
                    switch(this.rotationAxis)
                    {
                        case "x":
                            mat4.rotateX(rotMat, rotMat, this.rotationSign * angle);
                            break;
                        case "y":
                            mat4.rotateY(rotMat, rotMat, this.rotationSign * angle);
                            break;
                        case "z":
                            mat4.rotateZ(rotMat, rotMat, this.rotationSign * angle);
                            break;
                        default:
                            break;
                    }
                }
            }

            // go through cubie list and hit each that agrees with selectedIndex with the rotation matrix
            let count = 0;
            //console.log(this.renderer.instancedRenderables[0].attribMatrixData[this.theSelectedIndex][12]);

            for(let i = 0; i < numCubies; i++)
            {
                // if the cubie matrix's x-translation matches the selected cubie's matrix's x-translation
                if( Math.abs(
                    this.renderer.instancedRenderables[0].attribMatrixData[i][this.matrixTranslationIndexNum]
                    -
                    this.renderer.instancedRenderables[0].attribMatrixData[this.theSelectedIndex][this.matrixTranslationIndexNum]) 
                    < epsilon)
                {
                    count++;
                    // transform matrix with rotation
                    mat4.multiply(this.renderer.instancedRenderables[0].attribMatrixData[i], rotMat, this.renderer.instancedRenderables[0].attribMatrixData[i]);
                    for(let j = 0; j < 16; j++)
                    {
                        // index into float32 array to the matrix in question
                        //this.renderer.instancedRenderables[0].fl32[(i * 16) + j] = this.renderer.instancedRenderables[0].attribMatrixData[i][j];
                        // faster and easier, just update a substitue matrix fl32 and then offset into buffer correctly and replace one matrix instead of 27:
                        this.theSubArr[j] = this.renderer.instancedRenderables[0].attribMatrixData[i][j];
                    }
                    //gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.renderer.instancedRenderables[0].fl32);
                    gl.bufferSubData(gl.ARRAY_BUFFER, i * 16 * 4, this.theSubArr);
                }
                // no need to do more than 9 cubes, this will only help us if selectedIndex is in the first or second 9
                if(count >= 9)
                {
                    break;
                }
            }
            // we need to get the angle per mouse move, --> set the vector from last
            // move to this vector so the next mouse move calculation is possible
            this.clickRayDirWorld = rayDirWorld;
        }
    }
    mouseUp = e => 
    {
        // camera rotation:
        if(this.firstMouseBtnRayCastSwitch == true)
        {
            this.firstMouseBtnRayCastSwitch = false;
        }

        // cube rotation: 
        if(this.selectionSwitch)
        {
            

            this.selectionSwitch = false;
            this.rotationSwitch = false;

            let rotMat = mat4.create();
            let alpha = Math.round((toDegrees(this.totalAngle - angleThreshold) % 90.0));
            

            let beta = (90.0) - Math.abs(alpha);
            let theRotationSign = Math.sign(this.totalAngle);
            let rotAngle = Math.min(alpha, beta);

            // rotate the other way if not closer to pi halves in rotation dir
            if( rotAngle == beta)
            {
                theRotationSign *= -1;
            }

            //let theRotationSign = Math.sign(this.totalAngle - angleThreshold);
            // switch(this.rotationAxis)
            // {
            //     case "x":
            //         mat4.rotateX(rotMat, rotMat,  rotAngle);
            //         //this.matrixTranslationIndexNum = 12;
            //         break;
            //     case "y":
            //         mat4.rotateY(rotMat, rotMat,  rotAngle);
            //         //this.matrixTranslationIndexNum = 13;
            //         break;
            //     case "z":
            //         mat4.rotateZ(rotMat, rotMat,  rotAngle);
            //         //this.matrixTranslationIndexNum = 14;
            //         break;
            //     default:
            //         break;
            // }
            mat4.rotateZ(rotMat, rotMat, theRotationSign * toRadians(rotAngle));
            let count = 0;
            for(let i = 0; i < numCubies; i++)
            {
                // if the cubie matrix's x-translation matches the selected cubie's matrix's x-translation
                if( Math.abs(
                    this.renderer.instancedRenderables[0].attribMatrixData[i][this.matrixTranslationIndexNum]
                    -
                    this.renderer.instancedRenderables[0].attribMatrixData[this.theSelectedIndex][this.matrixTranslationIndexNum]) 
                    < epsilon)
                {
                    count++;
                    // transform matrix with rotation
                    mat4.multiply(this.renderer.instancedRenderables[0].attribMatrixData[i], rotMat, this.renderer.instancedRenderables[0].attribMatrixData[i]);
                    for(let j = 0; j < 16; j++)
                    {
                        // index into float32 array to the matrix in question
                        //this.renderer.instancedRenderables[0].fl32[(i * 16) + j] = this.renderer.instancedRenderables[0].attribMatrixData[i][j];
                        // faster and easier, just update a substitue matrix fl32 and then offset into buffer correctly and replace one matrix instead of 27:
                        this.theSubArr[j] = this.renderer.instancedRenderables[0].attribMatrixData[i][j];
                    }
                    //gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.renderer.instancedRenderables[0].fl32);
                    gl.bufferSubData(gl.ARRAY_BUFFER, i * 16 * 4, this.theSubArr);
                }
                // no need to do more than 9 cubes, this will only help us if selectedIndex is in the first or second 9
                if(count >= 9)
                {
                    break;
                }
            }
            this.totalAngle = 0;
        }
    }
}