var feed_creation = require('../js/info.js');
var assert = require('assert');

//test matching method
describe("Matching id test", function(){
    it("The number of matched ids should be 3", function(){
        var agency = {
            agency_id: "A1"
        }
        var routes = [];
        var route1 = {
            route_name: "Route 1",
            agency_id: "A1"
        }
        routes.push(route1);
        var route2 = {
            route_name: "Route 2",
            agency_id: "B2"
        }
        routes.push(route2);
        var route3 = {
            route_name: "Route 3",
            agency_id: "B2"
        }
        routes.push(route3);
        var route4 = {
            route_name: "Route 4",
            agency_id: "A1"
        }
        routes.push(route4);
        var route5 = {
            route_name: "Route 5",
            agency_id: "A1"
        }
        routes.push(route5);
        var match = info.routesPerAgency(agency, routes);
        assert.equal(3, match);
        });
});

//test counting method
describe("Counting method", function(){
    it("The number counted should matched expected count", function(){
        var trip = {
            trip_id: "T1"
        }

        var board_alight_arr = [];
        var board_alight1 = {
            trip_id: "T1",
            boardings: 5
        }
        board_alight_arr.push(board_alight1);
        var board_alight2 = {
            trip_id: "T2",
            boardings: 4
        }
        board_alight_arr.push(board_alight2);
        var board_alight3 = {
            trip_id: "T1",
            boardings: 5
        }
        board_alight_arr.push(board_alight3);
        var total = info.countTripRiders(board_alight_arr, trip);
        assert.equal(10, total);
    });
});