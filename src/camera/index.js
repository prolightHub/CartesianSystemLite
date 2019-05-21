
var Rect = require("../gameobjects/rect.js");
var Tweens = require("../tweens/index.js");
var cameraGrid = require("../cameragrid/index.js");
var level = require("../CartesianSystemLite.js").level;

/**
 * @namespace CartesianSystemLite.Camera
 */

var Camera = function(x, y, width, height)
{
    Rect.call(this, x, y, width, height);

    this.focusX = this.halfWidth;
    this.focusY = this.halfHeight;
    this.speed = 0.1;
    this.padding = 0;

    var camera = this;

    this.body.updateBoundingBox = function()
    {
        this.boundingBox.minX = camera.focusX - camera.halfWidth;
        this.boundingBox.minY = camera.focusY - camera.halfHeight;
        this.boundingBox.maxX = camera.focusX + camera.halfWidth;
        this.boundingBox.maxY = camera.focusY + camera.halfHeight;
    };
};
Camera.prototype.follow = function(x, y)
{
    this.angle = Math.atan2(y - this.focusY, x - this.focusX);
    this.distance = Math.sqrt(Math.pow(Math.abs(x - this.focusX), 2) + Math.pow(Math.abs(y - this.focusY), 2)) * this.speed;

    this.focusX += this.distance * Math.cos(this.angle);
    this.focusY += this.distance * Math.sin(this.angle);

    // Keep it in the grid
    this.focusX = Tweens.Math.constrain(this.focusX, level.bounds.minX + this.halfWidth, level.bounds.maxX - this.halfWidth);
    this.focusY = Tweens.Math.constrain(this.focusY, level.bounds.minY + this.halfHeight, level.bounds.maxY - this.halfHeight);

    // Get the corners' position on the grid
    this._upperLeft = cameraGrid.getPlace(
        this.focusX - this.halfWidth - cameraGrid.cellWidth * this.padding,
        this.focusY - this.halfHeight - cameraGrid.cellHeight * this.padding);

    this._lowerRight = cameraGrid.getPlace(
        this.focusX + this.halfWidth + cameraGrid.cellWidth * this.padding, 
        this.focusY + this.halfHeight + cameraGrid.cellHeight * this.padding);
};
Camera.prototype.view = function(object)
{
    if(typeof arguments[0] === "object")
    {
        var boundingBox = object.body.boundingBox;
        var x = boundingBox.minX + (boundingBox.maxX - boundingBox.minX) / 2;
        var y = boundingBox.minY + (boundingBox.maxY - boundingBox.minY) / 2;

        this.follow(x, y);
    }else{
        this.follow(arguments[0], arguments[1]);
    }
};

module.exports = Camera;