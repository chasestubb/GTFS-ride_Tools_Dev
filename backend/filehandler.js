var http = require('http');
var Url = require('url');
var formidable = require('formidable');
var fs = require('fs');
var extract = require('extract-zip');
var csv = require('csv-parse/lib/sync');

var Info = require("./js/info");

// feel free to change the things below, but the values must be consistent with the front-end

// the port for the server to listen to
const PORT = 8080;
const CORS = "http://localhost:3000"

// the URL paths, make them consistent with the front-end
const UPLOAD_URL = '/fileupload';
const INFO_URL = '/info';
const INFO_AGENCY_URL = '/info/agency/';



// parsed files go here
// GTFS required
var agencies = null, routes = null, trips = null, stops = null, stop_times = null, calendar = null, calendar_dates = null
// GTFS optional
var frequencies = null
// GTFS-ride
var gtfs_ride_feed = false; // true = GTFS-ride, false = GTFS (condition for true: ride_feed_info.txt exists)
var board_alight = null

var filename = ""

http.createServer(function (req, res) {
    console.log(req.url)
    
    // FILE UPLOAD
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
                            // GTFS required files
                            routes = csv(fs.readFileSync("uploads/" + noext + "/routes.txt"), {columns: true})
                            agencies = csv(fs.readFileSync("uploads/" + noext + "/agency.txt"), {columns: true})
                            trips = csv(fs.readFileSync("uploads/" + noext + "/trips.txt"), {columns: true})
                            stops = csv(fs.readFileSync("uploads/" + noext + "/stops.txt"), {columns: true})
                            stop_times = csv(fs.readFileSync("uploads/" + noext + "/stop_times.txt"), {columns: true})

                            // GTFS conditionally required files
                            if (fs.existsSync("uploads/" + noext + "/calendar.txt")){
                                calendar = csv(fs.readFileSync("uploads/" + noext + "/calendar.txt"), {columns: true})
                            } else {
                                calendar = null
                            }
                            if (fs.existsSync("uploads/" + noext + "/calendar_dates.txt")){
                                calendar_dates = csv(fs.readFileSync("uploads/" + noext + "/calendar_dates.txt"), {columns: true})
                            } else {
                                calendar_dates = null
                            }

                            // GTFS optional files
                            if (fs.existsSync("uploads/" + noext + "/frequencies.txt")){
                                frequencies = csv(fs.readFileSync("uploads/" + noext + "/frequencies.txt"), {columns: true})
                            } else {
                                frequencies = null
                            }

                            // GTFS-ride files
                            if (fs.existsSync("uploads/" + noext + "/ride_feed_info.txt")){
                                gtfs_ride_feed = true;
                                // GTFS-ride optional files
                                if (fs.existsSync("uploads/" + noext + "/board_alight.txt")){
                                    board_alight = csv(fs.readFileSync("uploads/" + noext + "/board_alight.txt"), {columns: true})
                                } else {
                                    board_alight = null
                                }
                            } else {
                                gtfs_ride_feed = false
                            }

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
                    //console.log(agency.length)
                    //console.log(agency[0].agency_name);
                    //console.log("Agency: " + agency[0].agency_name)
                    
                })
            });
        });

    // FEED INFO
    } else if (req.url.startsWith(INFO_URL)){
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
            /*routes.foreach(route => { // JS equivalent of Python's "for route in routes"
                if (route.agency_id === agency.agency_id){
                    route_info = {
                        short_name: route.route_short_name,
                        long_name: route.route_long_name,
                        desc: route.route_desc,
                        type: route.route_type
                    }
                    agency_info.routes.push(route_info);
                }
            })*/

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
            res.end();
        } else {
            console.log("FEED INFO")
            // initialize object
            var feed_info = {
                filename: filename,
                is_gtfs_ride: gtfs_ride_feed,
                agencies: []
            }

            // parse agencies' info
            for (x = 0; x < agencies.length; x++){
                var agency = {
                    index: x,
                    id: agencies[x].agency_id,
                    name: agencies[x].agency_name,
                    routes: Info.routesPerAgency(agencies[x], routes),
                    stops: Info.stopsPerAgency(agencies[x], routes, trips, stops)
                }
                feed_info.agencies.push(agency);
            }

            // send object to front-end
            res.writeHead(200, {"Access-Control-Allow-Origin": CORS});
            res.write(JSON.stringify(feed_info));
            res.end();
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
