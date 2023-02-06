class Polygon
{
    constructor(pos, radius, npoints, aCol)
    {
        this.pos = vec3.fromValues(pos[0], pos[1], 0.);
        this.inv_pos = vec3.fromValues(-this.pos[0], -this.pos[1], 0);
        this.radius = radius;
        this.numPoints = npoints;
        this.vertices = new Array(); // vec3s

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
            this.vertices.push(vec3.fromValues(xx, yy, 0));
            vertex(xx, yy);
        }
	    endShape(CLOSE);
    }
    rotate(theta)
    {
        let rotMat = mat4.create();
        mat4.rotateZ(rotMat, rotMat, toRadians(theta));

        for(let i in this.vertices)
        {
            vec3.add(this.vertices[i], this.vertices[i], this.inv_pos);
            vec3.transformMat4(this.vertices[i], this.vertices[i], rotMat);
            vec3.add(this.vertices[i], this.vertices[i], this.pos);
        }
    }
    translate(translationVec)
    {
        let translation = vec3.fromValues(translationVec[0], translationVec[1], 0);
        vec3.add(this.pos, this.pos, translation);
        this.inv_pos = vec3.fromValues(-this.pos[0], -this.pos[1], 0);
        let transform = mat4.create();
        mat4.translate(transform, transform, translation)
        for(let i in this.vertices)
        {
            vec3.transformMat4(this.vertices[i], this.vertices[i], transform);
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
        for (let i in this.vertices)
        {
            vertex(this.vertices[i][0], this.vertices[i][1]);
        }
	    endShape(CLOSE);

        this.drawBoundingCircle();
        
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