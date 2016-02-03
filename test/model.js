/**
 * Created by francis on 24/01/16.
 */

var assert = require('assert');
var cytoscape = require('cytoscape');
var fs = require('fs');
var path = require('path');
var OSRM = require('osrm');
var osrm = new OSRM("quebec-latest.osrm");

var dataPath = path.join(__dirname, "../chargers.json");

var loadChargers = function(path, proc) {
    fs.readFile(dataPath, function(err, data) {
        if (err) throw err;
        proc(JSON.parse(data));
    });
};

var chargerCoordinates = function(entry) {
    return [entry.LatLng.Lat, entry.LatLng.Lng];
};

describe("basic", function() {
    it("simple graph", function() {
        var cy = cytoscape();
        cy.add({ group: "nodes", data: { id: 0 } });
        cy.add({ group: "nodes", data: { id: 1 } });
        cy.add({ group: "edges", data: { id: 2, source: 0, target: 1 } });
        assert.equal(2, cy.nodes().size());
        assert.equal(1, cy.edges().size());
    });

    it("load chargers", function (done) {
        var cy = cytoscape();

        fs.readFile(dataPath, function(err, data) {
            if (err) throw err;
            var chargers = JSON.parse(data);
            assert.equal(584, chargers.length);
            var quickChargers = chargers.filter(function(elem) {
                return elem.Level === 3;
            });
            assert.equal(25, quickChargers.length);
            for (var i = 0; i < quickChargers.length; i++) {
                cy.add({ group: "nodes", data: { id: i }});
            }
            assert.equal(25, cy.nodes().size());
            done();
        });
    });
    it("osrm route", function(done) {
        loadChargers(dataPath, function(chargers) {
            var quickChargers = chargers.filter(function(elem) {
                return elem.Level === 3;
            });
            for (var i = 0; i < quickChargers.length; i++) {
                for (var j = 0; j < quickChargers.length; j++) {
                    if (i === j)
                        continue;
                    var c0 = quickChargers[i];
                    var c1 = quickChargers[j];
                    var src = chargerCoordinates(c0);
                    var dst = chargerCoordinates(c1);
                    var options = {
                        coordinates: [src, dst],
                        compression: false
                    };
                    osrm.route(options, function(err, route) {
                        assert.ifError(err);
                        assert.ok(route.route_summary);
                    });
                }
            }
            done();
        });
    });
});
