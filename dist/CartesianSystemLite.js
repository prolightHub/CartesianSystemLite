(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){

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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./associativearray":2,"./camera":3,"./cameragrid":4,"./factory":5,"./gameobjects/circle.js":6,"./gameobjects/gameobject.js":7,"./gameobjects/index.js":8,"./gameobjects/rect.js":9,"./tweens":11,"cartesian-system-lite/src/level":10}],2:[function(require,module,exports){
var Tweens = require("../tweens/index.js");
/**
 * @namespace CartesianSystemLite.prototype.associativeArray
 */

var associativeArray = function(object, keypair, arrayName)
{
    if(typeof keypair !== "object")
    {
        keypair = {};
    }

    var oName = arrayName || Tweens.String.lower(object.name);

    var system = {
        references: {},
        temp: { 
            lowest: undefined, // Lowest empty index
            highest: 0, // highest index
        },
        _name: oName,
        Object: object,
        'add': function()
        {
            var id = this.temp.highest + 1;

            if(this.temp.lowest !== undefined && !this.unique)
            {
                id = this.temp.lowest;
                this.temp.lowest = undefined;
            }
            if(id > this.temp.highest)
            {
                this.temp.highest = id;
            }

            if(object.apply !== undefined)
            {
                // May need to use 'new' operator in some cases, but object.apply may not work.
                var item = Object.create(object.prototype);
                object.apply(item, arguments);
                this[id] = item;
            }else{
                this[id] = arguments[0];
            }

            var item = this[id];

            Object.defineProperties(item, {
                "_name": {
                    enumerable: false,
                    writable: true,
                    configurable: true,
                    value: this.temp.name || oName
                },
                "_arrayName": {
                    enumerable: false,
                    writable: true,
                    configurable: true,
                    value: this._name
                },
                "_id": {
                    enumerable: false,
                    writable: true,
                    configurable: true,
                    value: id
                },
            });

            delete this.temp.name;
            return item;
        },
        'remove': function(id)
        {
            if(id === this.temp.highest)
            {
                this.temp.highest--;
            }
            if(this.temp.lowest === undefined || id < this.temp.lowest)
            {
                this.temp.lowest = id;
            }

            // If we destroy something that is not ourselves return a 
            // boolean to indicate wether it failed or not.
            return delete this[id];
        },
        'addObject': function(name)
        {
            if(this.references[name] !== undefined)
            {
                return;
            }
            
            var args = Array.prototype.slice.call(arguments);
            this.temp.name = args.shift();

            var item = this.add.apply(this, args);
            this.references[name] = item._id;
            return item;
        },
        'getObject': function(name)
        {
            return this[this.references[name]];
        },
        'removeObject': function(name)
        {
            delete this[this.references[name]];
            delete this.references[name];
        }
    };

    for(var i in system)
    {
        Object.defineProperty(keypair, i,  
        {
            enumerable: false,
            writable: true,
            configurable: true,
            value: system[i]
        });
    }

    return keypair;
};

module.exports = associativeArray;
},{"../tweens/index.js":11}],3:[function(require,module,exports){

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
},{"../cameragrid/index.js":4,"../gameobjects/rect.js":9,"../tweens/index.js":11}],4:[function(require,module,exports){


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

            if(this.useCellCache)
            {
                Object.defineProperty(this[col][row], "cache",
                {
                    writable : true,
                    enumerable : false,
                    value : {},
                });
            }
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
        enumerable: false,
        writable: true,
        configurable: true,
        value: {}
    });
    Object.defineProperty(object, "_lowerRight", 
    {
        enumerable: false,
        writable: true,
        configurable: true,
        value: {}
    });
};

module.exports = cameraGrid;
},{}],5:[function(require,module,exports){

var gameObjects = require("../gameobjects/index.js");
var cameraGrid = require("../cameragrid/index.js");
var associativeArray = require("../associativearray/index.js");
var Tweens = require("../tweens/index.js");

/**
 * @namespace CartesianSystemLite.prototype.factory
 */

var factory = {};

factory.add = function()
{
    var args = Array.prototype.slice.call(arguments);

    var arrayName = args[0];
    args.shift();

    var place = gameObjects[gameObjects.references[arrayName]];
    var object = place.add.apply(place, args);
    cameraGrid.addReference(object, true);
    
    return object;
};
factory.get = function(arrayName, id)
{
    return gameObjects[gameObjects.references[arrayName]][id];
};
factory.destroy = function(arrayName, id)
{ 
    var array = gameObjects[gameObjects.references[arrayName]];

    // The array doesn't exist or the object is already destroyed.
    if(!array || !array[id])
    {
        return false; // We can't destroy it
    }

    // Actually destroy the object from gameObject array (and from the world!)
    array[id].destroy();

    return true;
};

factory.addArray = function()
{
    var arrayName, GameObject;

    if(typeof arguments[0] === "string" && typeof arguments[1] === "function")
    {
        arrayName = arguments[0];
        GameObject = arguments[1];
    }
    else if(typeof arguments[0] === "function")
    {
        arrayName = Tweens.String.lower(arguments[0].name);
        GameObject = arguments[0];
    }

    return gameObjects.addObject(arrayName, associativeArray(GameObject));
};
factory.getArray = function(arrayName)
{
    return gameObjects[gameObjects.references[arrayName]];
};
factory.removeArray = function(arrayName)
{
    var array = gameObjects[gameObjects.references[arrayName]];

    if(!array)
    {
        return false; // Object does not exist
    }

    for(var i in array)
    {
        array[i].hide();
    }

    gameObjects.removeObject(arrayName);

    return true; // Object exists
};

module.exports = factory;
},{"../associativearray/index.js":2,"../cameragrid/index.js":4,"../gameobjects/index.js":8,"../tweens/index.js":11}],6:[function(require,module,exports){
var gameObjects = require("./index.js");
var associativeArray = require("../associativearray/index.js");
var GameObject = require("./gameobject.js");

/**
 * @namespace CartesianSystemLite.GameObjects.Circle
 */

function Circle(x, y, diameter)
{
    GameObject.call(this, arguments);

    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.radius = diameter / 2;

    this.body.physics.shape = "circle";

    var circle = this;

    this.body.updateBoundingBox = function()
    {
        this.boundingBox.minX = circle.x - circle.radius;
        this.boundingBox.minY = circle.y - circle.radius;
        this.boundingBox.maxX = circle.x + circle.radius;
        this.boundingBox.maxY = circle.y + circle.radius;
    };
    this.body.updateBoundingBox();
}

gameObjects.addObject("circle", associativeArray(Circle));

module.exports = Circle;
},{"../associativearray/index.js":2,"./gameobject.js":7,"./index.js":8}],7:[function(require,module,exports){

var gameObjects = require("./index.js");
var cameraGrid = require("../cameragrid/index.js");
var associativeArray = require("../associativearray/index.js");
var Tweens = require("../tweens/index.js");

/**
 * @namespace CartesianSystemLite.GameObjects.GameObject
 */

function GameObject()
{
    this.body = {
        physics: {
            shape: "",
            moves: false
        },
        boundingBox: {
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0
        },
        updateBoundingBox: Tweens.NOOP
    };

    this.update = Tweens.NOOP;
    this.draw = Tweens.NOOP;

    this.remove = function() 
    {
        // May need return in case .remove returns false, which should never happen!
        gameObjects[gameObjects.references[this._arrayName]].remove(this._id);
    };
    this.hide = function()
    {
        cameraGrid.removeReference(this);

        if(gameObjects.used[gameObjects.references[name]])
        {
            var keys = gameObjects.used[gameObjects.references[name]];
            var i = keys.indexOf(this._id);
            if(i >= 0)
            {
                keys.splice(i, 1);
            }
        }
    };
    this.destroy = function()
    {
        this.hide();
        this.remove();
    };

    cameraGrid.setProperties(this);
}

gameObjects.addObject("gameObject", associativeArray(GameObject));

module.exports = GameObject;
},{"../associativearray/index.js":2,"../cameragrid/index.js":4,"../tweens/index.js":11,"./index.js":8}],8:[function(require,module,exports){
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
},{"../associativearray/index.js":2,"../cameragrid/index.js":4}],9:[function(require,module,exports){
var gameObjects = require("./index.js");
var associativeArray = require("../associativearray/index.js");
var GameObject = require("./gameobject.js");

/**
 * @namespace CartesianSystemLite.GameObjects.Rect
 */

function Rect(x, y, width, height)
{
    GameObject.call(this, arguments);

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;

    this.body.physics.shape = "rect";

    var rect = this;

    this.body.updateBoundingBox = function()
    {
        this.boundingBox.minX = rect.x;
        this.boundingBox.minY = rect.y;
        this.boundingBox.maxX = rect.x + rect.width;
        this.boundingBox.maxY = rect.y + rect.height;
    };
    this.body.updateBoundingBox();
}

gameObjects.addObject("rect", associativeArray(Rect));

module.exports = Rect;
},{"../associativearray/index.js":2,"./gameobject.js":7,"./index.js":8}],10:[function(require,module,exports){
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
}

module.exports = level;
},{}],11:[function(require,module,exports){

/**
 * @namespace CartesianSystemLite.Tweens
 */

var Tweens = {
    String: {
        upper: function(str)
        {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        lower: function(str)
        {
            return str.charAt(0).toLowerCase() + str.slice(1);
        }
    },
    Math: {
        constrain: function(num, min, max)
        {
            return Math.min(Math.max(num, min), max);
        }
    },
    Object: {
        defineHidden: function(object, name, value)
        {
            Object.defineProperty(object, name,  
            {
                enumerable: false,
                writable: true,
                configurable: true,
                value: value
            });
        }
    }
};

Object.defineProperty(Tweens, 'NOOP', 
{
    // No-operation function used when it's too expensive to detect wether a function exists or not.
    value: function NOOP() 
    {
        // NOOP 
    },
    writable: false
});

module.exports = Tweens;
},{}]},{},[1]);
