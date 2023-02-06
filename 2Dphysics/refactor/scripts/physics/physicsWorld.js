class PhysicsWorld 
{
    constructor()
    {
        this.objects;
        this.gravity = vec3.fromValues();
    }
    
    addObject(obj)
    {
        if(this.objects)
        {
            this.objects.push(obj);
        }
        else
        {
            this.objects.push(obj);
        }
    }
    initializeObjects(arr)
    {
        this.objects = arr;
    }
    // removeObject(){}
    process(pt)
    {
        for(let i in this.objects)
        {
            if(this.objects[i].rigidBody.dynamic)
            {
                this.objects[i].rigidBody.eulerUpdate(pt);
            }
        }
        this.resolveCollisions();
    }

    resolveCollisions()
    {
        if(this.objects)
        {
            pseudoBroadPhase(this.objects);
        }
    }
}