class RigidBody
{
    constructor(position, velocity, transform, radius)
    {
        this.dynamic = true;
        this.restitutionCoeff = 0.6;
        this.mass = 1.0;
        this.inv_mass = 1.0 / this.mass;
        this.gravity = false;
        //
        this.pos = position;
        this.inv_pos = vec3.fromValues(-this.pos[0], -this.pos[1], 0);
        this.vel = velocity;
        this.accl = vec3.create();
        //
        this.angle = 0;
        this.radius = radius;
        //
        this.transform = transform;
        this.vertices = new Array();
        this.geometry = new Array();
        this.scaleVec = vec3.fromValues(this.radius, this.radius, this.radius);
    }
    eulerUpdate(pt)
    {
        if(this.gravity)
        {
            vec3.add(this.accl, this.accl, [0, littleG * 0.0167, 0]);    
        }

        vec3.add(this.vel, this.vel, this.accl);
        let differenceInPos = vec3.create();
        vec3.add(differenceInPos, this.pos, this.vel);
        vec3.subtract(differenceInPos, differenceInPos, this.pos);
        this.accl = vec3.create();
        this.translate(differenceInPos);
    }
    rotate(angle)
    {
        let theta = toRadians(angle);
        this.angle = theta;
        
        let transform = mat4.create();
        mat4.rotateZ(transform, transform, this.angle);

        for(let i in this.vertices)
        {
            vec3.add(this.vertices[i], this.vertices[i], this.inv_pos);
            vec3.transformMat4(this.vertices[i], this.vertices[i], transform);
            vec3.add(this.vertices[i], this.vertices[i], this.pos);
        }
        let translatation = mat4.create();
        mat4.translate(translatation, translatation, this.pos);
        mat4.multiply(this.transform, translatation, transform);
        mat4.scale(this.transform, this.transform, this.scaleVec)
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
        transform = mat4.create();
        mat4.translate(transform, transform, this.pos);
        mat4.rotateZ(transform, transform, this.angle);
        mat4.scale(this.transform, transform, [this.radius, this.radius, this.radius]);
    }
    setPolygonVertices(numPoints, radius)
    {
        let theta = 0;
        let deltaTheta = 2 * Math.PI / numPoints;
        for (let a = 0; a < numPoints; a++)
        {
            let xx = this.pos[0] + Math.cos(theta) * radius;
            let yy = this.pos[1] + Math.sin(theta) * radius;
            theta += deltaTheta;
            this.vertices.push(vec3.fromValues(xx, yy, 0));
            this.geometry.push(vec3.fromValues(xx, yy, 0))
        }
    }
}