var FILEPATH = "clean/";
var FILENAME = "clean_feed.zip"
var fs = require('fs');
var csvStringifySync = require('csv-stringify/lib/sync');

module.exports = {
    removeOrphanStops:function(){
        var i, j;
        for (j = 0; j < stops.length;){
            if (stop_times.length == stops.length){
                console.log("done");
                break;
            }
            for (i = 0; i < stop_times.length; i++){
                var found = 0;
 //               console.log("checking stop_times " + stop_times[i].stop_id + " and stop " + stops[j].stop_id);
                if (stop_times[i].stop_id == stops[j].stop_id){
                    found = 1;
                    break;                      
                }
            }
            if (found == 0){
                stops.splice(j, 1);
            }
            else if (found == 1){
                j = j + 1;
            }
        }
        console.log(stops)
    },
    removeOrphanRoutes: function(){
        var i, j;
        for (j = 0; j < routes.length;){
            if (routes.length == trips.length){
                console.log("done");
                break;
            }
            for (i = 0; i < trips.length; i++){
                var found = 0;
                if (trips[i].route_id == routes[j].route_id){
                    found = 1;
                    break;                      
                }
            }
            if (found == 0){
                routes.splice(j, 1);
            }
            else if (found == 1){
                j = j + 1;
            }
        }
        console.log(routes)
    },
    Clean: function(){
        //Removes orphan stops (stops that are never visited on a trip)
        this.removeOrphanStops();
        //Remove routes with no trip
        this.removeOrphanRoutes();
        //CREATE UPDATED STOPS FILE
        var stopsCSV = csvStringifySync(stops, {header: true, columns: ["stop_id", "stop_code", "stop_name", "stop_desc", "stop_lat", "stop_lon", "zone_id", "stop_url", "location_type", "parent_station", "stop_timezone", "wheelchair_boarding", "level_id", "platform_code"]})
        var routesCSV = csvStringifySync(routes, {header: true, columns: ["agency_id","route_id","route_short_name","route_long_name","route_desc","route_type","route_url","route_color","route_text_color","route_sort_order","min_headway_minutes","eligibility_restricted"]})
        fs.writeFileSync(FILEPATH + "stops.txt", stopsCSV);
        fs.writeFileSync(FILEPATH + "routes.txt", routesCSV);
    }
}

module.exports.Clean();
