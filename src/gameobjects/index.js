var associativeArray = require("../associativearray/index.js");
var cameraGrid = require("../cameragrid/index.js");

/**
 * @namespace CartesianSystemLite.prototype.gameObjects
 */

var gameObjects = associativeArray([], undefined, "gameObjects");

gameObjects.used = {};
gameObjects.window = function(cam, expand)
{
    var used = {};
    this.used = {};

    cam = cam || this.imports.camera;

    var col, row, cell, i, object, index;

    var left = cam._upperLeft.col, right = cam._lowerRight.col,
        up = cam._upperLeft.row, down = cam._lowerRight.row;

    // Expansion techniques
    if(expand)
    {
        if(typeof expand === "object")
        {
            left += expand.left;
            right += expand.right;
            up += expand.up;
            down += expand.down;
        }else{
            left -= expand;
            right += expand;
            up -= expand;
            down += expand;
        }

        // Keep numbers inside cameraGrid
        left = Math.max(left, 0);
        right = Math.min(right, cameraGrid.maxCol);
        up = Math.max(up, 0);
        down = Math.min(down, cameraGrid.maxRow);
    }

    for(col = left; col <= right; col++)
    {
        for(row = up; row <= down; row++)
        {
            cell = cameraGrid[col][row];

            for(i in cell)
            {
                // Already used.
                if(used[i])
                {
                    continue;
                }

                // Is the same as getObject(name)
                object = this[this.references[cell[i].arrayName]][cell[i].id];

                // Refreshes the object's cell place after it has been moved 
                if(object.body.physics.moves)
                {
                    cameraGrid.removeReference(object);
                    cameraGrid.addReference(object);
                }

                // Save info for rendering
                index = this.references[object._arrayName];
                this.used[index] = this.used[index] || [];
                this.used[index].push(object._id);

                // Show we've used the object for this loop
                used[i] = true;
            }
        }
    }
};
gameObjects.drawAndUpdate = function()
{
    var i, j;

    for(i in this.used)
    {
        for(j = 0; j < this.used[i].length; j++)
        {
            this[i][this.used[i][j]].draw();
            this[i][this.used[i][j]].update();
        }
    }
};
gameObjects.draw = function()
{
    var i, j;

    for(i in this.used)
    {
        for(j = 0; j < this.used[i].length; j++)
        {
            this[i][this.used[i][j]].draw();
        }
    }
};
gameObjects.update = function()
{
    var i, j;

    for(i in this.used)
    {
        for(j = 0; j < this.used[i].length; j++)
        {
            this[i][this.used[i][j]].update();
        }
    }
};
gameObjects.eachObjectsInCamera = function(callback)
{
    var i, j;

    for(i in this.used)
    {
        for(j = 0; j < this.used[i].length; j++)
        {
            callback(this[i][this.used[i][j]]);
        }
    }
};

module.exports = gameObjects;