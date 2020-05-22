var csv_parse = require('csv-parse/lib/sync') // converting CSV text input into arrays or objects
var fs = require('fs');
var stops = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/stops.txt"), {columns: true})
var stop_times = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/stop_times.txt"), {columns: true})
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
    }
}

module.exports.Clean();
