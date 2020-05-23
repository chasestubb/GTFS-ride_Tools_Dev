var FILEPATH = "clean/";
module.exports = {
    Clean: function(){
        //Removes orphan stops (stops that are never visited on a trip)
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
        //CREATE UPDATED STOPS FILE
        var stopsCSV = csvStringifySync(stops, {header: true, columns: ["stop_id", "stop_code", "stop_name", "stop_desc", "stop_lat", "stop_lon", "zone_id", "stop_url", "location_type", "parent_station", "stop_timezone", "wheelchair_boarding", "level_id", "platform_code"]})
        fs.writeFileSync(FILEPATH + "stops.txt", stopsCSV);
    }
}

module.exports.Clean();
