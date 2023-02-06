// theGUI lives in settings and is used in the renderer
// this function is called in resource manager constructor

function makeTheGUI()
{
    theGUI = 
    {
        translationIndex: 12
    };
    
    var gui = new dat.gui.GUI();
    gui.remember(theGUI);
    gui.add(theGUI, 'translationIndex').min(12).max(14).step(1);
}
