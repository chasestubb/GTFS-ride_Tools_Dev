// built-in modules
var http = require('http');
var Url = require('url');
var bodyParser = require('body-parser')
var fs = require('fs');

// third-party modules
var express = require('express')
var formidable = require('formidable'); // A Node.js module for parsing form data, especially file uploads.
var extract = require('extract-zip');
//var csv = require('csv-parse/lib/sync'); // converting CSV text input into arrays or objects
var csv_parse = require('csv-parse/lib/sync') // generalized now that we are both using csv-parse + csv-generate
var csv_generate = require('csv-generate')

var Info = require("./js/info");
var Feed_Creation = require("./js/feed_creation");

// express stuff
var app = express()
app.use(express.urlencoded())
app.use(express.json())

// feel free to change the things below, but the values must be consistent with the front-end

// the port for the server to listen to
const PORT = 8080;
const CORS = "http://localhost:3000"

// the URL paths, make them consistent with the front-end
const SERVER_CHECK_URL = "/server_check"
const UPLOAD_URL = '/fileupload';
const INFO_URL = '/info';
const INFO_AGENCY_URL = '/info/agency/';
const FC_POST_URL = '/fc/params'
const FC_GET_URL = 'fc/getfile'



// parsed files go here
// GTFS required
var agencies = null, routes = null, trips = null, stops = null, stop_times = null, calendar = null, calendar_dates = null

// GTFS :: OPTIONAL
var frequencies = null, stop_times = null
var feed_info = null

// GTFS-ride bool
var gtfs_ride_feed = false; // true = GTFS-ride, false = GTFS (condition for true: ride_feed_info.txt exists)

// GTFS-ride :: THE FIVE FILES
var board_alight = null
var trip_capacity = null
var rider_trip = null
var ridership = null
var ride_feed_info = null

var filename = ""

http.createServer(function (req, res) {
    console.log(req.url)
    
    // FILE UPLOAD (Receive all files from the frontend) ====================
    //
    if (req.url == UPLOAD_URL) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.file.path;
            var newpath = './uploads/' + files.file.name;
            var noext = (files.file.name).slice(0, -4); // removes the last 4 chars (".zip")
            filename = noext;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;

                // extract the files
                extract(newpath, {dir: (process.cwd() + "/uploads/" + noext)}, function (err) {
                    if (err){
                        console.log("Error in extraction: " + err);
                        res.writeHead(415, {"Access-Control-Allow-Origin": CORS});
                        res.write("The server could not extract " + noext + ".zip. Check if the file is corrupted or in the wrong format.\n\nDetails:\n" + err);
                        res.end();
                    } else {
                        console.log("\nFiles extracted to " + noext + "/");

                        // check for required files
                        if (fs.existsSync("uploads/" + noext + "/routes.txt") &&
                        fs.existsSync("uploads/" + noext + "/agency.txt") && 
                        fs.existsSync("uploads/" + noext + "/trips.txt") &&
                        fs.existsSync("uploads/" + noext + "/stops.txt") && 
                        fs.existsSync("uploads/" + noext + "/stop_times.txt") && 
                        (fs.existsSync("uploads/" + noext + "/calendar.txt") || fs.existsSync("uploads/" + noext + "/calendar_dates.txt"))){
                            
                            // send response to client
                            res.writeHead(200, {'Content-Type': 'text/html', "Access-Control-Allow-Origin": CORS});
                            res.write(noext);
                            res.end();

                            // read files and parse them

                            // GTFS required files ====================

                            // ROUTES // AGENCY // TRIPS // STOPS // STOP TIMES // 
                            routes = csv_parse(fs.readFileSync("uploads/" + noext + "/routes.txt"), {columns: true}) 
                            agencies = csv_parse(fs.readFileSync("uploads/" + noext + "/agency.txt"), {columns: true})
                            trips = csv_parse(fs.readFileSync("uploads/" + noext + "/trips.txt"), {columns: true})
                            stops = csv_parse(fs.readFileSync("uploads/" + noext + "/stops.txt"), {columns: true})
                            stop_times = csv_parse(fs.readFileSync("uploads/" + noext + "/stop_times.txt"), {columns: true})

                            // GTFS conditionally required files ====================

                            // CALENDAR //
                            if (fs.existsSync("uploads/" + noext + "/calendar.txt")){
                                calendar = csv_parse(fs.readFileSync("uploads/" + noext + "/calendar.txt"), {columns: true})
                            } else {
                                calendar = null
                            }

                            // CALENDAR DATES //
                            if (fs.existsSync("uploads/" + noext + "/calendar_dates.txt")){
                                calendar_dates = csv_parse(fs.readFileSync("uploads/" + noext + "/calendar_dates.txt"), {columns: true})
                            } else {
                                calendar_dates = null
                            }

                            // GTFS optional files ====================

                            // FREQUENCIES //
                            if (fs.existsSync("uploads/" + noext + "/frequencies.txt")){
                                frequencies = csv_parse(fs.readFileSync("uploads/" + noext + "/frequencies.txt"), {columns: true})
                            } else {
                                frequencies = null
                            }

                            // FEED INFO //
                            if (fs.existsSync("uploads/" + noext + "/feed_info.txt")){
                                feed_info = csv_parse(fs.readFileSync("uploads/" + noext + "/feed_info.txt"), {columns: true})
                            } else {
                                feed_info = null
                            }

                            // STOP TIMES //
                            if (fs.existsSync("uploads/" + noext + "/stop_times.txt")){
                                stop_times = csv_parse(fs.readFileSync("uploads/" + noext + "/stop_times.txt"), {columns: true})
                            } else {
                                stop_times = null
                            }

                            // GTFS-ride files =================

                            // RIDE FEED INFO //
                            if (fs.existsSync("uploads/" + noext + "/ride_feed_info.txt")){
                                gtfs_ride_feed = true;

                                // GTFS-ride optional files ==============

                                // BOARD ALIGHT //
                                if (fs.existsSync("uploads/" + noext + "/board_alight.txt")){
                                    board_alight = csv_parse(fs.readFileSync("uploads/" + noext + "/board_alight.txt"), {columns: true})
                                } else {
                                    board_alight = null
                                }

                                // TRIP CAPACITY //
                                if (fs.existsSync("uploads/" + noext + "/trip_capacity.txt")){
                                    trip_capacity = csv_parse(fs.readFileSync("uploads/" + noext + "/trip_capacity.txt"), {columns: true})
                                } else {
                                    trip_capacity = null
                                }

                                // RIDER TRIP //
                                if (fs.existsSync("uploads/" + noext + "/rider_trip.txt")){
                                    rider_trip = csv_parse(fs.readFileSync("uploads/" + noext + "/rider_trip.txt"), {columns: true})
                                } else {
                                    rider_trip = null
                                }

                                // RIDERSHIP //
                                if (fs.existsSync("uploads/" + noext + "/ridership.txt")){
                                    ridership = csv_parse(fs.readFileSync("uploads/" + noext + "/ridership.txt"), {columns: true})
                                } else {
                                    ridership = null
                                }

                                // RIDE FEED INFO //
                                if (fs.existsSync("uploads/" + noext + "/ride_feed_info.txt")){
                                    ride_feed_info = csv_parse(fs.readFileSync("uploads/" + noext + "/ride_feed_info.txt"), {columns: true})
                                } else {
                                    ride_feed_info = null
                                }
                            } else {
                                gtfs_ride_feed = false
                            }

                            // console log feed type
                            if (gtfs_ride_feed){
                                console.log("GTFS-ride feed parsed: " + noext + ".zip")
                            } else {
                                console.log("GTFS feed parsed: " + noext + ".zip")
                            }
                         

                        // TEST JS OBJECT CREATION //////////////////////////////////////////////
                        /*
                        var num_agency = agencies.length;
                        var num_routes = routes.length;
                        console.log("This feed started on " + feed_info[0].feed_start_date + " and ended on " + feed_info[0].feed_end_date);
                        console.log("Ridership feed began on " + ride_feed_info[0].ride_start_date + " and ended on " + ride_feed_info[0].ride_end_date);
                        console.log("This feed has " + num_agency + " agencies");
                        console.log("Included agencies are:");
                    
                        for (var i = 0; i < num_agency; i++){
                            console.log(agencies[i].agency_name + "\n");
                        }
                    
                        for (var j = 0; j < num_agency; j++){
                            num_routes = Info.routesPerAgency(agencies[j], routes);
                            num_stops = Info.stopsPerAgency(agencies[j], routes, trips, stop_times)
                            var num_ag_riders = Info.countAgencyRiders(agencies[j], board_alight, trips, routes);
                            var avg_ag_rider = num_ag_riders / 7;
                            console.log("Agency " + agencies[j].agency_name + " has "+ num_routes + " routes" + " and " + num_stops + " stops\n" + "and " + num_ag_riders + " boardings and " + avg_ag_rider + " daily riders");
                            for ( var i = 0; i < num_routes; i++){
                                if (((agencies[j].agency_id).localeCompare(routes[i].agency_id)) == 0){
                                    console.log("Route " + routes[i].route_long_name + " within agency");
                                    var routeRiders = Info.countRouteRiders(routes[j], board_alight, trips);
                                    console.log("Rider count for this route is " + routeRiders);
                                    for ( var k = 0; k < trips.length; k++){
                                        if (((trips[k].route_id).localeCompare(routes[i]).route_id) == 0){
                                            console.log("Trip within agency " + trips[i].trip_id);
                                            var tripRiders = Info.countTripRiders(board_alight, trips[k]);
                                            console.log("Rider count for this trip is " + tripRiders);
                                            for (var j = 0; j < stop_times.length; j++){
                                                if (((stop_times[j].trip_id).localeCompare(trips[k].trip_id)) == 0){
                                                    console.log("Stop within agency " + stop_times[j].stop_id);
                                                    var stopRiders = Info.countStopRiders(board_alight, stops[j]);
                                                    console.log("Rider count for this stop: " + stopRiders);
                                                }
                                            }
                                        }
                                    }
                                }
                    
                            }
                        }
                        for (var k = 0; k < num_routes; k++){
                            var days = Info.serviceDays(routes[k], trips, calendar);
                            var route_riders = Info.countRouteRiders(routes[k], board_alight, trips);
                            console.log("Route " + routes[k].route_long_name + "has active trip service on " + days);
                            var starts = Info.serviceStart(routes[k], trips, frequencies);
                            var end = Info.serviceEnd(routes[k], trips, frequencies);
                            console.log("Route " + routes[k].route_long_name + "has service hours starting at" + starts + "and ending at " + end);
                            console.log("Route" + routes[k].route_long_name + "has " + route_riders + "riders");
                    
                        }
                        for (var x = 0; x < trips.length; x++){
                            var num_boardings = Info.countTripRiders(board_alight, trips[x]);
                            var has_ridership = Info.findTripRecordUse(board_alight, trips[x]);
                            //var exceptions = Info.serviceException(trips[x], calendar_dates);
                            var orphan = Info.orphanTrip(trips[x], routes);
                            var capacities = Info.vehicleCapacity(trips[x], trip_capacity);
                            if ( orphan == -1){
                                console.log("Trip " + trips[x].trip_id + "has no routes!");
                            }
                            if (has_ridership == 0)
                                console.log("Trip " + trips[x].trip_id + " has ridership data\n");
                            else if (has_ridership == 1)
                                console.log("Trip " + trips[x].trip_id + " does not have ridership data\n");
                    
                            console.log("Trip " + trips[x].trip_id + "has " + num_boardings + " boardings");
                            //DEBUG console.log("Trip " + trips[x] + "has execeptions: " + exceptions);
                            console.log("The vehicles on this trip have the following capacities: " + capacities);
                            avg_rider = num_boardings / 7;
                            console.log("The average number of riders per day is " + avg_rider);
                    
                            
                        }
                    
                        var avg_trip = trips.length / 7;
                    
                        console.log("The average amount of trips per day is " + avg_trip);
                    
                        for (var y = 0; y < stops.length; y++){
                            var has_ridership = Info.findStopRecordUse(board_alight, stops[y]);
                            var orphan = Info.orphanStop(stops[y], trips);
                            if (orphan == 1){
                                console.log("Stop " + stops[y].stop_id + "is not within a trip!");
                            }
                            if (has_ridership == 0)
                                console.log("Stop " + stops[y].stop_id + " has ridership data\n");
                            else if (has_ridership == 1)
                                console.log("Trip " + stops[y].stop_id + " does not have ridership data\n");
                    
                            var num_boardings = Info.countStopRiders(board_alight, stops[y]);
                            console.log("Stop " + stops[y].stop_id + "has " + num_boardings + "boardings");
                            var avg_stop_rider = num_boardings / 7;
                            console.log("Average number of riders on this stop per day" + avg_stop_rider);
                        }
                        */
                        // END TEST //////////////////////////////////////////////

                        } else { // if the required files do not exist
                            res.writeHead(415, {"Access-Control-Allow-Origin": CORS});
                            res.write(noext + ".zip is NOT a valid GTFS feed");
                            res.end();
                            console.log(noext + ".zip is NOT a valid GTFS feed");
                        }

                
                        
                    }
                    //console.log(agency.length)
                    //console.log(agency[0].agency_name);
                    //console.log("Agency: " + agency[0].agency_name)
                    
                });
            });
        });

    // --------------------------------------------------------------------------------
    // FEED INFO
    } else if (req.url.startsWith(INFO_URL)){
        if (agencies && routes && trips && stops && stop_times){
            // PER AGENCY
            if (req.url.includes("agency")){
                console.log("FEED INFO -> AGENCY INFO")
                var q = req.url.split("=");
                var index = q[1]
                console.log(index)
                //var index = req.headers.index;
                //console.log(req);
                var agency = agencies[index]
                var agency_info = {
                    id: agency.agency_id,
                    name: agency.agency_name,
                    url: agency.agency_url,
                    fare_url: agency.agency_fare_url,
                    phone: agency.agency_phone,
                    email: agency.agency_email,
                    hours: {
                        m: "",
                        t: "",
                        w: "",
                        r: "",
                        f: "",
                        s: "",
                        u: ""
                    },
                    routes: [],
                    //stops: [],
                    is_gtfs_ride: gtfs_ride_feed,
                    ridership: 0,
                    trips: Info.countTripsPerAgency(agency, routes, trips),
                }

                // get the agency's routes
                for (var x = 0; x < routes.length; x++){
                    var route = routes[x];
                    if (route.agency_id === agency.agency_id){
                        var route_info = {
                            short_name: route.route_short_name,
                            long_name: route.route_long_name,
                            desc: route.route_desc,
                            type: route.route_type,
                            ridership: 0,
                            trips: (Info.tripsPerRoute(route, trips)).length,
                        }
                        if (gtfs_ride_feed){
                            route_info.ridership = Info.countRouteRiders(route, board_alight, trips)
                        }
                        agency_info.routes.push(route_info);
                    }
                }

                // get the agency's stops
                /*
                Info.findStopByAgency(agency_info.id, routes, trips, stop_times, stops).map(stop => {
                    var stop_info = {
                        id: stop.stop_id,
                        name: stop.stop_name,
                        code: stop.stop_code,
                        pos: [stop.stop_lat, stop.stop_lon],
                        zone: stop.zone_id,
                        ridership: 0,
                    }
                    if (gtfs_ride_feed){
                        stop_info.ridership = Info.countStopRiders(board_alight, stop)
                    }
                    agency_info.stops.push(stop_info)
                })
                */

                //console.log(agency_info.stops)

                // send feed type
                agency_info.is_gtfs_ride = gtfs_ride_feed

                // GTFS-ride specific fields
                if (gtfs_ride_feed){
                    agency_info.ridership = Info.countAgencyRiders(agency, board_alight, trips, routes);
                }

                //console.log("Index: " + index);
                //console.log(agency_info);

                res.writeHead(200, {"Access-Control-Allow-Origin": CORS, 'Access-Control-Allow-Credentials': true, "content-type": "application/json"});
                res.write(JSON.stringify(agency_info));
                res.end();
            } else {
                // general feed info
                console.log("FEED INFO")
                // initialize object
                var feed_info_ = {
                    filename: filename,
                    is_gtfs_ride: gtfs_ride_feed,
                    agencies: [],
                    stops: [],
                    num_trips: trips.length,
                    date: [feed_info[0].feed_start_date, feed_info[0].feed_end_date],
                }

                // parse agencies' info
                for (x = 0; x < agencies.length; x++){
                    var agency = {
                        index: x,
                        id: agencies[x].agency_id,
                        name: agencies[x].agency_name,
                        routes: Info.routesPerAgency(agencies[x], routes),
                        //stops: Info.stopsPerAgency(agencies[x], routes, trips, stop_times),
                        ridership: 0,
                    };
                    if (gtfs_ride_feed){
                        agency.ridership = Info.countAgencyRiders(agencies[x], board_alight, trips, routes)
                    }
                    feed_info_.agencies.push(agency);
                }

                for (x = 0; x < stops.length; x++){
                    var stop = {
                        index: x,
                        id: stops[x].stop_id,
                        name: stops[x].stop_name,
                        code: stops[x].stop_code,
                        desc: stops[x].stop_desc,
                        pos: [stops[x].stop_lat, stops[x].stop_lon],
                        zone: (stops[x].zone_id),
                        ridership: 0,
                    }
                    if (gtfs_ride_feed){
                        stop.ridership = Info.countStopRiders(board_alight, stops[x]);
                    }
                    feed_info_.stops.push(stop)
                }
                

                // send object to front-end
                res.writeHead(200, {"Access-Control-Allow-Origin": "http://localhost:3000"});
                res.write(JSON.stringify(feed_info_));
                res.end();
                console.log("Feed info sent to the client")
            }
        } else {
            res.writeHead(400, {"Access-Control-Allow-Origin": "http://localhost:3000"});
            res.write("No file uploaded. Please upload one from the home page.");
            res.end();
            console.log("Client tried to access Feed Info without providing a valid feed.")
        }
        
        
    // FEED INFO -> AGENCY INFO
    /*} else if (req.url == INFO_AGENCY_URL){
        console.log("FEED INFO -> AGENCY INFO")
        //var q = req.url.split("/");
        //var index = q[q.length - 1]
        var index = req.headers.index;
        console.log(req);
        var agency = agencies[index]
        var agency_info = {
            name: agency.agency_name,
            url: agency.agency_url,
            fare_url: agency.agency_fare_url,
            phone: agency.agency_phone,
            email: agency.agency_email,
            hours: {
				m: "",
				t: "",
				w: "",
				r: "",
				f: "",
				s: "",
				u: ""
			},
            routes: []
        }

        // get the agency's routes
        //var agency_routes = []
        routes.foreach(route => { // JS equivalent of Python's "for route in routes"
            if (route.agency_id === agency.agency_id){
                route_info = {
                    short_name: route.route_short_name,
                    long_name: route.route_long_name,
                    desc: route.route_desc,
                    type: route.route_type
                }
                agency_info.routes.push(route_info);
            }
        })

        for (var x = 0; x < routes.length; x++){
            var route = routes[x];
            if (route.agency_id === agency.agency_id){
                route_info = {
                    short_name: route.route_short_name,
                    long_name: route.route_long_name,
                    desc: route.route_desc,
                    type: route.route_type
                }
                agency_info.routes.push(route_info);
            }
        }

        //console.log("Index: " + index);
        //console.log(agency_info);

        res.writeHead(200, {"Access-Control-Allow-Origin": CORS, 'Access-Control-Allow-Credentials': true, "content-type": "application/json"});
        res.write(JSON.stringify(agency_info));
        res.end();*/
    
    // --------------------------------------------------------------------------------
    // FEED CREATION - PARAMETERS
    } else if (req.url.startsWith(FC_POST_URL)){
        console.log("FC PARAMS")
        console.log(req.url)
        //console.log(req)
        var parsedURL = Url.parse(req.url)
        console.log(parsedURL)
        res.writeHead(200, {"Access-Control-Allow-Origin": CORS, 'Content-Type': 'text/plain'});
        res.end()
    } else if (req.url == SERVER_CHECK_URL){
        console.log("Server is alive.")
        res.writeHead(200, {"Access-Control-Allow-Origin": CORS, 'Content-Type': 'text/plain'});
        res.write("TRUE")
        res.end()
    } else {
        console.log("ELSE")
        res.writeHead(200, {"Access-Control-Allow-Origin": CORS, 'Content-Type': 'text/html'});
        /*res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');*/
        return res.end();
    }
}).listen(PORT);
console.log("Listening on port " + PORT);
console.log("Files will be extracted to:")
console.log(process.cwd() + "/uploads/")

// adapted from https://www.w3schools.com/nodejs/nodejs_uploadfiles.asp
