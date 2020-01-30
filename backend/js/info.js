function routesPerAgency(agency, routes){
    var peragency = 0;
    for (var i = 0; i < routes.size(); i++){
        var match = agency.agency_id.localeCompare(routes[i].agency_id);
        if (match)
            peragency++;
    }
    return peragency;
}
function stopsPerAgency(agency, routes, trips, stops){
    var num = 0;
    for (var i = 0; i < stops.size; i++){
        var match = stops[i].trip_id;
        for ( var j = 0; j < trips.size; j++){
            var match2 = trips[j].trip_id;
            var compare = match.localeCompare(match2);
            if(compare){
                    var trip_route = trips[j].route_id;
                    for ( var k = 0; k < routes.size; k++){
                        var match3 = routes[k].route_id;
                        var compare2 = match3.localeCompare(trip_route);
                        if(compare2)
                            num++;
                    }
            }
        }
    }
    return num;
}

function Info(){
    var num_agency = agency.length;
    var num_routes;
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
}


