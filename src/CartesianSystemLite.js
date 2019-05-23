
var level = require("cartesian-system-lite/src/level");

/**
 * @namespace CartesianSystemLite
 * 
 * @version 0.5.8
 */

var CartesianSystemLite = {
    Tweens: require("./tweens"),
    Camera: require("./camera"),
    GameObjects: {
        GameObject: require("./gameobjects/gameobject.js"),
        Rect: require("./gameobjects/rect.js"),
        Circle: require("./gameobjects/circle.js")
    }
};

var __CartesianSystemLite__ = CartesianSystemLite;

/** 
 *  @expects :
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
CartesianSystemLite = function(config)
{
    config.level = config.level || {};
    config.camera = config.camera || {};
    config.cameraGrid = config.cameraGrid || {};

    level.apply(this, arguments);

    this.level.setSize(
        config.level.x || 0, 
        config.level.y || 0, 
        config.level.width || config.camera.width || 0,
        config.level.height || config.camera.height || 0);
    
    this.camera = new __CartesianSystemLite__.Camera(
        config.camera.x || 0, 
        config.camera.y || 0, 
        config.camera.width, 
        config.camera.height);
    
    this.camera.imports = {
        level: this.level
    };

    var cameraGrid = CartesianSystemLite.prototype.cameraGrid;

    var cellWidth = config.cameraGrid.cellWidth || 100;
    var cellHeight = config.cameraGrid.cellHeight || 100;

    cameraGrid.useCellCache = config.cameraGrid.useCellCache || false;

    cameraGrid.setup(
        Math.floor(this.level.width / cellWidth), 
        Math.floor(this.level.height / cellHeight), 
        cellWidth, 
        cellHeight);
    
    var gameObjects = CartesianSystemLite.prototype.gameObjects;

    gameObjects.imports = {
        camera: this.camera
    };
};

CartesianSystemLite.prototype = {
    "associativeArray": require("./associativearray"),
    "gameObjects": require("./gameobjects/index.js"),
    "cameraGrid": require("./cameragrid"),
    "factory": require("./factory")
};

for(var i in __CartesianSystemLite__)
{
    CartesianSystemLite[i] = __CartesianSystemLite__[i];
}

// Export
module.exports = CartesianSystemLite;
global.CartesianSystemLite = CartesianSystemLite;