class ProcessManager
{
    constructor(gl)
    {
        this.renderer = new Renderer(gl)
        this.inputManager = new InputManager(this.renderer); // needs to know about resolution
        this.physicsWorld = new PhysicsWorld();
        // objectManager
        this.arrOfPolygons = new Array();

        makeGUI(this.arrOfPolygons);
        //  
        this.previous = window.performance.now();
        this.time = 0;
        this.physicsTime = 0;
        this.accumulator = 0;
        this.distCounter = 0;
        this.init();
    }
    
    init()
    {
        var t1 = new Triangle(this.renderer,  vec3.fromValues(-10, 10, 0),  1.0);
        t1.rotate(90);
        this.arrOfPolygons.push(t1);
        //
        var t2 = new Triangle(this.renderer,  vec3.fromValues(-18, 5, 0),  2.0);
        //t2.rotate(Math.random() * 100);
        //t2.rotate(90);
        t2.rigidBody.mass = 40;
        t2.rigidBody.inv_mass = 1 / 40;
        this.arrOfPolygons.push(t2);
        //
        
        // //create a bunch of random shapes in a grid
        let spacingNum = 2;
        
        for(let i = 1; i < 10; i++)
        {
            for(let j = 1; j < 10; j++)
            {
                let rnd = Math.floor(Math.random() * 2) + 1;
                let shape;
                if( rnd == 1 )
                {
                    shape = new Triangle(this.renderer,  vec3.fromValues(spacingNum * i - 5, spacingNum * j - 5, 0),  0.5);
                }
                else
                {
                    shape = new Rectangle(this.renderer, vec3.fromValues(spacingNum * i - 5, spacingNum * j - 5, 0), 0.5);
                }
                //shape.rigidBody.gravity = true;
                shape.rigidBody.mass = 0.5;
                shape.rigidBody.inv_mass = 1 / shape.rigidBody.mass;
                shape.rotate(Math.random() * 160);
                this.arrOfPolygons.push(shape);
            }
        }
        
        // Container Walls:
        // Ground
        var r1 = new Rectangle(this.renderer, vec3.fromValues(0, -30, 0), 30.0);
        r1.rotate(-45);
        r1.rigidBody.mass = 100;
        r1.rigidBody.inv_mass = 1 / 100;
        r1.rigidBody.dynamic = false;
        this.arrOfPolygons.push(r1);

        // right wall
        var r2 = new Rectangle(this.renderer, vec3.fromValues(40, 15, 0), 30.0);
        r2.rotate(45);
        r2.rigidBody.mass = 100;
        r2.rigidBody.inv_mass = 1 / 100;
        r2.rigidBody.dynamic = false;
        this.arrOfPolygons.push(r2);

        this.physicsWorld.initializeObjects(this.arrOfPolygons);
    }

    update()
    {
        var now = window.performance.now();
        var delta = (now - this.previous);
        this.previous = now;        
        
        this.accumulator += delta;
        
        if (this.accumulator >= frameDuration)
        {
            this.physicsTime += dt;
            this.physicsProcess(this.physicsTime);
            this.accumulator -= frameDuration;
        }
        this.time += (delta / 1000.0);
        this.renderProcess(this.time)
    }

    physicsProcess(pt)
    {
        let target = vec3.fromValues(this.inputManager.screenMousePos[0], this.inputManager.screenMousePos[1], 0);
        let d2 = vec3.squaredDistance(this.arrOfPolygons[0].rigidBody.pos, target);
        if(d2 > this.arrOfPolygons[0].radius * this.arrOfPolygons[0].radius)
        {
            //console.log(vec3.str(target));
            let desired = vec3.create();
            vec3.subtract(desired, target, this.arrOfPolygons[0].rigidBody.pos);
            vec3.normalize(desired, desired);
            vec3.scale(desired, desired, seekScale);

            let seekAccl = vec3.create();
            vec3.subtract(seekAccl, desired, this.arrOfPolygons[0].rigidBody.vel);
            this.arrOfPolygons[0].rigidBody.vel[0] = Math.min(this.arrOfPolygons[0].rigidBody.vel[0], 1.5);
            this.arrOfPolygons[0].rigidBody.vel[1] = Math.min(this.arrOfPolygons[0].rigidBody.vel[1], 1.5);

            vec3.add(this.arrOfPolygons[0].rigidBody.vel, this.arrOfPolygons[0].rigidBody.vel, seekAccl);
        }
        else
        {
            //console.log(vec3.str(target));
            let desired = vec3.create();
            vec3.subtract(desired, target, this.arrOfPolygons[0].rigidBody.pos);
            vec3.normalize(desired, desired);
            vec3.scale(desired, desired, seekScale * d2);
            //console.log(d2);

            let seekAccl = vec3.create();
            vec3.subtract(seekAccl, desired, this.arrOfPolygons[0].rigidBody.vel);
            this.arrOfPolygons[0].rigidBody.vel[0] = Math.min(this.arrOfPolygons[0].rigidBody.vel[0], 1.5);
            this.arrOfPolygons[0].rigidBody.vel[1] = Math.min(this.arrOfPolygons[0].rigidBody.vel[1], 1.5);

            vec3.add(this.arrOfPolygons[0].rigidBody.vel, this.arrOfPolygons[0].rigidBody.vel, seekAccl);
        }
        this.physicsWorld.process(pt);
    }

    renderProcess(t)
    {
        this.renderer.render(t);
    }
}