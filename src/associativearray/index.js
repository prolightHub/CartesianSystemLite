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