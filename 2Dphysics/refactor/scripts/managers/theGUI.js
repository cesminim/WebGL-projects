
var theGUI;

function makeGUI (arrOfPolygons)
{
    theGUI = 
    {
        shader: "wireframe",
        arrOfPolygons: arrOfPolygons,

        toggleWireframe: function() 
        {
            if(this.shader == "wireframe")
            {
                this.shader = "shaded";
                //console.log(this.shader);
            }
            else
            {
                this.shader = "wireframe"
                //console.log(this.shader);
            }
            for(let i in arrOfPolygons)
            {
                this.arrOfPolygons[i].renderable.setProgram(this.shader);
                //console.log(this.arrOfPolygons[i].renderable.program);
            }
        }
    };
    
    var gui = new dat.gui.GUI();
    gui.remember(theGUI);
    gui.add(theGUI, 'toggleWireframe');
}
