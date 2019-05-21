
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