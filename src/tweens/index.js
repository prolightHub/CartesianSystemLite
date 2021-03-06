
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
    },
    Angle: {
        resolveAngle: function(a)
        {
            a = a % 360;
            if(a < 0)
            {
                return 360 - Math.abs(a);  
            }
            return a;
        },
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