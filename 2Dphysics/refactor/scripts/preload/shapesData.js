var triangleRenderingVertices = [];
var rectangleRenderingVertices = [];

makeTriangleRenderingVertices();
makeRectangleRenderingVertices();

function makeTriangleRenderingVertices()
{
    let theta = 0;
    let deltaTheta = 2. * Math.PI / 3;
    for (let a = 0; a < 3; a++)
    {
        let xx = Math.cos(theta);
        let yy = Math.sin(theta);
        triangleRenderingVertices.push(xx);
        triangleRenderingVertices.push(yy);
        theta += deltaTheta;
    }
}

function makeRectangleRenderingVertices()
{
    let numPoints = 4;
    let theta = 0;
    let deltaTheta = 2. * Math.PI / numPoints;

    for (let a = 0; a < numPoints; a++)
    {
        if (a == numPoints - 1)
        {
            rectangleRenderingVertices.push(rectangleRenderingVertices[0]);
            rectangleRenderingVertices.push(rectangleRenderingVertices[1]);
            rectangleRenderingVertices.push(rectangleRenderingVertices[4]);
            rectangleRenderingVertices.push(rectangleRenderingVertices[5]);
        }

        let xx = Math.cos(theta);
        let yy = Math.sin(theta);
        rectangleRenderingVertices.push(xx);
        rectangleRenderingVertices.push(yy);
        theta += deltaTheta;
    }
}
