var FILEPATH = "clean/";
var FILENAME = "clean_feed.zip"
var fs = require('fs');
var {execSync} = require('child_process');
var zip = require('cross-zip');
var csvStringifySync = require('csv-stringify/lib/sync');
var orphanStops = [];
var orphanRoutes = [];
var orphanAgencies = [];
var orphanCalServiceIds = [];
var orphanCDServiceIds = [];

/*Testing purposes
var csv_parse = require('csv-parse/lib/sync') // converting CSV text input into arrays or objects
var routes = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/routes.txt"), {columns: true}) 
var stops = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/stops.txt"), {columns: true})
var stop_times = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/stop_times.txt"), {columns: true})
var trips = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/trips.txt"), {columns: true})
var agencies = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/agency.txt"), {columns: true})
*/


module.exports = {
    removeOrphanStops:function(stops, stop_times){
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
                orphanStops.push(stops[j])
                stops.splice(j, 1);
            }
            else if (found == 1){
                j = j + 1;
            }
        }
        console.log(stops)
    },
    removeOrphanRoutes: function(routes, trips){
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
                orphanRoutes.push(routes[j]);
                routes.splice(j, 1);
            }
            else if (found == 1){
                j = j + 1;
            }
        }
        console.log(routes)
    },
    countAgencies:function(routes){
        //Helper function to find how many different agencies are found in routes.
        var agency_count = 0;
        var i;
        var route_agencies = []
        for (var i = 0; i < routes.length; i++){
            route_agencies.push(routes[i].agency_id);
        }
        route_agencies.sort();
        for (var j = 0; j < route_agencies.length; j++){
            if (route_agencies[j] == route_agencies[j+1]){
                route_agencies.splice(j,1);
                j = j - 1;
            }
        }
        agency_count = route_agencies.length;
        return agency_count;
    },
    removeOrphanAgencies: function(agencies, routes){
        var i, j;
        var agency_count = this.countAgencies(routes);
        for (j = 0; j < agencies.length;){
            if (agencies.length == agency_count){
                break;
            }
            for (i = 0; i < routes.length; i++){
                var found = 0;
                if (routes[i].agency_id == agencies[j].agency_id){
                    found = 1;
                    break;                      
                }
            }
            if (found == 0){
                orphanAgencies.push(agencies[j])
                agencies.splice(j, 1);
            }
            else if (found == 1){
                j = j + 1;
            }
        }
    },
    countServiceIds:function(trips){
        var service_count = 0;
        var i;
        var service_ids = [];
        for (var i = 0; i < trips.length; i++){
            service_ids.push(trips.service_id);
        }
        service_ids.sort();
        for (var j = 0; j < service_ids.length; j++){
            if (service_ids[j] == service_ids[j+1]){
                service_ids.splice(j,1);
                j = j - 1;
            }
        }
        service_count = service_ids.length;
        return service_count;
    },
    removeOrphanCalendar:function(calendar, trips){
        var i, j;
        var service_count = this.countServiceIds(trips);
        for (j = 0; j < calendar.length;){
            if (calendar.length == service_count){
                break;
            }
            for (i = 0; i < trips.length; i++){
                var found = 0;
                if (trips[i].service_id == calendar[j].service_id){
                    found = 1;
                    break;                      
                }
            }
            if (found == 0){
                orphanCalServiceIds.push(calendar[j])
                calendar.splice(j, 1);
            }
            else if (found == 1){
                j = j + 1;
            }
        }
    },
    removeOrphanCalendarDate:function(calendar_dates, trips){
        var i, j;
        var service_count = this.countServiceIds(trips);
        for (j = 0; j < calendar_dates.length;){
            if (calendar_dates.length == service_count){
                break;
            }
            for (i = 0; i < trips.length; i++){
                var found = 0;
                if (trips[i].service_id == calendar_dates[j].service_id){
                    found = 1;
                    break;                      
                }
            }
            if (found == 0){
                orphanCDServiceIds.push(calendar_dates[j].service_id)
                calendar_dates.splice(j, 1);
            }
            else if (found == 1){
                j = j + 1;
            }
        }
    },
    Clean: function(
        agencies, routes, trips, stops, stop_times, calendar, calendar_dates, stop_times,
        dir_name
    ){
        orphanStops = [];
        orphanRoutes = [];
        orphanAgencies = [];
        orphanCalServiceIds = [];
        orphanCDServiceIds = [];        
        //Removes orphan stops (stops that are never visited on a trip)
        this.removeOrphanStops(stops, stop_times);
        console.log(stops);
        //Remove routes with no trip
        this.removeOrphanRoutes(routes, trips);
        console.log(routes);
        //Removes agencies with no routes
        this.removeOrphanAgencies(agencies, routes);
        console.log(agencies);
        if (calendar != null)
            this.removeOrphanCalendar(calendar, trips);
        if (calendar_dates != null)
            this.removeOrphanCalendarDate(calendar_dates, trips);
        //CREATE UPDATED STOPS FILE
        var stopsCSV = csvStringifySync(stops, {header: true, columns: ["stop_id", "stop_code", "stop_name", "stop_desc", "stop_lat", "stop_lon", "zone_id", "stop_url", "location_type", "parent_station", "stop_timezone", "wheelchair_boarding", "level_id", "platform_code"]})
        var routesCSV = csvStringifySync(routes, {header: true, columns: ["agency_id","route_id","route_short_name","route_long_name","route_desc","route_type","route_url","route_color","route_text_color","route_sort_order","min_headway_minutes","eligibility_restricted"]})
        var agencyCSV = csvStringifySync(agencies, {header: true, columns: ["agency_id", "agency_name", "agency_url", "agency_timezone", "agency_lang", "agency_phone", "agency_fare_url", "agency_email"]})
        var calendarCSV = csvStringifySync(calendar, {header: true, columns: ["service_id","monday","tuesday","wednesday","thursday","friday","saturday","sunday","start_date","end_date"]})
        var calendarDatesCSV = csvStringifySync(calendar_dates, {header: true, columns: ["service_id","date","exception_type"]})

        // DELETE PREVIOUS FILES
        try {
            var out = execSync('rm ./clean/*') // delete all files in clean dir
            console.log("File deletion output:")
            console.log(out.toString())
        } catch (e){ // rm will throw an error if the dir is empty, this statement will catch the error (preventing the server from breaking)
            console.log("RM")
            console.log(e)
        }

        // copy everything from the original feed (some files will be overwritten with the cleaned version)
        try {
            var out = execSync('cp ./uploads/\"' + dir_name + '\"/* ./clean/')
            console.log("File copy output:")
            console.log(out.toString())
        } catch (e){
            console.log("COPY")
            console.log(e)
        }

        // overwrite some of the old files with the cleaned version
        fs.writeFileSync(FILEPATH + "stops.txt", stopsCSV);
        fs.writeFileSync(FILEPATH + "routes.txt", routesCSV);
        fs.writeFileSync(FILEPATH + "agency.txt", agencyCSV);
        fs.writeFileSync(FILEPATH + "calendar.txt", calendarCSV);
        fs.writeFileSync(FILEPATH + "calendar_dates.txt", calendarDatesCSV);

        //ZIP FILES
        var current_dir = process.cwd(); // save current working dir
        process.chdir(FILEPATH) // change dir
        console.log("current dir: " + process.cwd())
        try {
            //zip.zipSync("*.txt", FILENAME); // zip the files
            var out = execSync('zip -r -y clean_feed.zip *.txt')
            console.log("File compression (zipping) output:")
            console.log(out.toString())
        } catch (e){
            console.log("ZIP")
            console.log(e)
        }
        
        process.chdir(current_dir); // undo change dir

        // RETURN THE ZIP FILENAME AND THE LIST OF REMOVED ITEMS
        return {
            zip_filename:(FILEPATH + FILENAME),
            orphan_stops: orphanStops,
            orphan_routes: orphanRoutes,
            orphan_agencies: orphanAgencies,
            orphan_cal_service: orphanCalServiceIds,
            orphan_cdates_service: orphanCDServiceIds
        }; 
    }
}

//module.exports.Clean();
