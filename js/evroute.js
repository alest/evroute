var OSRM = require('osrm');

var Charger = function(level, coord) {
    this.level = level;
    this.coord = coord;
};

Charger.prototype.chargeTime = function(energy, power) {
    return energy / power;
};

// EV parameters
function EvParams(bat, eff, pwr) {
    this.bat = bat;
    this.eff= eff;
    this.pwr = pwr;
};

module.exports = {
    Charger: Charger
};