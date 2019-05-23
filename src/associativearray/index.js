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