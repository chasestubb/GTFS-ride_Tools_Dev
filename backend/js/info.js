module.exports = {
    routesPerAgency: function(agency, routes){
        var peragency = 0;
        for (var i = 0; i < routes.length; i++){
            var match = agency.agency_id.localeCompare(routes[i].agency_id);
            if (match == 0)
                peragency++;
        }
        return peragency;
    },

    stopsPerAgency: function(agency, routes, trips, stops){
        var num = 0;
        for (var i = 0; i < stops.length; i++){
            var match = stops[i].trip_id; // stops.txt does not contain trip_id
            for ( var j = 0; j < trips.length; j++){
                var match2 = trips[j].trip_id;
                //var compare = match.localeCompare(match2);
                //if(compare == 0){
                //console.log("match = " + match + ", match2 = " + match2)
                if (match == match2){
                        var trip_route = trips[j].route_id;
                        for ( var k = 0; k < routes.length; k++){
                            var match3 = routes[k].route_id;
                            //var compare2 = match3.localeCompare(trip_route);
                            //if(compare2 == 0)
                            //console.log("match3 = " + match3 + ", trip_route = " + trip_route)
                            if (match3 == trip_route)
                                num++;
                        }
                }
            }
        }
        return num;
    },

    serviceStart: function(route, trips, frequencies){
        var arrival = 0;
        for (var j = 0; j < trips.length(); j++){
            var match2 = trips[j].route_id;
            var compare = match.localeCompare(route.route_id);
            if (compare == 0){
                for (var i = 0; i < frequencies.length; i++){
                    var match3 = frequencies[i].trip_id;
                    var tripid = trips[j].trip_id;
                    var compare2 = trip.localeCompare(match3);
                    if (compare2 == 0){
                        arrival.push(frequencies[i].start_time);     
                        }
                    }
                }
            }
        return arrival;
    },


    serviceEnd: function(route, trips, frequencies){
        var end = 0;
        for (var j = 0; j < trips.length(); j++){
            var match2 = trips[j].route_id;
            var compare = match.localeCompare(route.route_id);
            if (compare == 0){
                for (var i = 0; i < frequencies.length; i++){
                    var match3 = frequencies[i].trip_id;
                    var tripid = trips[j].trip_id;
                    var compare2 = trip.localeCompare(match3);
                    if (compare2 == 0){
                        end.push(frequencies[i].end_time);     
                        }
                    }
                }
            }
        return end;
    },


    serviceDays: function(route, trips, calendar){
        var days;
        for (var i = 0; i < trips.length; i++){
            var match = trips[i].route_id;
            var compare = match.localeCompare(route.route_id);
            if (compare == 0){
                if (trips[i].service_id == "WE"){
                        days = "weekends";
                }
                else
                    days = "weekdays";
            }
        }
        return days;
    },

    countTripRiders: function(board_alights, trip){
        var count = 0;
        for ( var i = 0; i < board_alights.length; i++){
        var match = board_alights[i].trip_id;
        var compare = match.localeCompare(trip.trip_id);
        if (compare == 0)
            count = count + (board_alights[i].boardings)
        }
        return count;
    },
    fcountStopRiders: function(board_alights, stop){
        var count = 0;
        for ( var i = 0; i < board_alights.length; i++){
        var match = board_alights[i].stop_id;
        var compare = match.localeCompare(stop.stop_id);
        if (compare == 0)
            count = count + (board_alights[i].boardings)
        }
        return count;
    },

    findTripRecordUse: function(board_alights, trips){
        var found;
        for ( var i = 0; i < board_alights.length; i++){
            var match = board_alights[i].trip_id;
            var compare = match.localeCompare(trip.trip_id);
            if ( compare == 0){
                if (board_alights[i].record_use == 0)
                    found = 0;
                else
                    found = 1;
            }
        }
        return found;
    },

    findStopRecordUse: function(board_alights, stop){
        var found;
        for ( var i = 0; i < board_alights.length; i++){
            var match = board_alights[i].stop_id;
            var compare = match.localeCompare(stop.stop_id);
            if ( compare == 0){
                if (board_alights[i].record_use == 0)
                    found = 0;
                else
                    found = 1;
            }
        }
        return found;
    },
}

function Info(){
    var num_agency = agency.length;
    var num_routes = routes.length;
    console.log("This feed started on "+ feed_info.feed_start_date + "and ended on " + feed_info.feed_end_date);
    console.log("This feed has" + num_agency + "agencies");
    console.log("Included agencies are:");
    for (var i = 0; i < num_agency; i++){
        console.log(agency[i].agency_name + "\n");
    }
    for (var j = 0; j < num_agency; j++){
        num_routes = routesPerAgency(agency[i], routes);
        num_stops = stopsPerAgency(agency[i], routes, trips, stops)
        console.log("Agency " + agency[j].agency_name + " has "+ num_routes + "routes" + " and " + num_stops + " stops\n")
    }
    for (var k = 0; k < num_routes; k++){
        var days = serviceDays(routes[k], trips, calendar);
        console.log("Route " + routes[k].route_long_name + "has active trip service on " + days);
        var starts = serviceStart(routes[k], trips, frequencies);
        var end = serviceEnd(routes[k], trips, frequencies);
        console.log("Route " + routes[k].route_long_name + "has service hours starting at" + starts + "and ending at " + end);

    }
    for (var x = 0; x < trips.length(); x++){
        var num_boardings = countTripRiders(board_alights, trips[x]);
        var has_ridership = findTripRecordUse(board_alights, trips[x]);
        if (has_ridership == 0)
            console.log("Trip " + trip[i].trip_id + " has ridership data\n");
        else if (has_ridership == 1)
            console.log("Trip " + trip[i].trip_id + " does not have ridership data\n");

        console.log("Trip " + trip[i].trip_id + "has " + num_boardings + "boardings");
        avg_rider = num_boardings / 7;
        console.log("The average number of riders per day is " + avg_rider);
    }

    var avg_trip = trips.length / 7;

    console.log("The average amount of trips per day is " + avg_trip);

    for (var y = 0; y < stops.length; y++){
        var has_ridership = findStopRecordUse(board_alights, trips[x]);
        if (has_ridership == 0)
            console.log("Stop " + stop[i].stop_id + " has ridership data\n");
        else if (has_ridership == 1)
            console.log("Trip " + stop[i].stop_id + " does not have ridership data\n");

        num_boardings = countStopRiders(board_alights, stops[y]);
        console.log("Stop " + stops[i].stop_id + "has " + num_boardings + "boardings");
    }

}


