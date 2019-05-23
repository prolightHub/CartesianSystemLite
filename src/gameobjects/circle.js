var gameObjects = require("./index.js");
var associativeArray = require("../associativearray/index.js");
var GameObject = require("./gameobject.js");

/**
 * @namespace CartesianSystemLite.GameObjects.Circle
 */

function Circle(x, y, diameter)
{
    GameObject.call(this, arguments);

    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.radius = diameter / 2;

    this.body.physics.shape = "circle";

    var circle = this;

    this.body.updateBoundingBox = function()
    {
        this.boundingBox.minX = circle.x - circle.radius;
        this.boundingBox.minY = circle.y - circle.radius;
        this.boundingBox.maxX = circle.x + circle.radius;
        this.boundingBox.maxY = circle.y + circle.radius;
    };
    this.body.updateBoundingBox();
}

gameObjects.addObject("circle", associativeArray(Circle));

module.exports = Circle;