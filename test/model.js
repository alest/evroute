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

var filterFastChargers = function(chargers) {
    return chargers.filter(function (elem) {
        return elem.Level === 3;
    });
};

var findChargerByUid = function(chargers, uid) {
    for (var i = 0; i < chargers.length; i++) {
        var ids = chargers[i].Ids;
        for (var j = 0; j < ids.length; j++) {
            if (ids[j] === uid)
                return chargers[i];
        }
    }
    return undefined;
};

describe("basic", function() {
    it("simple graph", function() {
        var cy = cytoscape();
        cy.add({ group: "nodes", data: { id: 0 } });
        cy.add({ group: "nodes", data: { id: 1 } });
        cy.add({ group: "edges", data: { id: 2, source: 0, target: 1 } });
        assert.equal(2, cy.nodes().size());
        assert.equal(1, cy.edges().size());

        var aStar = cy.elements().aStar({ root: "#0", goal: "#1", directed: true});
        assert(aStar.path.length === 3);
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
        this.timeout(10000);
        loadChargers(dataPath, function(chargers) {
            var quickChargers = chargers.filter(function(elem) {
                return elem.Level === 3;
            });
            var n = 3;
            var count = 0;
            var total = n * n - n;
            for (var i = 0; i < n; i++) {
                for (var j = 0; j < n; j++) {
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
                        count++;
                        if (count === total) {
                            done();
                        }
                    });
                }
            }
        });
    });

    it("charger graph", function(done) {
        this.timeout(10000);
        loadChargers(dataPath, function(chargers) {
            var quickChargers = filterFastChargers(chargers);
            console.log(quickChargers.length);

            var counter = 0;
            var cy = cytoscape();
            for (var i = 0; i < quickChargers.length; i++) {
                var qc = quickChargers[i];
                qc.id = i;
                cy.add({ group: "nodes", data: qc });
                counter++;
            }

            for (var i = 0; i < quickChargers.length; i++) {
                for (var j = 0; j < quickChargers.length; j++) {
                    if (i == j)
                        continue;
                    cy.add({group: "edges", data: { id: counter, source: i, target: j }})
                    counter++;
                }
            }

            console.log(cy.nodes().size());
            console.log(cy.edges().size());

            // Montreal - Quebec
            var src = findChargerByUid(quickChargers, "46897f08-3ea4-4763-8f15-690371c482bc");
            var dst = findChargerByUid(quickChargers, "379db2c0-821c-4c49-8ff5-88bae15fba11");
            var srcStr = "#" + src.id;
            var dstStr = "#" + dst.id;

            var aStar = cy.elements().aStar({root: srcStr, goal: dstStr, directed: true});
            assert(aStar.distance === 1);
            done();
        });
    });

});
