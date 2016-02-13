var OSRM = require('osrm');

var vehicules = {
    'spark': {
        'battery_kwh': 18.0
    }
};

/*
 * Compute energy for a segment
 * @param  {number} time - travel time (h)
 * @param {number} dist - total distance (km)
 */
var computeEnergy = function(time, dist) {
    var v = Math.max(60, dist / time);
    var coef = { 'a': 0.0024, 'b': 0.3156, 'c': 25.0939};
    var kwh = dist * 0.01 * (coef.a * v * v - coef.b * v + coef.c);
    return kwh;
};

module.exports = {
    vehicules: vehicules,
    computeEnergy: computeEnergy
};