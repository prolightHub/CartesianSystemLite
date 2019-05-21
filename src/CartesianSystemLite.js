
var makeLevel = require("./makeLevel");

/**
 * @namespace CartesianSystemLite
 * 
 * @version 0.4.6
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

/** 
 *  Expects :
 *  { 
 *      level: { 
 *          width: Number, 
 *          height: Number
 *      }, 
 *      camera: {
 *          width: Number,
 *          height: Number
 *      }
 *  }
 */
var level, camera;
CartesianSystemLite = function(config)
{
    config.level = config.level || {};
    config.camera = config.camera || {};
    config.cameraGrid = config.cameraGrid || {};

    makeLevel.apply(this, arguments);

    level = this.level.setSize(
        config.level.x || 0, 
        config.level.y || 0, 
        config.level.width || config.camera.width || 0,
        config.level.height || config.camera.height || 0);
    
    camera = this.camera = new __CartesianSystemLite__.Camera(
        config.camera.x || 0, 
        config.camera.y || 0, 
        config.camera.width, 
        config.camera.height);
    
    var cameraGrid = CartesianSystemLite.prototype.cameraGrid;

    var cellWidth = config.cameraGrid.cellWidth || 100;
    var cellHeight = config.cameraGrid.cellHeight || 100;

    cameraGrid.setup(
        Math.floor(this.level.width / cellWidth), 
        Math.floor(this.level.height / cellHeight), 
        cellWidth, 
        cellHeight);
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
module.exports = {
    CartesianSystemLite: CartesianSystemLite,
    level: level,
    camera: camera
};
global.CartesianSystemLite = CartesianSystemLite;