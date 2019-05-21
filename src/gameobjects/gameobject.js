
var gameObjects = require("./index.js");
var cameraGrid = require("../cameragrid/index.js");

var associativeArray = require("../associativearray/index.js");
var Tweens = require("../tweens/index.js");

/**
 * @namespace CartesianSystemLite.GameObjects.GameObject
 */

function GameObject()
{
    this.body = {
        boundingBox: {
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0
        },
        updateBoundingBox: Tweens.NOOP
    };

    this.update = function() {};
    this.draw = function() {};

    this.remove = function() 
    {
        gameObjects.getObject(this._arrayName).remove(this._id);
    };

    cameraGrid.setProperties(this);
}

gameObjects.addObject("gameObject", associativeArray(GameObject));

module.exports = GameObject;