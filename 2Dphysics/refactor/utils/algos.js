/* 
    Check bounding circle radius squared of each polygon with every other polygon once
*/
function pseudoBroadPhase(arrOfPolys)
{
    for(let i = 0; i < arrOfPolys.length - 1; i++)
    {
        let j = i + 1;
        
        while(j < arrOfPolys.length)
        {
            let sqrdDist = vec3.squaredDistance(arrOfPolys[i].rigidBody.pos, arrOfPolys[j].rigidBody.pos);
            if(sqrdDist < Math.pow(arrOfPolys[i].rigidBody.radius + arrOfPolys[j].rigidBody.radius, 2))
            { 
                // narrow phase resolution
                // so, arrOfPolys[i].rigidBody is running into arrOfPolys[j].rigidBody
                let collisionObject = SAT(arrOfPolys[i].rigidBody, arrOfPolys[j].rigidBody);
                
                if(collisionObject.collision)
                {
                    arrOfPolys[j].rigidBody.translate(collisionObject.mvt);
                }
            }

            j += 1;
        }
    }
}

/* 
    Narrow Phase intersection test.

    * Create normalized axis from each edge of polygon.
    * Project each position vector of both polygons onto the axis.
    * Find max and min projections for each polygon and compare to see if they overlap.
    * If there are any non-overlapping projections, exit algorithm.
    
    aPolygon.vertices = [x0, y0, x1, y1 ... xN, yN]

    keep it D.R.Y --> nested function for projected length comparisons
*/
function SAT(polygonReferenceA, polygonReferenceB)
{
    // get the direction from the difference between the polygon positions
    let relativePosition = vec2.create();
    vec2.subtract(relativePosition,
                  vec2.fromValues(polygonReferenceB.pos[0], polygonReferenceB.pos[1]),
                  vec2.fromValues(polygonReferenceA.pos[0], polygonReferenceA.pos[1]));

    function projectedLengthComparison(polygonA, polygonB, mvtReference)
    {
        let overlapBool;
        let mvtMagnitude;
        let mvtDir = "vertices are wrong";

        for(let i = 0; i < polygonA.vertices.length; i++)
        {
            let edge;
            let normal;
            // edges and normals from first vertex until second to last vertex
            if(i < polygonA.vertices.length - 1)
            {
                edge = vec2.fromValues(polygonA.vertices[i + 1][0] - polygonA.vertices[i][0], 	
                                       polygonA.vertices[i + 1][1] - polygonA.vertices[i][1]);
                normal = vec2.fromValues(edge[1], -edge[0]);
            }
            // edge and normal from last vertex to first vertex
            else
            {
                edge = vec2.fromValues(polygonA.vertices[0][0] - polygonA.vertices[i][0], 	
                                       polygonA.vertices[0][1] - polygonA.vertices[i][1]);
                normal = vec2.fromValues(edge[1], -edge[0]);
            }

            // Create normalized axis from each edge of polygon 
            vec2.normalize(normal, normal);
            
            // Project each vertex's position vector of both polygons onto the axis.
            let minA;
            let maxA;
            for(let a in polygonA.vertices)
            {
                let vertexPositionVec = vec2.fromValues(polygonA.vertices[a][0], polygonA.vertices[a][1]);
                let projectedLen = vec2.dot(normal, vertexPositionVec);
                
                if(a == 0)
                {
                    minA = projectedLen;
                    maxA = projectedLen;
                }
                else
                {
                    minA = Math.min(projectedLen, minA);
                    maxA = Math.max(projectedLen, maxA);
                }
            }
            let minB;
            let maxB;
            for(let b in polygonB.vertices)
            {
                let vertexPositionVec = vec2.fromValues(polygonB.vertices[b][0], polygonB.vertices[b][1]);
                let projectedLen = vec2.dot(normal, vertexPositionVec);

                if(b == 0)
                {
                    minB = projectedLen;
                    maxB = projectedLen;
                }
                else
                {
                    minB = Math.min(projectedLen, minB);
                    maxB = Math.max(projectedLen, maxB);
                }
            }

            if(maxA >= maxB && maxB >= minA)
            {
                if(i == 0)
                {
                    mvtMagnitude =  maxB - minA;
                    mvtDir = normal;
                }
                else
                {
                    if(mvtMagnitude > (maxB - minA))
                    {
                        mvtMagnitude =  maxB - minA;
                        mvtDir = normal;
                    }
                }
                overlapBool = true;
            }
            else if(maxB >= maxA && maxA >= minB)
            {
                if(i == 0)
                {
                    mvtMagnitude =  maxA - minB;
                    mvtDir = normal;
                }
                else
                {
                    if(maxA - minB < mvtMagnitude)
                    {
                        mvtMagnitude =  maxA - minB;
                        mvtDir = normal;
                    }
                }
                overlapBool = true;
            }
            else
            {
                return false
            }
        }

        // check dot product between normal and direction and negate if they point in opposite directions
        if(vec2.dot(mvtDir, relativePosition) < 0)
        {
            vec2.scale(mvtDir, mvtDir, -1.0);
        }

        // scale to be the size of the overlap
        vec2.scale(mvtReference, mvtDir, mvtMagnitude);
        return overlapBool;
    }

    // --------   --------
    let minimumTranslationVector = vec2.create();
    let anotherMinTranslationVector = vec2.create();
    
    // projections from both polygons need to be true
    if(projectedLengthComparison(polygonReferenceA, polygonReferenceB, minimumTranslationVector))
    {
        if(projectedLengthComparison(polygonReferenceB, polygonReferenceA, anotherMinTranslationVector))
        {
            if(vec2.squaredLength(minimumTranslationVector) < vec2.squaredLength(anotherMinTranslationVector))
            {
                return {collision: true, mvt: minimumTranslationVector};
            }
            else
            {
                return {collision: true, mvt: anotherMinTranslationVector};
            }
        }
        else
        {
            return {collision: false, mvt: [0, 0]};
        }
    }
    else
    {
        return {collision: false, mvt: [0, 0]};
    }
}