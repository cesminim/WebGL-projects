class Rectangle extends Polygon
{
    constructor(aRenderer, position, scale)
    {
        super(position);
        
        // design choice was to make rendering vertices and rigidbody vertices the same
        // done simply by cutting up a cirlce --> scale is radius

        this.scale = scale;
        this.radius = scale;
        mat4.scale(this.transform, this.transform, vec3.fromValues(scale, scale, scale));
        this.renderable = new RectangleRenderable(aRenderer, this.transform);
        this.rigidBody = new RigidBody(this.pos, vec3.create(), this.transform, this.radius);
        this.rigidBody.setPolygonVertices(4, this.radius);
    }
    rotate(theta)
    {
        this.rigidBody.rotate(theta);
    }
    translate(aVec2)
    {
        this.rigidBody.translate(aVec2);
    }
}