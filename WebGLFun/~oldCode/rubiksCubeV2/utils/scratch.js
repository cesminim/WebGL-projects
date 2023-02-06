// let rotDirVec = vec3.create();
                // vec3.subtract(rotDirVec, rayDirWorld, this.clickRayDirWorld);
                // vec3.normalize(rotDirVec, rotDirVec);
                // vec3.transformMat3(rotDirVec, rotDirVec, invertedStandardBasis);
                // //console.log(rotDirVec);
                // let x = Math.abs(rotDirVec[0]);
                // let y = Math.abs(rotDirVec[1]);
                // let z = Math.abs(rotDirVec[2]);

                // let biggestComp = Math.max(Math.max(x, y), z)
                // let smallestComp = Math.min(Math.min(x, y), z);
                // let middleComp = ((x + y + z) - biggestComp) - smallestComp;
                
                // if(biggestComp == Math.abs(rotDirVec[2]))
                // {
                //     if(middleComp == Math.abs(rotDirVec[1]))
                //     {
                //         this.rotationSign = Math.sign(rotDirVec[1]);
                //         this.rotationAxis = "x";
                //         mat4.rotateX(rotMat, rotMat, this.rotationSign * angle);
                //     }
                //     else if(middleComp == Math.abs(rotDirVec[0]))
                //     {
                //         this.rotationSign = Math.sign(rotDirVec[0]);
                //         this.rotationAxis = "y";
                //         mat4.rotateY(rotMat, rotMat, this.rotationSign * angle);
                //     }
                // }
                // else if(biggestComp == Math.abs(rotDirVec[1]))
                // {
                //     if(middleComp == Math.abs(rotDirVec[0]))
                //     {
                //         this.rotationSign = Math.sign(rotDirVec[0]);
                //         this.rotationAxis = "z";
                //         mat4.rotateZ(rotMat, rotMat, this.rotationSign * angle);
                //     }
                //     else if(middleComp == Math.abs(rotDirVec[2]))
                //     {
                //         this.rotationSign = Math.sign(rotDirVec[2]);
                //         this.rotationAxis = "x";
                //         mat4.rotateX(rotMat, rotMat, this.rotationSign * angle);
                //     }
                // }
                // else if(biggestComp == Math.abs(rotDirVec[0]))
                // {
                //     if(middleComp == Math.abs(rotDirVec[1]))
                //     {
                //         this.rotationSign = Math.sign(rotDirVec[1]);
                //         this.rotationAxis = "z";
                //         mat4.rotateZ(rotMat, rotMat, this.rotationSign * angle);
                //     }
                //     else if(middleComp == Math.abs(rotDirVec[2]))
                //     {
                //         this.rotationSign = Math.sign(rotDirVec[2]);
                //         this.rotationAxis = "y";
                //         mat4.rotateY(rotMat, rotMat, this.rotationSign * angle);
                //     }
                // }

    // -----------------------
    // if(this.renderer.instancedRenderables[0].attribMatrixData[i][this.matrixTranslationIndexNum] == 
    //     this.renderer.instancedRenderables[0].attribMatrixData[this.theSelectedIndex][this.matrixTranslationIndexNum]){}