var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var extract = require('extract-zip')
var csv = require('csv-parse/lib/sync')

var PORT = 8080;
var URL = '/fileupload';

// parsed files go here
// GTFS required
var agency = null, routes = null, trips = null, stops = null, stop_times = null, calendar = null, calendar_dates = null
// GTFS optional
var frequencies = null
// GTFS-ride
var gtfs_ride_feed = false; // true = GTFS-ride, false = GTFS (condition for true: ride_feed_info.txt exists)
var board_alight = null

http.createServer(function (req, res) {
    if (req.url == URL) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.file.path;
            var newpath = './uploads/' + files.file.name;
            var noext = (files.file.name).slice(0, -4); // removes the last 4 chars (".zip")
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;

                // extract the files
                extract(newpath, {dir: (process.cwd() + "/uploads/" + noext)}, function (err) {
                    if (err){
                        console.log("Error in extraction: " + err);
                        res.writeHead(415)
                        res.write("The specified file is not a valid GTFS feed.")
                        res.end();
                    } else {
                        console.log("Files extracted to " + noext + "/");

                        // check for required files
                        if (fs.existsSync("uploads/" + noext + "/routes.txt") &&
                        fs.existsSync("uploads/" + noext + "/agency.txt") && 
                        fs.existsSync("uploads/" + noext + "/trips.txt") &&
                        fs.existsSync("uploads/" + noext + "/stops.txt") && 
                        fs.existsSync("uploads/" + noext + "/stop_times.txt") && 
                        (fs.existsSync("uploads/" + noext + "/calendar.txt") || fs.existsSync("uploads/" + noext + "/calendar_dates.txt"))){
                            
                            // send response to client
                            res.writeHead(200, {'Content-Type': 'text/html', "Access-Control-Allow-Origin": "http://localhost:3000"});
                            res.write('File upload successful!');
                            res.end();

                            // read files and parse them
                            // GTFS required files
                            routes = csv(fs.readFileSync("uploads/" + noext + "/routes.txt"), {columns: true})
                            agency = csv(fs.readFileSync("uploads/" + noext + "/agency.txt"), {columns: true})
                            trips = csv(fs.readFileSync("uploads/" + noext + "/trips.txt"), {columns: true})
                            stops = csv(fs.readFileSync("uploads/" + noext + "/stops.txt"), {columns: true})
                            stop_times = csv(fs.readFileSync("uploads/" + noext + "/stop_times.txt"), {columns: true})

                            // GTFS conditionally required files
                            if (fs.existsSync("uploads/" + noext + "/calendar.txt")){
                                calendar = csv(fs.readFileSync("uploads/" + noext + "/calendar.txt"), {columns: true})
                            }
                            if (fs.existsSync("uploads/" + noext + "/calendar_dates.txt")){
                                calendar_dates = csv(fs.readFileSync("uploads/" + noext + "/calendar_dates.txt"), {columns: true})
                            }

                            // GTFS optional files
                            if (fs.existsSync("uploads/" + noext + "/frequencies.txt")){
                                frequencies = csv(fs.readFileSync("uploads/" + noext + "/frequencies.txt"), {columns: true})
                            }

                            // GTFS-ride files
                            if (fs.existsSync("uploads/" + noext + "/ride_feed_info.txt")){
                                gtfs_ride_feed = true;
                                board_alight = csv(fs.readFileSync("uploads/" + noext + "/board_alight.txt"), {columns: true})
                            }

                        } else { // if the required files do not exist
                            res.writeHead(415)
                            res.write("The specified file is not a valid GTFS feed.")
                            res.end();
                            console.log(noext + ".zip is not a valid GTFS feed");
                        }
                        
                    }
                    //console.log(agency.length)
                    //console.log(agency[0].agency_name);
                    //console.log("Agency: " + agency[0].agency_name)
                    
                })
            });
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
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
