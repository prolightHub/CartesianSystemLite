
/**
 * @namespace CartesianSystemLite
 * 
 * @version 0.2.0
 */

var CartesianSystemLite = {
    Tweens: require("./tweens"),
    Camera: require("./camera"),
    GameObjects: {
        GameObject: require("./gameobjects/gameobject.js"),
        Rect: require("./gameobjects/rect.js"),
    }
};

var __CartesianSystemLite__ = CartesianSystemLite;

CartesianSystemLite = function(config)
{
    this.level = {};
};
CartesianSystemLite.prototype = {
    "associativeArray": require("./associativearray"),
    "gameObjects": require("cartesian-system-lite/src/gameobjects/index.js"),
    "cameraGrid": require("cartesian-system-lite/src/cameragrid"),
};

for(var i in __CartesianSystemLite__)
{
    CartesianSystemLite[i] = __CartesianSystemLite__[i];
}

// Export
module.exports = CartesianSystemLite;
global.CartesianSystemLite = CartesianSystemLite;