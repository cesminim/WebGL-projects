// rigidBody + renderable

// abstract class for game shapes 
class Polygon
{
    constructor(position)
    {
        this.pos = position;
        this.radius = 1;
        this.transform = mat4.create();
        mat4.translate(this.transform, this.transform, this.pos);
        this.renderable;
        this.rigidBody;
    }
}