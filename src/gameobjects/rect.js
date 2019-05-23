var gameObjects = require("./index.js");
var associativeArray = require("../associativearray/index.js");
var GameObject = require("./gameobject.js");

/**
 * @namespace CartesianSystemLite.GameObjects.Rect
 */

function Rect(x, y, width, height)
{
    GameObject.call(this, arguments);

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;

    this.body.physics.shape = "rect";

    var rect = this;

    this.body.updateBoundingBox = function()
    {
        this.boundingBox.minX = rect.x;
        this.boundingBox.minY = rect.y;
        this.boundingBox.maxX = rect.x + rect.width;
        this.boundingBox.maxY = rect.y + rect.height;
    };
    this.body.updateBoundingBox();
}

gameObjects.addObject("rect", associativeArray(Rect));

module.exports = Rect;