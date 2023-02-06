"use strict";

var arrOfPolygons = new Array();
var count = 0;
function setup() 
{
	createCanvas(windowWidth, windowHeight);
	background(40);
	
	noFill();

	let aPolygon = new Polygon([600, 500],  80,  3, [255,   255, 255]);
	//aPolygon.rotate(30);
	let anotherPolygon = new Polygon([500, 300],  100,  4, [255,   255, 255]);
	let anotherPolygon2 = new Polygon([400, 150],  50,  5, [255,   255, 255]);
	let anotherPolygon3 = new Polygon([800, 200],  70,  3, [255,   255, 255]);
	let anotherPolygon4 = new Polygon([200, 600],  40,  4, [255,   255, 255]);

	//anotherPolygon.rotate(45);

	arrOfPolygons.push(aPolygon);
	arrOfPolygons.push(anotherPolygon);
	arrOfPolygons.push(anotherPolygon2);
	arrOfPolygons.push(anotherPolygon3);
	arrOfPolygons.push(anotherPolygon4);

}

function draw() 
{
	// frameRate(5)
	background(40);
	let tt = (millis() / 1000);

	arrOfPolygons[0].translate(vec2.fromValues(mouseX - arrOfPolygons[0].pos[0], mouseY - arrOfPolygons[0].pos[1])  );

	for(let i = 0; i < arrOfPolygons.length; i++)
	{
		arrOfPolygons[i].rotate(deltaTime / 60.0);
		//arrOfPolygons[i].translate([i * Math.cos(tt), i * 2 * Math.sin(tt), 0]);
		arrOfPolygons[i].display();
	}
	pseudoBroadPhase(arrOfPolygons);
}