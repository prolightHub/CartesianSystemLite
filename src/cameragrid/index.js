

/**
 * @namespace CartesianSystemLite.prototype.cameraGrid
 */

var cameraGrid = [];

cameraGrid.setup = function(cols, rows, cellWidth, cellHeight)
{
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.halfCellWidth = cellWidth / 2;
    this.halfCellHeight = cellHeight / 2;

    this.setSize(cols, rows);
};
cameraGrid.setSize = function(cols, rows)
{
    this.length = 0;
    
    for(var col = 0; col < cols; col++)
    {
        this.push([]);

        for(var row = 0; row < rows; row++)
        {
            this[col].push({});
        }
    }

    this.cols = cols;
    this.rows = rows;

    this.maxCol = this.length - 1;
    this.maxRow = this[0].length - 1;

    this.minCol = 0;
    this.minRow = 0;
};
cameraGrid.getPlace = function(x, y)
{
    return {
        col: Math.max(Math.min(Math.round((x - this.halfCellWidth) / this.cellWidth), this.maxCol), this.minCol),
        row: Math.max(Math.min(Math.round((y - this.halfCellHeight) / this.cellHeight), this.maxRow), this.minRow)
    };
};
cameraGrid.addReference = function(object) 
{
    var index = object._arrayName + object._id;
    var toSet = {
        arrayName: object._arrayName,
        id: object._id
    };

    var upperLeft = this.getPlace(object.body.boundingBox.minX, object.body.boundingBox.minY);
    var lowerRight = this.getPlace(object.body.boundingBox.maxX, object.body.boundingBox.maxY);

    for(var col = upperLeft.col; col <= lowerRight.col; col++)
    {
        for(var row = upperLeft.row; row <= lowerRight.row; row++)
        {
            this[col][row][index] = toSet;
        }
    }
    
    object._upperLeft = upperLeft;
    object._lowerRight = lowerRight;
};
cameraGrid.removeReference = function(object) 
{
    var index = object._arrayName + object._id;

    var upperLeft = object._upperLeft,
        lowerRight = object._lowerRight;

    for(var col = upperLeft.col; col <= lowerRight.col; col++)
    {
        for(var row = upperLeft.row; row <= lowerRight.row; row++)
        {
            delete this[col][row][index];
        }
    }
};
cameraGrid.setProperties = function(object)
{
    Object.defineProperty(object, "_upperLeft", 
    {
        value: undefined,
        enumerable: false
    });
    Object.defineProperty(object, "_lowerRight", 
    {
        value: undefined,
        enumerable: false
    });
};

module.exports = cameraGrid;