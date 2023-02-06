/*
 * Decoupling managed cubies and renderer seems like a better call, but there's only one managed object so, change
 * --> e.g. vec4.transformMat4(A, A, this.renderer.renderables[0].cubieTransforms[i]);
 * later if you have time/interest
 */

class InputManager
{
    constructor(aRenderer)
    {
        this.renderer = aRenderer;
        this.gl = aRenderer.gl;

        this.cubeSelected = false;
        this.rotationDecided = false;
        //
        this.selectedCubiePos
        this.theSelectedIndex;
        //
        this.firstSideIntersection;
        this.secondSideIntersection;
        //
        this.totalAngle;
        this.angleSign = 1;
        //
        this.angleThreshold = toRadians(5);
        this.matrixTranslationIndexNum;
        this.theSubArr = new Float32Array(16);
        //
        this.firstMouseBtnRayCastSwitch = false;
        this.cameraRay = vec3.create();

        window.addEventListener( "mousedown", this.mouseDown);
        window.addEventListener( "mousemove", this.mouseMove);
        window.addEventListener( "mouseup", this.mouseUp);
    }

    mouseDown = event => 
    {
        // get world ray from camera
        cameraRay(event, this.renderer, this.cameraRay);

        // check to see if this ray intersects the cube at all:
        // see settings for cubeBoxObj
        let intersectionObj = aabbRayIntersect(cubeBoxObj, {ro: this.renderer.pos, rd: this.cameraRay})
        
        if(intersectionObj.hit)
        {
            // if there's a ray intersection with the cube, check which cubie got hit
            // make sure the cube hasn't already been selected
            if(!this.cubeSelected)
            {
                this.cubeSelected = true;
                this.totalAngle = 0;
                let hitIndices = [];
                let hitCount = 0;
                for(let i = 0; i < NUM_CUBIES; i++)
                {
                    // each aabb is just the aabb of a unit cube transformed by the cubie's transform
                    let A = [-1, -1, 1, 1]; // one corner's vec4(pos, 1)
                    let B = [1, 1, -1, 1]; // the other corener's vec4(pos, 1)

                    vec4.transformMat4(A, A, this.renderer.renderables[0].cubieTransforms[i]);
                    vec4.transformMat4(B, B, this.renderer.renderables[0].cubieTransforms[i]);
                    
                    let secondIntersectionObj = aabbRayIntersect({A: A, B: B}, {ro: this.renderer.pos, rd: this.cameraRay});
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
                
                // find which of the ray-box intersections is the shortest
                let theDist;
                for(let i = 0; i < hitIndices.length; i++)
                {
                    // console.log(hitIndices[i]);
                    let x = this.renderer.renderables[0].cubieTransforms[hitIndices[i]][12];
                    let y = this.renderer.renderables[0].cubieTransforms[hitIndices[i]][13];
                    let z = this.renderer.renderables[0].cubieTransforms[hitIndices[i]][14];
                    
                    let cubiePos = vec4.fromValues(x, y, z, 1); // using vec4 because camera is a vec4 for affine transformations
                    let dist = vec4.squaredDistance(cubiePos, this.renderer.pos);

                    if(i == 0)
                    {
                        theDist = dist;
                        // console.log(theDist);
                        this.theSelectedIndex = hitIndices[i];
                        // console.log(hitIndices[i]); 
                    }
                    else
                    {
                        if(dist < theDist)
                        {
                            theDist = dist
                            // console.log(theDist);
                            this.theSelectedIndex = hitIndices[i];
                            // console.log(hitIndices[i]);
                        }
                    }
                }
                
                // console.log(
                //     "#------------------------#\n" +
                //     this.theSelectedIndex +   "\n"   + 
                //     this.renderer.renderables[0].cubieTransforms[this.theSelectedIndex][12] + ", " +
                //     this.renderer.renderables[0].cubieTransforms[this.theSelectedIndex][13] + ", " +
                //     this.renderer.renderables[0].cubieTransforms[this.theSelectedIndex][14]
                // );
            }
            this.selectedCubiePos = vec3.fromValues(this.renderer.renderables[0].cubieTransforms[this.theSelectedIndex][12],
                           this.renderer.renderables[0].cubieTransforms[this.theSelectedIndex][13],
                           this.renderer.renderables[0].cubieTransforms[this.theSelectedIndex][14])
            this.firstSideIntersection = rayCubieSideIntersection(this.selectedCubiePos, [this.renderer.pos[0], this.renderer.pos[1], this.renderer.pos[2]], this.cameraRay);
            // console.log(vec3.str(this.selectedCubiePos));
            //console.log("the first intersection:  " + vec3.str(this.firstSideIntersection));
        }
        else
        {
            this.firstMouseBtnRayCastSwitch = true;
        }
    }
    mouseMove = event => 
    {
        if(this.cubeSelected)
        {
            // if a rotation has been made, just turn according to the angle scalar betwen rays
            
            let camRay = vec3.create();
            cameraRay(event, this.renderer, camRay);
            let angle = 2. * this.angleSign * vec3.angle(this.cameraRay, camRay);
            this.totalAngle += angle;
            
            let rotationMat = mat4.create();

            if(this.rotationDecided && this.matrixTranslationIndexNum)
            {
                //rotateCubePlane(this.renderer, angle, this.theSubArr, this.theSelectedIndex, this.matrixTranslationIndexNum);
               
                switch(this.matrixTranslationIndexNum) 
                {
                    case 12:
                        mat4.rotateX(rotationMat, rotationMat, angle);
                        break;
                    case 13:
                        mat4.rotateY(rotationMat, rotationMat, angle);
                        break;
                    case 14:
                        mat4.rotateZ(rotationMat, rotationMat, angle);
                        break;
                    default:
                        console.log("some strange matrix index was given to mouseMove")
                }

                // go through cubie list and hit each that agrees with selectedIndex with the rotation matrix
                let count = 0;
                //console.log(this.renderer.instancedRenderables[0].attribMatrixData[this.theSelectedIndex][12]);

                for(let i = 0; i < NUM_CUBIES; i++)
                {
                    // if the cubie matrix's x||y||z translation matches the selected cubie's matrix's x||y||z translation, rotate it
                    // beware of floating point errors
                    if( this.renderer.renderables[0].cubieTransforms[i                    ][this.matrixTranslationIndexNum] == 
                        this.renderer.renderables[0].cubieTransforms[this.theSelectedIndex][this.matrixTranslationIndexNum]
                      )
                    {
                        count++;
                        // transform matrix with rotation
                        mat4.multiply(this.renderer.renderables[0].cubieTransforms[i], rotationMat, this.renderer.renderables[0].cubieTransforms[i]);
                        
                         // Round to nearest integer to avoid floating point errors
                        // for( let k = 0; k < 15; k++)
                        // {
                        //     this.renderer.renderables[0].cubieTransforms[i][k] = Math.round(this.renderer.renderables[0].cubieTransforms[i][k]);
                        // }

                        for(let j = 0; j < 16; j++)
                        {
                            // index into float32 array to the matrix in question
                            // this.renderer.instancedRenderables[0].fl32[(i * 16) + j] = this.renderer.renderables[0].cubieTransforms[i][j];
                            // faster and easier, just update a substitue matrix fl32 and then offset into buffer correctly and replace one matrix instead of 27:
                            this.theSubArr[j] = this.renderer.renderables[0].cubieTransforms[i][j];
                        }
                        
                        //gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.renderer.instancedRenderables[0].fl32);
                        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, i * 16 * 4, this.theSubArr);
                    }
                    // no need to do more than 9 cubes, this will only help us if selectedIndex is in the first or second 9
                    if(count >= 9)
                    {
                        break;
                    }
                }
            }
            // we only want to get rotation direction before rotating
            else
            {
                this.rotationDecided = true;
                // console.log("selectedCubiePos = " + this.selectedCubiePos);
                // console.log("the cam's pos:"  + this.renderer.pos[0] + ", " + this.renderer.pos[1] + ", "  + this.renderer.pos[2]);
                // console.log("the camera ray: " + vec3.str(camRay));

                this.secondSideIntersection = rayCubieSideIntersection(this.selectedCubiePos, [this.renderer.pos[0], this.renderer.pos[1], this.renderer.pos[2]], camRay);
                
                // Only continue if there's a second intersection point -- this is a literal edge case -- on edge of cube, there might not be a second intersection
                // ===================================
                if(this.secondSideIntersection)
                {
                    //console.log("the second intersection: " + vec3.str(this.secondSideIntersection));
                    let relativePosOnPlane = vec3.create();
                    vec3.subtract(relativePosOnPlane, this.secondSideIntersection, this.firstSideIntersection);
                    

                    // get basis components:
                    let xComp = Math.abs(vec3.dot(relativePosOnPlane, iBasis));
                    let yComp = Math.abs(vec3.dot(relativePosOnPlane, jBasis));
                    let zComp = Math.abs(vec3.dot(relativePosOnPlane, kBasis));

                    // ================================================
                    // Decide which plane we've hit
                    // 3 is a magic number and would change with a different model
                    
                    // if hitting right side of cube
                    if(this.firstSideIntersection[0] == 3)
                    {
                        //console.log("zy")
                        // vertical line
                        if(relativePosOnPlane[2] == 0)
                        {
                            //console.log("spin around z axis");
                            this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, jBasis));
                            this.matrixTranslationIndexNum = 14;
                        }
                        // horizontal line
                        else if(relativePosOnPlane[1] == 0)
                        {
                            //console.log("spin around y axis");
                            this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, kBasis));
                            this.angleSign *= -1;
                            this.matrixTranslationIndexNum = 13;
                        }
                        else
                        {
                            // some mixture of the two, decide whichever is largest to dictate terms
                            if(Math.max(zComp, yComp) == zComp)
                            {
                                //console.log("spin around y axis");
                                this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, kBasis));
                                this.angleSign *= -1;
                                this.matrixTranslationIndexNum = 13;
                            }
                            else
                            {
                                //console.log("spin around z axis");
                                this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, jBasis));
                                this.matrixTranslationIndexNum = 14;
                            }
                        }
                    }
                    // if hitting left side of cube
                    else if(this.firstSideIntersection[0] == -3)
                    {
                        //console.log("zy")
                        // vertical line
                        if(relativePosOnPlane[2] == 0)
                        {
                            //console.log("spin around z axis");
                            this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, jBasis));
                            this.angleSign *= -1;
                            this.matrixTranslationIndexNum = 14;
                        }
                        // horizontal line
                        else if(relativePosOnPlane[1] == 0)
                        {
                            //console.log("spin around y axis");
                            this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, kBasis));
                            this.matrixTranslationIndexNum = 13;
                        }
                        else
                        {
                            // some mixture of the two, decide whichever is largest to dictate terms
                            if(Math.max(zComp, yComp) == zComp)
                            {
                                //console.log("spin around y axis");
                                this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, kBasis));
                                this.matrixTranslationIndexNum = 13;
                            }
                            else
                            {
                                //console.log("spin around z axis");
                                this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, jBasis));
                                this.angleSign *= -1;
                                this.matrixTranslationIndexNum = 14;
                            }
                        }
                    }
                    // if hitting top of cube
                    else if(this.firstSideIntersection[1] == 3)
                    {
                        //console.log("xz")
                        // vertical line
                        if(relativePosOnPlane[0] == 0)
                        {
                            //console.log("spin around x axis");
                            this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, kBasis));
                            this.matrixTranslationIndexNum = 12;
                        }
                        // horizontal line
                        else if(relativePosOnPlane[2] == 0)
                        {
                            //console.log("spin around z axis");
                            this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, iBasis));
                            this.angleSign *= -1;
                            this.matrixTranslationIndexNum = 14;
                        }
                        else
                        {
                            // some mixture of the two, decide whichever is largest to dictate terms
                            if(Math.max(xComp, zComp) == zComp)
                            {
                                //console.log("spin around x axis");
                                this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, kBasis));
                                this.matrixTranslationIndexNum = 12;
                            }
                            else
                            {
                                //console.log("spin around z axis");
                                this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, iBasis));
                                this.angleSign *= -1;
                                this.matrixTranslationIndexNum = 14;
                            }
                        }
                    }
                    // if hitting bottom of cube
                    else if(this.firstSideIntersection[1] == -3)
                    {
                        //console.log("xz")
                        // vertical line
                        if(relativePosOnPlane[0] == 0)
                        {
                            //console.log("spin around x axis");
                            this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, kBasis));
                            this.angleSign *= -1;
                            this.matrixTranslationIndexNum = 12;
                        }
                        // horizontal line
                        else if(relativePosOnPlane[2] == 0)
                        {
                            //console.log("spin around z axis");
                            this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, iBasis));
                            this.matrixTranslationIndexNum = 14;
                        }
                        else
                        {
                            // some mixture of the two, decide whichever is largest to dictate terms
                            if(Math.max(xComp, zComp) == zComp)
                            {
                                //console.log("spin around x axis");
                                this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, kBasis));
                                this.angleSign *= -1;
                                this.matrixTranslationIndexNum = 12;
                            }
                            else
                            {
                                //console.log("spin around z axis");
                                this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, iBasis));
                                this.matrixTranslationIndexNum = 14;
                            }
                        }
                    }
                    // if hitting front of cube
                    else if(this.firstSideIntersection[2] == 3)
                    {
                        // We're hitting an xy plane at either + or 
                        //console.log("xy")
                        
                        // vertical line
                        if(relativePosOnPlane[0] == 0)
                        {
                            //console.log("spin around x axis");
                            this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, jBasis));
                            this.angleSign *= -1;
                            //console.log("vertical line case: " + this.angleSign);
                            this.matrixTranslationIndexNum = 12;
                        }
                        // horizontal line
                        else if(relativePosOnPlane[1] == 0)
                        {
                            //console.log("spin around y axis");
                            this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, iBasis));
                            //console.log("horizonatol line case: " + this.angleSign);
                            this.matrixTranslationIndexNum = 13;
                        }
                        else
                        {
                            // some mixture of the two, decide whichever is largest to dictate terms
                            if(Math.max(xComp, yComp) == yComp)
                            {
                                //console.log("spin around x axis");
                                this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, jBasis));
                                this.angleSign *= -1;
                                //console.log("more in y: " + this.angleSign);
                                this.matrixTranslationIndexNum = 12;
                            }
                            else
                            {
                                //console.log("spin around y axis");
                                this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, iBasis));
                                //console.log("more in x: " + this.angleSign);
                                this.matrixTranslationIndexNum = 13;
                            }
                        }
                    }
                    // if hitting back of cube
                    else if(this.firstSideIntersection[2] == -3)
                    {
                        // We're hitting an xy plane at either + or 
                        //console.log("xy")
                        
                        // vertical line
                        if(relativePosOnPlane[0] == 0)
                        {
                            //console.log("spin around x axis");
                            this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, jBasis));
                            //console.log("vertical line case: " + this.angleSign);
                            this.matrixTranslationIndexNum = 12;
                        }
                        // horizontal line
                        else if(relativePosOnPlane[1] == 0)
                        {
                            //console.log("spin around y axis");
                            this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, iBasis));
                            this.angleSign *= -1;
                            //console.log("horizonatol line case: " + this.angleSign);
                            this.matrixTranslationIndexNum = 13;
                        }
                        else
                        {
                            // some mixture of the two, decide whichever is largest to dictate terms
                            if(Math.max(xComp, yComp) == yComp)
                            {
                                //console.log("spin around x axis");
                                this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, jBasis));
                                //console.log("more in y: " + this.angleSign);
                                this.matrixTranslationIndexNum = 12;
                            }
                            else
                            {
                                //console.log("spin around y axis");
                                this.angleSign = Math.sign(vec3.dot(relativePosOnPlane, iBasis));
                                this.angleSign *= -1;
                                //console.log("more in x: " + this.angleSign);
                                this.matrixTranslationIndexNum = 13;
                            }
                        }
                    }
                }
            }
            this.cameraRay = camRay;
        }
        else if(this.firstMouseBtnRayCastSwitch)
        {
            let camRay = vec3.create();
            cameraRay(event, this.renderer, camRay);
            let angle = vec3.angle(this.cameraRay, camRay);

            // easing function for angle as a function of camera radius
            // simple lerping (1-interpolatingVal)min + interpolatingVal * max
            let camRadius = vec3.create();
            vec3.subtract(camRadius, [this.renderer.pos[0], this.renderer.pos[1], this.renderer.pos[2]], this.renderer.target); 
            let len = vec3.length(camRadius)
            let interopolatingVal = Math.min(1, len/this.renderer.maxRadius);
            angle = (1 - interopolatingVal)*(angle/4) + interopolatingVal * (angle/2);

            let mouseMoveRotionAxis = vec3.create();
            vec3.cross(mouseMoveRotionAxis, this.cameraRay, camRay);

            let rotMat = mat4.create();
            mat4.rotate(rotMat, rotMat, angle, mouseMoveRotionAxis);
            vec4.transformMat4(this.renderer.up, this.renderer.up, rotMat);
            vec4.transformMat4(this.renderer.pos, this.renderer.pos, rotMat);
            
            // we need to get the angle per mouse move, --> set the vector from last
            // move to this vector so the next mouse move calculation is possible
            this.cameraRay = camRay;
        }

    }
    mouseUp = event => 
    {
        // cube rotation:
        if(this.cubeSelected)
        {
            this.cubeSelected = false;
            if(this.rotationDecided && this.secondSideIntersection)
            {
                this.rotationDecided = false;
                let neededAngle = roundToNearest(this.totalAngle, Math.PI / 2);
                let rotAngle;
                if(this.totalAngle > neededAngle)
                {
                    rotAngle = -(this.totalAngle - neededAngle)
                }
                else
                {
                    rotAngle = (neededAngle - this.totalAngle)
                }
            
                rotateCubePlane(this.renderer, rotAngle, this.theSubArr, this.theSelectedIndex, this.matrixTranslationIndexNum);

                this.matrixTranslationIndexNum = undefined;
            }
        }

        // camera rotation:
        if(this.firstMouseBtnRayCastSwitch == true)
        {
            this.firstMouseBtnRayCastSwitch = false;
        }
    }
}