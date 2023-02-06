// "Abstract-ish" class for polygons"

class Renderable
{
    constructor(aRenderer, aTransform)
    {
        this.renderer = aRenderer;
        this.vao;
        this.transform = aTransform;
        this.vertCount;
        this.primitiveType = this.renderer.gl.TRIANGLES; // otherwise wireframe shader won't work
        
        this.program = this.renderer.availablePrograms.get("wireframe").program;

        this.uniforms = 
        { 
            resolution: this.renderer.availablePrograms.get("wireframe").programUResolution,
            time: this.renderer.availablePrograms.get("wireframe").programUTime,
            model: this.renderer.availablePrograms.get("wireframe").programUModel,
            view: this.renderer.availablePrograms.get("wireframe").programUView,
            projection: this.renderer.availablePrograms.get("wireframe").programUProjection
        };
    } 
    
    setProgram(programName)
    {
        try 
        {
            this.program = this.renderer.availablePrograms.get(programName).program;
            this.uniforms = 
            { 
                resolution: this.renderer.availablePrograms.get(programName).programUResolution,
                time: this.renderer.availablePrograms.get(programName).programUTime,
                model: this.renderer.availablePrograms.get(programName).programUModel,
                view: this.renderer.availablePrograms.get(programName).programUView,
                projection: this.renderer.availablePrograms.get(programName).programUProjection
            };
        } 
        catch (error) 
        {
            console.error(error);
            this.program = this.renderer.availablePrograms.get("wireframe").program;
            this.uniforms = 
            { 
                resolution: this.renderer.availablePrograms.get("wireframe").programUResolution,
                time: this.renderer.availablePrograms.get("wireframe").programUTime,
                model: this.renderer.availablePrograms.get("wireframe").programUModel,
                view: this.renderer.availablePrograms.get("wireframe").programUView,
                projection: this.renderer.availablePrograms.get("wireframe").programUProjection
            };
        }
    }
}