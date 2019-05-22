
var gameObjects = require("../gameobjects/index.js");
var cameraGrid = require("../cameragrid/index.js");

/**
 * @namespace CartesianSystemLite#factory
 */

var factory = {};

factory.add = function()
{
    var args = Array.prototype.slice.call(arguments);

    var arrayName = args[0];
    args.shift();

    var place = gameObjects[gameObjects.references[arrayName]];
    var object = place.add.apply(place, args);
    cameraGrid.addReference(object);

    return object;
};
factory.destroy = function(arrayName, id)
{ 
    var array = gameObjects[gameObjects.references[arrayName]];

    // The array doesn't exist or the object is already removed.
    if(!array || !array[id])
    {
        return false;
    }

    // Actually remove the object from gameObject array
    array.destroy(id);

    return true;
};


module.exports = factory;