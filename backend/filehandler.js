// built-in modules
var http = require('http');
var Url = require('url');
//var bodyParser = require('body-parser')
var fs = require('fs');

// third-party modules
var express = require('express')
var formidable = require('formidable'); // A Node.js module for parsing form data, especially file uploads.
var extract = require('extract-zip');
var csv_parse = require('csv-parse/lib/sync') // converting CSV text input into arrays or objects

var Info = require("./js/info");
var Feed_Creation = require("./js/feed_creation");
var Split = require("./js.split");
var Clean = require("./js/clean");

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
const INFO_AGENCY_URL = '/info/agency/:index';
const INFO_ROUTE_URL = '/info/route/:index';
const FC_POST_URL = '/fc/params'
const FC_GET_URL = '/fc/getfile'
const SPLIT_URL = '/split'
const CLEAN_URL = '/clean'



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


var fc_promise
var split_promise

// asynchronously call Feed_Creation.Feed_Creation()
// Feed_Creation.Feed_Creation() is completely synchronous so we only need to wait for one thing
async function feed_creation(params){
    console.log("Generating feed with params:")
    console.log(params)
    var fc_filename = Feed_Creation.Feed_Creation(
        params.agencies, params.routes, params.stops, params.trips, params.trips_per_route,
        params.start_date, params.end_date, params.feed_date, params.operation_days,
        params.user_source, params.min_riders, params.max_riders, params.aggr_level,
        params.calendar_type, params.files)
    console.log("Feed successfully created")
    return fc_filename
}


// --------------------------------------------------------------------------------
// FILE UPLOAD (Receive all files from the frontend)
// adapted from https://www.w3schools.com/nodejs/nodejs_uploadfiles.asp
app.post(UPLOAD_URL, (req, res) => {
    console.log(req.method + " to " + req.url)
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
                        

                    } else { // if the required files do not exist
                        res.writeHead(415, {"Access-Control-Allow-Origin": CORS});
                        res.write(noext + ".zip is NOT a valid GTFS feed");
                        res.end();
                        console.log(noext + ".zip is NOT a valid GTFS feed");
                    }

            
                    
                }
                
            });
        });
    });
})

// --------------------------------------------------------------------------------
// FEED INFO
app.get(INFO_URL, (req, res) => {
    // general feed info
    console.log("FEED INFO")
    if (agencies && routes && trips && stops && stop_times){
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
        res.writeHead(200, {"Access-Control-Allow-Origin": CORS});
        res.write(JSON.stringify(feed_info_));
        res.end();
        console.log("Feed info sent to the client")
    } else { // if the user has not uploaded any valid feed
        res.writeHead(400, {"Access-Control-Allow-Origin": CORS});
        res.write("No file uploaded. Please upload one from the home page.");
        res.end();
        console.log("Client tried to access Feed Info without providing a valid feed.")
    }
})

// AGENCY INFO
app.get(INFO_AGENCY_URL, (req, res) => {
    console.log("FEED INFO -> AGENCY INFO")
    if (agencies && routes && trips && stops && stop_times){
        var index = req.params.index
        console.log(index)
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
                    index: x,
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
        /* we have decided to not list the stops by agency because it is slow
           (when testing, TriMet's feed took more than 3 minutes to list when filtered by agency but it took about 20 seconds to list all stops in the feed)
           this is because getting stops by agency requires joining 4 different tables (agency, routes, trips, stops)				
        */
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

        // send feed type
        agency_info.is_gtfs_ride = gtfs_ride_feed

        // GTFS-ride specific fields
        if (gtfs_ride_feed){
            agency_info.ridership = Info.countAgencyRiders(agency, board_alight, trips, routes);
        }

        res.writeHead(200, {"Access-Control-Allow-Origin": CORS, 'Access-Control-Allow-Credentials': true, "content-type": "application/json"});
        res.write(JSON.stringify(agency_info));
        res.end();
    } else {
        res.writeHead(400, {"Access-Control-Allow-Origin": "http://localhost:3000"});
        res.write("No file uploaded. Please upload one from the home page.");
        res.end();
        console.log("Client tried to access Feed Info without providing a valid feed.")
    }
})
    
// ROUTE INFO
app.get(INFO_ROUTE_URL, (req, res) => {
    console.log("FEED INFO -> ROUTE INFO")
    if (agencies && routes && trips && stops && stop_times){
        var index = req.params.index
        console.log(index)
        var route = routes[index]
        var route_info = {
            id: route.route_id,
            short_name: route.route_short_name,
            long_name: route.route_long_name,
            desc: route.route_desc,
			type: route.route_type,
			url: route.route_url,
			bgcolor: route.route_color,
			fgcolor: route.route_text_color,
			min_headway: 0,
			variations: 1,
            span: {
                m: "",
                t: "",
                w: "",
                r: "",
                f: "",
                s: "",
                u: ""
            },
            trips: [],
            is_gtfs_ride: gtfs_ride_feed,
            ridership: 0,
        }

        // get the route's trips
        for (var x = 0; x < trips.length; x++){
            var trip = trips[x];
            if (trip.route_id == route.route_id){
                var trip_info = {
                    index: x,
                    id: trip.trip_id,
                    days: "",
                    start_time: "",
                    end_time: "",
                    headsign: trip.headsign,
                    name: trip.short_name,
                    direction: trip.direction_id,
                    block: trip.block_id,
                    ridership: 0,
                }
                if (gtfs_ride_feed){
                    trip_info.ridership = Info.countTripRiders(board_alight, trip)
                }
                route_info.trips.push(trip_info)
            }
        }


        // send feed type
        route_info.is_gtfs_ride = gtfs_ride_feed

        // GTFS-ride specific fields
        if (gtfs_ride_feed){
            route_info.ridership = Info.countRouteRiders(route, board_alight, trips)
        }

        res.writeHead(200, {"Access-Control-Allow-Origin": CORS, 'Access-Control-Allow-Credentials': true, "content-type": "application/json"});
        res.write(JSON.stringify(route_info));
        res.end();
    } else {
        res.writeHead(400, {"Access-Control-Allow-Origin": "http://localhost:3000"});
        res.write("No file uploaded. Please upload one from the home page.");
        res.end();
        console.log("Client tried to access Feed Info without providing a valid feed.")
    }
})
    

/* HOW FEED CREATION WORKS --------------------------------------------------------
1.  User fills out web form
2.  User clicks the "Generate Feed" button
3.  Client sends a POST request that sends the parameters
4.  Server handles POST request and stores the params
5.  Server calls the Feed Creation function
6.  Server sends response that says the feed is being generated
7.  Client receives the response
8.  Client sends GET response to request the feed
9.  Client waits for the feed to be generated
-- OPTION 1 (preferred): -- DIDN'T WORK
10. Server sends file to the client
11. Client downloads the file
-- OPTION 2 (if potion 1 does not work):
10. Server sends file link to the client
11. Client shows the link on the UI
12. User clicks on the link
13. Server sends file to the client
14. Client downloads the file
-------------------------------------------------------------------------------- */

// --------------------------------------------------------------------------------
// FEED CREATION - PARAMETERS
app.post(FC_POST_URL, async (req, res) => {
    console.log("FC PARAMS")
    console.log(req.url)
    res.setHeader("Access-Control-Allow-Origin", CORS);
    
    // make promise for generating feed file (async)
    // we need to call feed creation before sending the response so that the client will wait instead of receiving nothing
    fc_promise = new Promise((resolve, reject) => {
        console.log("Params received")
        resolve (feed_creation(req.body)) // generate the feed file and resolve the promise when done
    })
    res.writeHead(200)
    res.write("Params received")
    res.end()
})

// --------------------------------------------------------------------------------
// FEED CREATION - OUTPUT
app.get(FC_GET_URL, async (req, res) => {
    console.log("FC GET")
    //res.writeHead(200, {"Access-Control-Allow-Origin": CORS, /*'Content-Type': 'text/plain'*/});
    
    res.setHeader("Access-Control-Allow-Origin", CORS);
    res.setHeader("Content-Disposition", "attachment; filename=feed_creation.zip")
    res.setHeader("Content-Type", "application/zip")

    // wait for feed creation to finish
    // promise will be filename when resolved
    // feed creation needs to be called before response is sent to the client because fc_promise will be empty (i.e. not a promise) otherwise
    var fc_filename = await fc_promise
    var fc_filepath = process.cwd() + "/" + fc_filename
    res.download(fc_filepath, function(err){
        if (err){
            console.log("Error sending file: " + err)
        } else {
            console.log("File sent to client")
        }
        res.end() // res.end() is here to prevent the connection from being closed while the download is incomplete
    })
    
})
//---------------------------------------------------------------------------
// SPLIT - PARAMETERS
app.post(FC_POST_URL, async (req, res) => {
    console.log("SPLIT PARAMS")
    console.log(req.url)
    res.setHeader("Access-Control-Allow-Origin", CORS);
    
    // make promise for generating feed file (async)
    // we need to call feed creation before sending the response so that the client will wait instead of receiving nothing
    split_promise = new Promise((resolve, reject) => {
        console.log("Params received")
        resolve (split(req.body)) // generate the feed file and resolve the promise when done
    })
    res.writeHead(200)
    res.write("Params received")
    res.end()
})
//--------------------------------------------------------------------------------------------
// SPLIT - OUTPUT
app.get(SPLIT_URL, async(req, res) => {
    console.log("SPLIT")
    res.setHeader("Access-Control-Allow-Origin", CORS);
    res.setHeader("Content-Disposition", "attachment; filename=feed_creation.zip")
    res.setHeader("Content-Type", "application/zip")

    // wait for split to finish
    // promise will be filename when resolved
    var split_filename = await split_promise
    var split_filepath = process.cwd() + "/" + split_filename
    res.download(split_filepath, function(err){
        if (err){
            console.log("Error sending file: " + err)
        } else {
            console.log("File sent to client")
        }
        res.end() // res.end() is here to prevent the connection from being closed while the download is incomplete
    })
    
})


// --------------------------------------------------------------------------------
// CLIENT CHECKS IF SERVER IS ALIVE
app.get(SERVER_CHECK_URL, (req, res) => {
    console.log("Server is alive.")
    res.writeHead(200, {"Access-Control-Allow-Origin": CORS, 'Content-Type': 'text/plain'});
    res.write("TRUE")
    res.end()
})

// --------------------------------------------------------------------------------
// HANDLE CORS REQUESTS
app.options("*", (req, res) => {
    console.log("OPTIONS: CORS Request")
    res.writeHead(200, {
        "Access-Control-Allow-Origin": CORS,
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Content-Disposition",
    });
    //res.write("TRUE")
    res.end()
})

// --------------------------------------------------------------------------------
// EVERYTHING ELSE
app.all("*", (req, res) => {
    console.log("Client requested something else")
    console.log(req.method + " to " + req.url)
    res.writeHead(404, {"Access-Control-Allow-Origin": CORS, 'Content-Type': 'text/plain'});
    return res.end();
})
        

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
console.log("Files will be extracted to:")
console.log(process.cwd() + "/uploads/")
