/**
 * @namespace CartesianSystemLite#level
 * 
 */

function level()
{
    this.level = {
        bounds: {}
    }; 
    this.level.setSize = function(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.updateBounds();
    };
    this.level.updateBounds = function()
    {
        this.bounds.minX = this.x;
        this.bounds.minY = this.y;
        this.bounds.maxX = this.x + this.width;
        this.bounds.maxY = this.y + this.height;
    };

    return this.level;
}

module.exports = level;