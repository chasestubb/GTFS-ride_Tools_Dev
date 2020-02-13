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

    stopsPerAgency: function(agency, routes, trips, stop_times){
        var num = 0;
        for (var i = 0; i < stop_times.length; i++){
            var match = stop_times[i].trip_id;
            for ( var j = 0; j < trips.length; j++){
                var match2 = trips[j].trip_id;
                //var compare = match.localeCompare(match2);
                //if(compare == 0){
                if (match == match2){
                    console.log("match = " + match + ", match2 = " + match2)
                    if (match == match2){
                            var trip_route = trips[j].route_id;
                            for ( var k = 0; k < routes.length; k++){
                                var match3 = routes[k].route_id;
                                var compare2 = match3.localeCompare(trip_route);
                                if(compare2 == 0)
                                console.log("match3 = " + match3 + ", trip_route = " + trip_route)
                                if (match3 == trip_route)
                                    num++;
                        }
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
        var days = [];
        for (var i = 0; i < trips.length; i++){
            var match = trips[i].route_id;
            var compare = match.localeCompare(route.route_id);
            if (compare == 0){
                for ( j = 0; j < calendar.length; j++){
                    var match2 = calendar[j].service_id;
                    var match3 = trips[i].service_id;
                    var compare2 = match3.localeCompare(match2);
                    if (compare2 == 0){
                        if (calendar[j].monday == 1)
                            days.push("M");
                        if (calendar[j].tuesday == 1)
                            days.push("T");
                        if (calendar[j].wednesday == 1)
                            days.push("W");
                        if (calendar[j].thursday == 1)
                            days.push("R");
                        if (calendar[j].friday == 1)
                            days.push("F");
                        if (calendar[j].saturday == 1)
                            days.push("S");
                        if (calendar[j].sunday == 1)
                            days.push("U");
                    }
                }
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
    countStopRiders: function(board_alights, stop){
        var count = 0;
        for ( var i = 0; i < board_alights.length; i++){
        var match = board_alights[i].stop_id;
        var compare = match.localeCompare(stop.stop_id);
        if (compare == 0)
            count = count + (board_alights[i].boardings)
        }
        return count;
    },
    countAgencyRiders: function(agency, board_alights, trips, routes){
        var count = 0;
        for ( var i = 0; i < routes.length; i++){
            var match = routes[i].agency_id;
            var compare = match.localeCompare(agency.agency_id);
            if (compare == 0){
                for ( var j = 0; j < trips.length; j++){
                    var match2 = trips[j].route_id;
                    var compare2 = match2.localeCompare(routes[i].route_id);
                    if (compare2 == 0){
                        for ( var k = 0; k < board_alights.length; k++){
                            var match3 = board_alight[k].trip_id
                            var compare3 = match3.localeCompare(trips[j].trip_id)
                            if (compare3 == 0){
                                count = count + (board_alights[k].boardings);
                            }
                        }
                    }
                }
            }
        }
    },

    countRouteRiders: function(route, board_alights, trips){
        var count = 0;
        for ( var j = 0; j < trips.length; j++){
            var match = trips[j].route_id;
            var compare2 = match2.localeCompare(route.route_id);
            if (compare2 == 0){
                for ( var k = 0; k < board_alights.length; k++){
                    var match3 = board_alight[k].trip_id
                    var compare3 = match3.localeCompare(trips[j].trip_id)
                    if (compare3 == 0){
                        count = count + (board_alights[k].boardings);
                    }
                }
            }
        }
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
    serviceException: function(trip, dates){
        exceptions = [];
        for ( var i = 0; i < dates.length; i++){
            match = dates[i].trip_id;
            compare = match.localeCompare(trip.trip_id);
            if ( compare == 0){
                exception.push(dates[i].date, ": ", dates[i].exception_type);
            }
        }
        for ( var j = 0; j < exceptions.length; j++){
            if (exception[j] == 1)
                exceptions[j] = "Added\n";
            if (exceptions[j] == 0)
                exceptions[j] = "Removed\n";
        }

    },
    
    orphanTrip(trip, routes){
        var orphan = 0;
        for (var i = 0; i < routes.length, i++){
            var match = routes[i].route_id;
            var compare = match.localeCompare(trip.route_id);
            if (compare == -1){
                orphan = 1;
            }
        }
        return orphan;
    },
    orphanStop(stop_time, trips){
        var orphan = 0;
        for ( var i = 0; i < trips.length; i++) {
            var match = trips[i].trip_id;
            var compare = match.localeCompare(stop_time.trip_id);
            if (compare == -1){
                orphan = 1;
            }
        }
    },
    vehicleCapacity(trip, trip_capacity){
        capacity_numbers = [];
        for ( var i = 0; i < trip_capacity.length, i++){
            match = trip_capacity[i].trip_id;
            compare = match.localeCompare(trip.trip_id);
            if (compare == 1){
                capacity_numbers.push(trip_capacity[i].vehicle_description, trip_capacity[i].seated_capacity, trip_capacity[i].standing_capacity);
            }
        }
        return capacity_numbers;
    }
}


function Info(){
    var num_agency = agency.length;
    var num_routes = routes.length;
    console.log("This feed started on "+ feed_info.feed_start_date + "and ended on " + feed_info.feed_end_date);
    console.log("Ridership feed began on " + ride_feed_info.start_date + "and ended on " + ride_feed_info.end_date);
    console.log("This feed has" + num_agency + "agencies");
    console.log("Included agencies are:");
    for (var i = 0; i < num_agency; i++){
        console.log(agency[i].agency_name + "\n");
    }
    for (var j = 0; j < num_agency; j++){
        num_routes = routesPerAgency(agency[j], routes);
        num_stops = stopsPerAgency(agency[j], routes, trips, stops_times)
        var num_ag_riders = countAgencyRiders(agency[j], board_alights, trips, routes);
        console.log("Agency " + agency[j].agency_name + " has "+ num_routes + "routes" + " and " + num_stops + " stops\n" + "and " + num_ag_riders + "boardings\n")
        
    }
    for (var k = 0; k < num_routes; k++){
        var days = serviceDays(routes[k], trips, calendar);
        var route_riders = countRouteRiders(routes[k], board_alights, trips);
        console.log("Route " + routes[k].route_long_name + "has active trip service on " + days);
        var starts = serviceStart(routes[k], trips, frequencies);
        var end = serviceEnd(routes[k], trips, frequencies);
        console.log("Route " + routes[k].route_long_name + "has service hours starting at" + starts + "and ending at " + end);
        console.log("Route" + route[k].route_long_name + "has " + route_riders + "riders");

    }
    for (var x = 0; x < trips.length(); x++){
        var num_boardings = countTripRiders(board_alights, trips[x]);
        var has_ridership = findTripRecordUse(board_alights, trips[x]);
        var exceptions = serviceException(trips[x], calendar_dates);
        var orphan = orphanTrip(trips[x], routes);
        var capacities = vehicleCapacity(trips[x], trip_capacity);
        if ( orphan == -1){
            console.log("Trip " + trip[x].trip_id + "has no routes!");
        }
        if (has_ridership == 0)
            console.log("Trip " + trip[x].trip_id + " has ridership data\n");
        else if (has_ridership == 1)
            console.log("Trip " + trip[x].trip_id + " does not have ridership data\n");

        console.log("Trip " + trip[x].trip_id + "has " + num_boardings + "boardings");
        console.log("Trip " + trip[x] + "has execeptions: " + exceptions);
        console.log("The vehicles on this trip have the following capacities: " + capacities);
        avg_rider = num_boardings / 7;
        console.log("The average number of riders per day is " + avg_rider);

        
    }

    var avg_trip = trips.length / 7;

    console.log("The average amount of trips per day is " + avg_trip);

    for (var y = 0; y < stops.length; y++){
        var has_ridership = findStopRecordUse(board_alights, stops[y]);
        var orphan = orphanStop(stops[y], trips);
        if (orphan == 1){
            console.log("Stop " + stop[y].stop_id + "is not within a trip!");
        }
        if (has_ridership == 0)
            console.log("Stop " + stop[y].stop_id + " has ridership data\n");
        else if (has_ridership == 1)
            console.log("Trip " + stop[y].stop_id + " does not have ridership data\n");

        num_boardings = countStopRiders(board_alights, stops[y]);
        console.log("Stop " + stops[y].stop_id + "has " + num_boardings + "boardings");
    }

}