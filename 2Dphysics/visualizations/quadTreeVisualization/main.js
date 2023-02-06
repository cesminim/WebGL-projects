var ww;
var hh;
var quadTreeCapacity = 4;
var count = 0;
var qt;

let range;

function setup()
{
    ww = windowWidth;
    hh = windowHeight;
    createCanvas(ww, hh);
	background(40);

    range    = new QuadTreeCell(vec2.fromValues(mouseX, mouseY), (windowHeight / 5) * (windowWidth / (2. * windowHeight)), windowHeight / (2. * 5));
    console.log(range.halfHeight);
    let root = new QuadTreeCell(vec2.fromValues(ww / 2, hh / 2), ww / 2, hh / 2);
    qt = new QuadTree(root, quadTreeCapacity);

    for(let i = 0; i < 1000; i++)
    {
        let xx = Math.random() * ww;
        let yy = Math.random() * hh;
        let aRndVec2 = vec2.fromValues(xx, yy);
        qt.insert(aRndVec2);
    }
    qt.display();
    rectMode(CENTER);
}

function draw()
{
    background(40);
    qt.display();
    stroke(0, 255, 0);
    rect(mouseX, mouseY, 2. * range.halfWidth, 2. * range.halfHeight);

    range.center[0] = mouseX;
    range.center[1] = mouseY;

    let points = qt.query(range);

    strokeWeight(4.);
    for( let p in points)
    {
        point(points[p][0], points[p][1]);
    }
}