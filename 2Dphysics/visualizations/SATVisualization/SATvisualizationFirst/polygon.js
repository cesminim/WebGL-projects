class Polygon
{
    constructor(pos, radius, npoints, aCol)
    {
        this.pos = vec2.fromValues(pos[0], pos[1]);
        this.radius = radius;
        this.numPoints = npoints;
        this.vertices = new Array();

        // settings
        this.normalPlaneRadialScale = 4;
        this.normalPlaneAxialScale = 1000;

        // colors
        this.defaultOutlineCol = aCol;
        this.outlineCol = this.defaultOutlineCol;
        this.collisionCol = [255, 0, 255];
        this.normalCol = [255, 0, 0];
        this.projectionAxesCol = [aCol[0]/ 2, aCol[1] / 2, aCol[2] / 2];
        this.boundingCircleCol = [255, 192, 203];

        // state
        this.normalsAndPlanesDisplay = false;
        this.isColliding = false;
        this.init();
    }
    init()
    {
        stroke(this.outlineCol[0], this.outlineCol[1], this.outlineCol[2]);
        let theta = Math.PI / 6;
        let deltaTheta = TWO_PI / this.numPoints;
        beginShape();
        for (let a = 0; a < this.numPoints; a++)
        {
            let xx = this.pos[0] + cos(theta) * this.radius;
            let yy = this.pos[1] + sin(theta) * this.radius;
            theta += deltaTheta;
            this.vertices.push(xx);
            this.vertices.push(yy);
            
            vertex(xx, yy);
        }
	    endShape(CLOSE);
    }
    translate(translationVec)
    {
        vec2.add(this.pos, this.pos, translationVec);
        for(let i = 0; i < this.vertices.length; i+=2)
        {
            this.vertices[i] += translationVec[0];
            this.vertices[i+1] += translationVec[1];
        }
    }
    rotate(angle)
    {
        let theta = toRadians(angle);
        let translationVec = vec2.create();
        vec2.scale(translationVec, this.pos, -1)
        this.translate(translationVec);

        theta *= -1;
        for(let i = 0; i < this.vertices.length; i+=2)
        {
            let x = Math.cos(theta) * this.vertices[i] - Math.sin(theta) * this.vertices[i + 1];
            let y = Math.sin(theta) * this.vertices[i] + Math.cos(theta) * this.vertices[i + 1];
            this.vertices[i    ] = x;
            this.vertices[i + 1] = y;
        }

        vec2.scale(translationVec, translationVec, -1)
        this.translate(translationVec);

        // let rotMat = mat2.create();
        // mat2.rotate(rotMat, rotMat, theta);
        // vec2.transformMat2(this.pos, this.pos, rotMat)
    }
    drawNormalsAndNormalPlanes()
    {
        // this.vertices = [x0, y0, x1, y1 ... xN, yN]
        for(let i = 0; i < this.vertices.length; i+=2)
        {
            let edge;
            let normal;
            let slope;

            if(i < this.vertices.length - 2) // to not null ref array
            {
                edge = [this.vertices[i + 2] - this.vertices[i], 	
                        this.vertices[i + 3] - this.vertices[i + 1] ];
                normal = [edge[1], -edge[0]];
                slope = edge[1] / edge[0];

                // normal draw
                stroke(this.normalCol[0], this.normalCol[1], this.normalCol[2]);
                line(this.vertices[i    ] + (edge[0] / 2),
                    this.vertices[i + 1] + (edge[1] / 2),
                    this.vertices[i    ] + (edge[0] / 2) + normal[0],
                    this.vertices[i + 1] + (edge[1] / 2) + normal[1]
                    );
                // // normal plane
                // stroke(this.projectionAxesCol[0], this.projectionAxesCol[1], this.projectionAxesCol[2]);
                // let x0 = this.vertices[i    ] + normal[0] * this.normalPlaneRadialScale;
                // let y0 = this.vertices[i + 1] + normal[1] * this.normalPlaneRadialScale;
                // let x1 = this.vertices[i + 2] + normal[0] * this.normalPlaneRadialScale;
                // let y1 = this.vertices[i + 3] + normal[1] * this.normalPlaneRadialScale;

                // if(slope == Infinity || slope == -Infinity)
                // {
                //     let smallerYCoord = Math.min(y0, y1);
                //     let biggerYCoord = (y0 + y1) - smallerYCoord;
                //     smallerYCoord -= this.normalPlaneAxialScale;
                //     biggerYCoord += this.normalPlaneAxialScale;
                //     line(x0, smallerYCoord, x1, biggerYCoord);
                // }
                // else
                // {
                //     let scaledCoord0 = linearScale(x0, y0, x0 - this.normalPlaneAxialScale, slope);
                //     let scaledCoord1 = linearScale(x1, y1, x1 + this.normalPlaneAxialScale, slope);
                //     line(scaledCoord0[0], scaledCoord0[1], scaledCoord1[0], scaledCoord1[1]);
                // }
            }
            else
            {
                edge = [this.vertices[0] - this.vertices[i], this.vertices[1] - this.vertices[i + 1]];
                normal = [edge[1], - edge[0]];
                slope = edge[1] / edge[0];

                // normal
                stroke(this.normalCol[0], this.normalCol[1], this.normalCol[2]);
                line(this.vertices[i   ]  + (edge[0] / 2),
                     this.vertices[i + 1] + (edge[1] / 2),
                     this.vertices[i    ] + (edge[0] / 2) + normal[0],
                     this.vertices[i + 1] + (edge[1] / 2) + normal[1]
                    );
                
                // stroke(this.projectionAxesCol[0], this.projectionAxesCol[1], this.projectionAxesCol[2]);
                // // radially scale out:
                // let x0 = this.vertices[0    ] + normal[0] * this.normalPlaneRadialScale;
                // let y0 = this.vertices[1    ] + normal[1] * this.normalPlaneRadialScale;
                // let x1 = this.vertices[i    ] + normal[0] * this.normalPlaneRadialScale;
                // let y1 = this.vertices[i + 1] + normal[1] * this.normalPlaneRadialScale;

                // // draw the normal planes
                // if(slope == Infinity || slope == -Infinity)
                // {
                //     let smallerYCoord = Math.min(y0, y1);
                //     let biggerYCoord = (y0 + y1) - smallerYCoord;
                //     smallerYCoord -= this.normalPlaneAxialScale;
                //     biggerYCoord += this.normalPlaneAxialScale;
                //     line(x0, smallerYCoord, x1, biggerYCoord);
                // }
                // else
                // {
                //     let scaledCoord0 = linearScale(x0, y0, x0 - this.normalPlaneAxialScale, slope);
                //     let scaledCoord1 = linearScale(x1, y1, x1 + this.normalPlaneAxialScale, slope);
                //     line(scaledCoord0[0], scaledCoord0[1], scaledCoord1[0], scaledCoord1[1]);
                // }
            }
        }
    }
    drawBoundingCircle()
    {
        stroke(this.boundingCircleCol[0], this.boundingCircleCol[1], this.boundingCircleCol[2]);
        
        ellipse(this.pos[0], this.pos[1], this.radius * 2, this.radius * 2);
    }
    display()
    {
        stroke(this.outlineCol[0], this.outlineCol[1], this.outlineCol[2]);
        beginShape();
        for (let i = 0; i < this.vertices.length; i+=2)
        {
            vertex(this.vertices[i], this.vertices[i + 1]);
        }
	    endShape(CLOSE);

        //this.drawBoundingCircle();
        
        if (this.isColliding)
        {
            this.outlineCol = this.collisionCol;
        }
        else
        {
            this.outlineCol = this.defaultOutlineCol;
        }
        if(this.normalsAndPlanesDisplay)
        {
            this.drawNormalsAndNormalPlanes();
        }
    }
}