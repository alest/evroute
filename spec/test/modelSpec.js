/**
 * Created by francis on 24/01/16.
 */

var assert = require('assert');
var cytoscape = require('cytoscape');
var fs = require('fs');
var path = require('path');

describe("evroute test suite", function() {

    it("simple graph 1", function() {
        var cy = cytoscape({
            elements: {
                nodes: [
                    {data: {id: 0}},
                    {data: {id: 1}},
                ],
                edges: [
                    {data: {id: 3, source: 0, target: 1}}
                ]
            }
        });
        expect(cy.nodes().size()).toEqual(2);
        expect(cy.edges().size()).toEqual(1);
    });

    it("simple graph 2", function() {
        var cy = cytoscape();
        cy.add({ group: "nodes", data: { id: 0 } })
        cy.add({ group: "nodes", data: { id: 1 } })
        cy.add({ group: "edges", data: { id: 2, source: 0, target: 1 } })
        expect(cy.nodes().size()).toEqual(2);
        expect(cy.edges().size()).toEqual(1);
    });

    it("load graph", function () {
        var cy = cytoscape();
        var dataPath = path.join(__dirname, "../../chargers.json");
        var chargers = JSON.parse(fs.readFileSync(dataPath));

        expect(chargers.length).toEqual(584);

        var quickChargers = chargers.filter(function(elem) {
            return elem.Level === 3;
        });

        expect(quickChargers.length).toEqual(25);

        for (var i = 0; i < quickChargers.length; i++) {
            cy.add({ group: "nodes", data: { id: i }});
        }

        console.log(quickChargers);
    });
});