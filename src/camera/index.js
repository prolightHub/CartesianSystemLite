
var Rect = require("../gameobjects/rect.js");

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

    var self = this;

    this.body.updateBoundingBox = function()
    {
        this.boundingBox.minX = self.focusX - self.halfWidth;
        this.boundingBox.minY = self.focusY - self.halfHeight;
        this.boundingBox.maxX = self.focusX + self.halfWidth;
        this.boundingBox.maxY = self.focusY + self.halfHeight;
    };
};

module.exports = Camera;