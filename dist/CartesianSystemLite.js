(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){

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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./associativearray":2,"./camera":3,"./gameobjects/gameobject.js":5,"./gameobjects/rect.js":7,"./tweens":8,"cartesian-system-lite/src/cameragrid":4,"cartesian-system-lite/src/gameobjects/index.js":6}],2:[function(require,module,exports){
var Tweens = require("../tweens/index.js");
var defineHidden = Tweens.Object.defineHidden;

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
            counter: -1,
        },
        _name: oName,
        'add': function()
        {
            // Mantain the highest counter position
            var id = ++this.temp.counter;

            if(object.apply !== undefined)
            {
                // May need to use 'new' operator in some cases, but object.apply may not work.
                var item = Object.create(object.prototype);
                object.apply(item, arguments);
                this[id] = item;
            }else{
                this[id] = Array.prototype.slice.call(arguments)[0];
            }

            var item = this[id];

            defineHidden(item, "_name", this.temp.name || oName);
            defineHidden(item, "_arrayName", this._name);
            defineHidden(item, "_id", id);

            delete this.temp.name;
            return item;
        },
        'remove': function(id)
        {
            // Mantain the highest counter position
            if(id === this.temp.counter)
            {
                this.temp.counter--;
            }
            delete this[id];
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
            value: system[i]
        });
    }

    return keypair;
};

module.exports = associativeArray;
},{"../tweens/index.js":8}],3:[function(require,module,exports){

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
},{"../gameobjects/rect.js":7}],4:[function(require,module,exports){


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
},{}],5:[function(require,module,exports){

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
        boundingBox: {
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0
        },
        updateBoundingBox: Tweens.NOOP
    };

    this.update = function() {};
    this.draw = function() {};

    this.remove = function() 
    {
        gameObjects.getObject(this._arrayName).remove(this._id);
    };

    cameraGrid.setProperties(this);
}

gameObjects.addObject("gameObject", associativeArray(GameObject));

module.exports = GameObject;
},{"../associativearray/index.js":2,"../cameragrid/index.js":4,"../tweens/index.js":8,"./index.js":6}],6:[function(require,module,exports){


var associativeArray = require("../associativearray/index.js");

/**
 * @namespace CartesianSystemLite.prototype.gameObjects
 */

var gameObjects = associativeArray([], undefined, "gameObjects");


module.exports = gameObjects;
},{"../associativearray/index.js":2}],7:[function(require,module,exports){
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

    var rect = this;

    this.body.updateBoundingBox = function()
    {
        this.boundingBox.minX = rect.x;
        this.boundingBox.minY = rect.y;
        this.boundingBox.maxX = rect.x + rect.width;
        this.boundingBox.maxY = rect.y + rect.height;
    };
}

gameObjects.addObject("rect", associativeArray(Rect));

module.exports = Rect;
},{"../associativearray/index.js":2,"./gameobject.js":5,"./index.js":6}],8:[function(require,module,exports){

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
