class InputManager
{
    constructor(renderer)
    {
        this.renderer = renderer;
        //
        this.keypad = vec2.create();
        this.screenMousePos = vec2.create();
        //
        window.addEventListener( "mouseDown", this.mouseDown);
        window.addEventListener( "mousemove", this.mouseMove);
        window.addEventListener( "mouseup", this.mouseUp);
        window.addEventListener( "keypress", this.logKey);
    }

    mouseDown = event => 
    {

    }
    mouseMove = event => 
    {
        let x =  2. * ( event.clientX - .5 * this.renderer.gl.canvas.width  ) / this.renderer.gl.canvas.width;
        let y = -2. * ( event.clientY - .5 * this.renderer.gl.canvas.height ) / this.renderer.gl.canvas.height;
        // console.log("(" + x.toFixed(2) + ", " + y.toFixed(2) + ")");
        x *= (this.renderer.orthoWidth  / 2);
        y *= (this.renderer.orthoHeight  / 2);

        this.screenMousePos[0] =  x;
        this.screenMousePos[1] =  y;
    }
    mouseUp = event => 
    {

    }

    // logKey = event =>
    // {
    //     switch(event.code) 
    //     {
    //         case "KeyW":
    //             this.keypad = vec2.create();
    //             this.keypad[1] = 1;
    //             break;
    //         case "KeyS":
    //             this.keypad = vec2.create();
    //             this.keypad[1] = -1;
    //             break;
    //         case "KeyD":
    //             this.keypad = vec2.create();
    //             this.keypad[0] = 1;
    //             break;
    //         case "KeyA":
    //             this.keypad = vec2.create();
    //             this.keypad[0] = -1;
    //             break;
    //         default:
    //           // code block
    //       } 
    // }
}