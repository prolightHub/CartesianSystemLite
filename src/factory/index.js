
var gameObjects = require("../gameobjects/index.js");
var cameraGrid = require("../cameragrid/index.js");
var associativeArray = require("../associativearray/index.js");
var Tweens = require("../tweens/index.js");

/**
 * @namespace CartesianSystemLite.prototype.factory
 */

var factory = {};

factory.add = function()
{
    var args = Array.prototype.slice.call(arguments);

    var arrayName = args[0];
    args.shift();

    var place = gameObjects[gameObjects.references[arrayName]];
    var object = place.add.apply(place, args);
    cameraGrid.addReference(object, true);

    if(typeof object.setup === "function")
    {
        object.setup();
    }
    
    return object;
};
factory.get = function(arrayName, id)
{
    return gameObjects[gameObjects.references[arrayName]][id];
};
factory.destroy = function(arrayName, id)
{ 
    var array = gameObjects[gameObjects.references[arrayName]];

    // The array doesn't exist or the object is already destroyed.
    if(!array || !array[id])
    {
        return false; // We can't destroy it
    }

    // Actually destroy the object from gameObject array (and from the world!)
    array[id].destroy();

    return true;
};

factory.addArray = function()
{
    var arrayName, GameObject;

    if(typeof arguments[0] === "string" && typeof arguments[1] === "function")
    {
        arrayName = arguments[0];
        GameObject = arguments[1];
    }
    else if(typeof arguments[0] === "function")
    {
        arrayName = Tweens.String.lower(arguments[0].name);
        GameObject = arguments[0];
    }

    return gameObjects.addObject(arrayName, associativeArray(GameObject));
};
factory.getArray = function(arrayName)
{
    return gameObjects[gameObjects.references[arrayName]];
};
factory.removeArray = function(arrayName)
{
    var array = gameObjects[gameObjects.references[arrayName]];

    if(!array)
    {
        return false; // Object does not exist
    }

    for(var i in array)
    {
        array[i].hide();
    }

    gameObjects.removeObject(arrayName);

    return true; // Object exists
};

module.exports = factory;