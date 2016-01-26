/**
 * Created by francis on 24/01/16.
 */

var assert = require('assert');
var cytoscape = require('cytoscape');
var fs = require('fs');
var path = require('path');

describe("model tests", function() {
    it("simple graph", function() {
        var cy = cytoscape();
        cy.add({ group: "nodes", data: { id: 0 } });
        cy.add({ group: "nodes", data: { id: 1 } });
        cy.add({ group: "edges", data: { id: 2, source: 0, target: 1 } });
        assert.equal(2, cy.nodes().size());
        assert.equal(1, cy.edges().size());
    });

    it("build graph", function (done) {
        var cy = cytoscape();
        var dataPath = path.join(__dirname, "../chargers.json");
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

});