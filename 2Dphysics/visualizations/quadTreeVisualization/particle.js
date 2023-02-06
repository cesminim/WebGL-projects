class Particle
{
    constructor(world, pos)
    {
        this.radius = Math.floor(Math.random() * 15) + 2;
        this.pos = pos;
        this.vel = vec2.fromValues(Math.random() * this.radius / 2, Math.random() * this.radius / 2);
        this.accl = vec2.create();
        world.add(this);
    }

    update()
    {
        vec2.add(this.vel, this.accl, this.vel);
        vec2.add(this.pos, this.vel, this.pos);
        this.accl[0] = 0;
        this.accl[1] = 0;
    }
}