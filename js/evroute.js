var OSRM = require('osrm');

function Charger(level, coord) {
    this.level = level;
    this.coord = coord;
};

function EV(batteryCapacity, efficiency, chargerPower) {
    this.batteryCapacity = batteryCapacity;
    this.efficiency = efficiency;
    this.chargerPower = chargerPower;
};

var computeChargeTime(energy, power) {
    return energy / power;
};

module.exports = {
    Charger: Charger
};