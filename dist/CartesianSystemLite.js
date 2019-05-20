(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
var CartesianSystemLite = {
    Tweens: require("./tweens")
};

var _CartesianSystemLite = CartesianSystemLite;

CartesianSystemLite = function(config)
{
    this.level = {};
};
CartesianSystemLite.prototype = {
    "associativeArray": require("./associativearray")
};

for(var i in _CartesianSystemLite)
{
    CartesianSystemLite[i] = _CartesianSystemLite[i];
}

module.exports = CartesianSystemLite;

global.CartesianSystemLite = CartesianSystemLite;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./associativearray":2,"./tweens":3}],2:[function(require,module,exports){
var Tweens = require("../tweens/index.js");
var defineHidden = Tweens.Object.defineHidden;

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
},{"../tweens/index.js":3}],3:[function(require,module,exports){
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

module.exports = Tweens;
},{}]},{},[1]);
