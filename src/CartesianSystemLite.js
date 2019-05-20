
/**
 * @namespace CartesianSystemLite
 */

var CartesianSystemLite = {
    Tweens: require("./tweens")
};

var __CartesianSystemLite__ = CartesianSystemLite;

CartesianSystemLite = function(config)
{
    this.level = {};
};
CartesianSystemLite.prototype = {
    "associativeArray": require("./associativearray")
};

for(var i in __CartesianSystemLite__)
{
    CartesianSystemLite[i] = __CartesianSystemLite__[i];
}

// Export
module.exports = CartesianSystemLite;
global.CartesianSystemLite = CartesianSystemLite;