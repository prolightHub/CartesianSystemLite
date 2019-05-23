
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
        physics: {
            shape: "",
            moves: false
        },
        boundingBox: {
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0
        },
        updateBoundingBox: Tweens.NOOP
    };

    this.update = Tweens.NOOP;
    this.draw = Tweens.NOOP;

    this.remove = function() 
    {
        // May need return in case .remove returns false, which should never happen!
        gameObjects[gameObjects.references[this._arrayName]].remove(this._id);
    };
    this.hide = function()
    {
        cameraGrid.removeReference(this);

        if(gameObjects.used[gameObjects.references[name]])
        {
            var keys = gameObjects.used[gameObjects.references[name]];
            var i = keys.indexOf(this._id);
            if(i >= 0)
            {
                keys.splice(i, 1);
            }
        }
    };
    this.destroy = function()
    {
        this.hide();
        this.remove();
    };

    cameraGrid.setProperties(this);
}

gameObjects.addObject("gameObject", associativeArray(GameObject));

module.exports = GameObject;