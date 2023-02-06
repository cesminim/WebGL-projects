class ProcessManager
{
    constructor(gl)
    {
        this.renderer = new Renderer(gl, CAM_POS, WORLD_UP)
        this.cube = new RubiksCubeRenderable(this.renderer);
        this.inputManager = new InputManager(this.renderer);
        this.previous = window.performance.now();
        this.time = 0;
    }
    
    update()
    {
        var now = window.performance.now();
        var delta = (now - this.previous);
        this.previous = now;        
        this.time += (delta / 1000.0);
        this.renderProcess(this.time)
    }

    renderProcess(t)
    {
        this.renderer.render(t);
    }
}