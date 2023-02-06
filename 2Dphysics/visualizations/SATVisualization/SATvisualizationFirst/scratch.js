// tt = millis() / 1000;

//------------------------------------------------------------------------------------------
// /* 
//     Check bounding circle radius squared of each polygon with every other polygon once
// */
// function pseudoBroadPhase(arrOfPolys)
// {
//     for(let i = 0; i < arrOfPolygons.length - 1; i++)
//     {
//         let j = i + 1;
        
//         while(j < arrOfPolygons.length)
//         {
//             let sqrdDist = vec2.squaredDistance(arrOfPolys[i].pos, arrOfPolys[j].pos);
//             if(sqrdDist < Math.pow(arrOfPolys[i].radius + arrOfPolys[j].radius, 2))
//             {
//                 // narrow phase resolution
//                 if(SAT(arrOfPolys[i], arrOfPolys[j]))
//                 {
//                     console.log("collision");
//                     arrOfPolys[i].outlineCol = arrOfPolys[i].collisionCol;
//                     arrOfPolys[j].outlineCol = arrOfPolys[j].collisionCol;
//                 }
//                 else
//                 {
//                     arrOfPolys[i].outlineCol = arrOfPolys[i].defaultOutlineCol;
//                     arrOfPolys[j].outlineCol = arrOfPolys[j].defaultOutlineCol;
//                 }
//             }
//             j += 1;
//         }
//     }
// }

// /* 
//     Narrow Phase intersection test.

//     * Create normalized axis from each edge of polygon.
//     * Project each position vector of both polygons onto the axis.
//     * Find max and min projections for each polygon and compare to see if they overlap.
//     * If there are any non-overlapping projections, exit algorithm.
    
//     aPolygon.vertices = [x0, y0, x1, y1 ... xN, yN]

//     keep it D.R.Y --> nested function for projected length comparisons
// */
// function SAT(polygonReferenceA, polygonReferenceB)
// {
//     function projectedLengthComparison(polygonA, polygonB)
//     {
//         let overlapBool;

//         for(let i = 0; i < polygonA.vertices.length; i+=2)
//         {
//             let edge;
//             let normal;
//             // edges and normals from first vertex until second to last vertex
//             if(i < polygonA.vertices.length - 2)
//             {
//                 edge = vec2.fromValues(polygonA.vertices[i + 2] - polygonA.vertices[i], 	
//                         polygonA.vertices[i + 3] - polygonA.vertices[i + 1] );
//                 normal = vec2.fromValues(edge[1], -edge[0]);
//             }
//             // edge and normal from last vertex to first vertex
//             else
//             {
//                 edge = vec2.fromValues(polygonA.vertices[0] - polygonA.vertices[i], polygonA.vertices[1] - polygonA.vertices[i + 1]);
//                 normal = vec2.fromValues(edge[1], -edge[0]);
//             }

//             // Create normalized axis from each edge of polygon 
//             vec2.normalize(normal, normal);
            
//             // Project each vertex's position vector of both polygons onto the axis.
//             let minA;
//             let maxA;
//             for(let a = 0; a < polygonA.vertices.length; a+=2)
//             {
//                 let vertexPositionVec = vec2.fromValues(polygonA.vertices[a], polygonA.vertices[a + 1]);
//                 let projectedLen = vec2.dot(normal, vertexPositionVec);
                
//                 //console.log(vec2.str(vertexPositionVec));
//                 if(a == 0)
//                 {
//                     minA = projectedLen;
//                     maxA = projectedLen;
//                 }
//                 else
//                 {
//                     minA = Math.min(projectedLen, minA);
//                     maxA = Math.max(projectedLen, maxA);
//                 }
//             }
//             let minB;
//             let maxB;
//             for(let b = 0; b < polygonB.vertices.length; b+=2)
//             {
//                 let vertexPositionVec = vec2.fromValues(polygonB.vertices[b], polygonB.vertices[b + 1]);
//                 let projectedLen = vec2.dot(normal, vertexPositionVec);

//                 if(b == 0)
//                 {
//                     minB = projectedLen;
//                     maxB = projectedLen;
//                 }
//                 else
//                 {
//                     minB = Math.min(projectedLen, minB);
//                     maxB = Math.max(projectedLen, maxB);
//                 }
//             }

//             if(maxA >= maxB && maxB >= minA)
//             {
//                 overlapBool = true;
//             }
//             else if(maxB >= maxA && maxA >= minB)
//             {
//                 overlapBool = true;
//             }
//             else
//             {
//                 return false
//             }
//         }
//         return overlapBool;
//     }
//     // -------- check using edges of polygonA --------
//     if(!projectedLengthComparison(polygonReferenceA, polygonReferenceB))
//     {
//         return false;
//     }
//     // -------- check using edges of polygonB --------
//     if(!projectedLengthComparison(polygonReferenceB, polygonReferenceA))
//     {
//         return false;
//     }
//     return true
// }

//------------------------------------------------------------------------------------------

// function A()
// {
// 		var a = [1,2,3];
//     var b = [4,5,6];
    
//     B(a, b);
//     function B(c,b)
//     {
// 			for(let i in c)
//       {
//       	console.log(c[i]);
//         console.log(b[i]);
//       }
//     }
// }

// A();

// ------------------------------------------------------

// function drawNormalsAndNormalPlanes(polygonRef)
// {
// 	stroke(255, 0, 0);
// 	// polygonRef.vertices = [x0, y0, x1, y1 ... xN, yN]
// 	for(let i = 0; i < polygonRef.vertices.length; i+=2)
// 	{
// 		let edge;
// 		let normal;
// 		let slope;

// 		if(i < polygonRef.vertices.length - 2) // to not null ref array
// 		{
// 			edge = [polygonRef.vertices[i + 2] - polygonRef.vertices[i], 	
// 					polygonRef.vertices[i + 3] - polygonRef.vertices[i + 1] ];
// 			normal = [edge[1], - edge[0]];
// 			slope = edge[1] / edge[0];
// 			console.log
// 			// normal
// 			stroke(255, 0, 0);
// 			line(polygonRef.vertices[i    ] + (edge[0] / 2),
// 				polygonRef.vertices[i + 1] + (edge[1] / 2),
// 				polygonRef.vertices[i    ] + (edge[0] / 2) + normal[0],
// 				polygonRef.vertices[i + 1] + (edge[1] / 2) + normal[1]
// 				);

// 			// normal plane
// 			stroke(0, 255, 255);
// 			let x0 = polygonRef.vertices[i    ] + normal[0] * normalPlaneRadialScale;
// 			let y0 = polygonRef.vertices[i + 1] + normal[1] * normalPlaneRadialScale;
// 			let x1 = polygonRef.vertices[i + 2] + normal[0] * normalPlaneRadialScale;
// 			let y1 = polygonRef.vertices[i + 3] + normal[1] * normalPlaneRadialScale;

// 			let scaledCoord0 = linearScale(x0, y0, x0 - normalPlaneAxialScale, slope);
// 			let scaledCoord1 = linearScale(x1, y1, x1 + normalPlaneAxialScale, slope);

// 			line(scaledCoord0[0], scaledCoord0[1], scaledCoord1[0], scaledCoord1[1]);
// 		}
// 		else
// 		{
// 			edge = [polygonRef.vertices[0] - polygonRef.vertices[i], polygonRef.vertices[1] - polygonRef.vertices[i + 1]];
// 			normal = [edge[1], - edge[0]];
// 			slope = edge[1] / edge[0];

// 			// normal
// 			stroke(255, 0, 0);
// 			line(polygonRef.vertices[i    ] + (edge[0] / 2),
// 				polygonRef.vertices[i + 1] + (edge[1] / 2),
// 				polygonRef.vertices[i    ] + (edge[0] / 2) + normal[0],
// 				polygonRef.vertices[i + 1] + (edge[1] / 2) + normal[1]
// 				);
// 			// normal plane
// 			stroke(255, 0, 255);
// 			// radially scale out:
// 			let x0 = polygonRef.vertices[0    ] + normal[0] * normalPlaneRadialScale;
// 			let y0 = polygonRef.vertices[1    ] + normal[1] * normalPlaneRadialScale;
// 			let x1 = polygonRef.vertices[i    ] + normal[0] * normalPlaneRadialScale;
// 			let y1 = polygonRef.vertices[i + 1] + normal[1] * normalPlaneRadialScale;

// 			let scaledCoord0 = linearScale(x0, y0, x0 -normalPlaneAxialScale, slope);
// 			let scaledCoord1 = linearScale(x1, y1, x1 + normalPlaneAxialScale, slope);

// 			line(scaledCoord0[0], scaledCoord0[1], scaledCoord1[0], scaledCoord1[1]);
// 		}
// 	}
// }