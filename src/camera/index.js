
var Rect = require("../gameobjects/rect.js");
var Tweens = require("../tweens/index.js");
var cameraGrid = require("../cameragrid/index.js");

/**
 * @namespace CartesianSystemLite.Camera
 */

var Camera = function(x, y, width, height)
{
    Rect.call(this, x, y, width, height);

    this.focusX = this.halfWidth;
    this.focusY = this.halfHeight;
    this.speed = 1;
    this.padding = 0;

    var camera = this;

    this.body.updateBoundingBox = function()
    {
        this.boundingBox.minX = camera.focusX - camera.halfWidth;
        this.boundingBox.minY = camera.focusY - camera.halfHeight;
        this.boundingBox.maxX = camera.focusX + camera.halfWidth;
        this.boundingBox.maxY = camera.focusY + camera.halfHeight;
    };

    this.body.updateBoundingBox();
};
Camera.prototype.follow = function(x, y)
{
    this.angle = Math.atan2(y - this.focusY, x - this.focusX);
    this.distance = Math.sqrt(Math.pow(x - this.focusX, 2) + Math.pow(y - this.focusY, 2)) * this.speed;

    // Move camera
    this.focusX += this.distance * Math.cos(this.angle);
    this.focusY += this.distance * Math.sin(this.angle);

    var level = this.imports.level;

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

    this.body.updateBoundingBox();
};
Camera.prototype.translate = function(translate)
{
    translate(this.x, this.y);
        
    var level = this.imports.level;

    if((level.bounds.maxX - level.bounds.minX) >= this.width)
    {
        translate(this.halfWidth - this.focusX, 0);
    }else{
        translate(-level.bounds.minX, 0);
    }
    if((level.bounds.maxY - level.bounds.minY) >= this.height)
    {
        translate(0, this.halfHeight - this.focusY);
    }else{
        translate(0, -level.bounds.minY);
    }
};
Camera.prototype.view = function(object, translate)
{
    if(typeof arguments[0] === "object")
    {
        var boundingBox = object.body.boundingBox;
        var x = boundingBox.minX + (boundingBox.maxX - boundingBox.minX) / 2;
        var y = boundingBox.minY + (boundingBox.maxY - boundingBox.minY) / 2;

        this.follow(x, y);
    }else{
        this.follow(arguments[0], arguments[1]);
        translate = arguments[2];
    }

    if(translate)
    {
        this.translate(translate);
    }
};

module.exports = Camera;