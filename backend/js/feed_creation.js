// feed_creation.js is called by filehandler.js
// INPUT :: filehandler.js receives user input and passes it to the functions defined below
// OUTPUT :: feed_creation.js then generates all content for the 

// !! NOTE !!
//   Since the primary purpose of the Feed Creation tool is to allow users
//     to test and understand the GTFS-ride data format, only the *required* 
//     elements of a GTFS feed are included. GTFS feeds abound such that more
//     test data is of lower value due to abundant real-world data.
// 
//     However, efforts have been made to create test feed GTFS files that 
//     are relatively customized for a user, shown by aspects such as the 
//     ability to choose how the service pattern is specified.
// 
//   As for the GTFS-ride feed, *all* five files and *all* fields within 
//     them are included.

// GTFS INCLUDED FILES  ============
//   agency.txt
//   stops.txt
//   routes.txt
//   trips.txt
//   stop_times.txt
//   calendar.txt
//   feed_info.txt (since referenced in GTFS-ride)

// GTFS-RIDE INCLUDED FILES  =======
//   board_alight.txt
//   trip_capacity.txt
//   rider_trip.txt
//   ridership.txt
//   ride_feed_info.txt (required)

var randomLastName = require('random-lastname');
var randordinal_converter = require('number-to-words'); // ex ordinal_converter.toOrdinal(21); => “21st”
var csvStringify = require('csv-stringify');
var csv_stringify = csvStringify({delimiter: ','});
var csvStringifySync = require('csv-stringify/lib/sync');
var fs = require('fs');
var zip = require('cross-zip');

var FILEPATH = "feed_creation/";
var FILENAME = "fc.zip";
//var FILEPATH = "./"

// GET RANDOM INT INCLUSIVE ================
function getRandomIntInclusive (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
};

// PAD NUMBER SIZE TO TWO DIGITS
function pad(num) {
    var s = num + "";
    while (s.length < 2) s = "0" + s;
    return s;
}

// TIME INCREMENTER ========================
function incrementTime (input_time, amount) {

    // receive input hours, minutes, seconds
    var time = input_time.split(":");
    var hours = Number(time[0]);
    var minutes = Number(time[1]);
    var seconds = Number(time[2]);

    total_minutes = hours * 60 + minutes;
    total_minutes = total_minutes + amount;

    output_hours = Math.floor(total_minutes / 60);
    output_minutes = total_minutes % 60;

    // hours are not modded (%) for 24 hours, since if a trip goes past midnight
    //   /multiple days, the hours number needs to be greater than 24, 48, 72, etc
    //   to reflect this.

    // seconds remains the same
    return (pad(output_hours) + ":" + pad(output_minutes) + ":" + pad(seconds));
}

// get a trip's agency
// returns null if it could not find an agency
function getAgencyOfTrip(trip_id, trips, routes){
    for (var r = 0; r < routes.length; r++){
        if (routes[r].route_id == trips[trip_id].route_id){
            return routes[r].agency_id
        }
    }
    return null
}

// increment date by 1 day
function tomorrow(d){
    var year = Math.floor(d / 10000)
    var month = Math.floor((d % 10000) / 100);
    var day = d % 100;
    switch(month){
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
            if (day == 31){
                return ((year * 10000) + ((month+1) * 100) + 1)
            } else {
                return ++d
            }
        case 4:
        case 6:
        case 9:
        case 11:
            if (day == 30){
                return ((year * 10000) + ((month+1) * 100) + 1)
            } else {
                return ++d
            }
        case 2:
            if ((year % 4) == 0 && (year % 400) != 0){ // if leap year
                if (day == 29){
                    return ((year * 10000) + 301)
                } else {
                    return ++d
                }
            } else { // if not leap year
                if (day == 28){
                    return ((year * 10000) + 301)
                } else {
                    return ++d
                }
            }
        case 12:
            if (day == 31){
                return (((year+1) * 10000) + 101)
            } else {
                return ++d
            }
        default:
            return ++d;
    }
}



module.exports = {
    // AGENCY.TXT CREATE (GTFS) ================
    // Description: 
    //   generates one line per agency desired by the user
    //   '#' in the examples below will be '1', '2' ... 'n' 
    //          
    // User Input: 
    //   number of agencies
    //
    // Attributes: 
    //   agency_id       | static - always "AGENCY#"          
    //   agency_name     | static - always "Test Transit #"
    //   agency_url      | static - always points to "https://www.gtfs-ride.org"
    //   agency_timezone | static - always "America/Los_Angeles"

    agencyCreate: function(num_agencies){
        var agencies = [];
        var temp_agency = {
            agency_id: "",
            agency_name: "",
            agency_url: "",
            agency_timezone: "",
        };

        for (var i = 1; i <= num_agencies; i++){
            temp_agency = {
                agency_id: "",
                agency_name: "",
                agency_url: "",
                agency_timezone: "",
            }
            temp_agency.agency_id = "AGENCY" + String(i);
            temp_agency.agency_name = "Test Transit" + String(i);
            temp_agency.agency_url = "https://www.gtfs-ride.org";
            temp_agency.agency_timezone = "America/Los_Angeles";
            agencies.push(temp_agency);
        }
        return agencies;  
    },



    // CREATE CALENDAR.TXT (GTFS) ================
    // Description: 
    //   generates one line representing a single calendar of
    //   service days for all agencies.
    //          
    // User Input: 
    //   service_id: set based on days of operation
    //
    // Attributes: 
    //   service_id       | static - always ""          
    //   monday...sunday  | static - each is set to "1"
    //   start_date       | static - always "20000101" = Jan 1, 2000
    //   end_date         | static - always "20500101" = Jan 1, 2050

    calendarCreate: function(operation_days, start_date_input, end_date_input){
        // var calendar = {
        //     service_id: "WEEKEND_CALENDAR",
        //     monday: 0,
        //     tuesday: 0,
        //     wednesday: 0,
        //     thursday: 0,
        //     friday: 0,
        //     saturday: 1,
        //     sunday: 1,
        //     start_date: start_date_input,
        //     end_date: end_date_input,
        // }

        if (operation_days == 0){
            return {
                service_id: "WEEKEND_CALENDAR",
                monday: 0,
                tuesday: 0,
                wednesday: 0,
                thursday: 0,
                friday: 0,
                saturday: 1,
                sunday: 1,
                start_date: start_date_input,
                end_date: end_date_input,
            }
        }
        if (operation_days == 1){
            return {
                service_id: "WEEKDAY_CALENDAR",
                monday: 1,
                tuesday: 1,
                wednesday: 1,
                thursday: 1,
                friday: 1,
                saturday: 0,
                sunday: 0,
                start_date: start_date_input,
                end_date: end_date_input,
            }
        }
        if (operation_days == 2){
            return {
                service_id: "SATURDAY_CALENDAR",
                monday: 1,
                tuesday: 1,
                wednesday: 1,
                thursday: 1,
                friday: 1,
                saturday: 1,
                sunday: 0,
                start_date: start_date_input,
                end_date: end_date_input,
            }
        }
        if (operation_days == 3){
            return {
                service_id: "SUNDAY_CALENDAR",
                monday: 1,
                tuesday: 1,
                wednesday: 1,
                thursday: 1,
                friday: 1,
                saturday: 0,
                sunday: 1,
                start_date: start_date_input,
                end_date: end_date_input,
            };
        }
        if (operation_days == 4){
            return {
                service_id: "ALL_CALENDAR",
                monday: 1,
                tuesday: 1,
                wednesday: 1,
                thursday: 1,
                friday: 1,
                saturday: 1,
                sunday: 1,
                start_date: start_date_input,
                end_date: end_date_input,
            };
        }
        // return calendar;              
    },

     // CREATE CALENDAR_DATES.TXT (GTFS) ================
    // Description: 
    //   six hard-coded exceptions for calendar.txt (holidays)
    //          
    // User Input: 
    //   none. each agency will have the same service days.
    //
    // Attributes: 
    //   service_id       | static - always "BASE_CALENDAR"          
    //   date             | static - based on holiday represented
    //   exception_type   | static - always "2" for remove (as opposed to add)

    calendarDatesCreate: function(calendar){
        startYearNum = Math.floor(calendar.start_date / 10000); // number
        endYearNum = Math.floor(calendar.end_date / 10000); // number
       
        var calendar_dates = [];
        for(var i = startYearNum; i <= endYearNum; i++){

            // NEW YEARS
            var newyear_date = {
                service_id: calendar.service_id,
                date: i + "0101",
                exception_type: 0,
            };
            calendar_dates.push(newyear_date);

            // CHRISTMAS
            var christmas_date = {
                service_id: calendar.service_id,
                date: i + "1225",
                exception_type: 0,
            };
            calendar_dates.push(christmas_date);
        }

        return calendar_dates;
    },

    // CREATE FEED_INFO.TXT (GTFS) ================
    // Description: 
    //   Simple function. This exists to provide "feed_version" for 
    //   ride_feed_info.txt
    //          
    // User Input: 
    //   feed_start_date
    //   feed_end_date
    //
    // Attributes: 
    //   feed_publisher_name  | static - always "Test Transit"
    //   feed_publisher_url   | static - always "https://github.com/ODOT-PTS/GTFS-ride/"         
    //   feed_lang            | static - always "en"
    //   feed_start_date      | user-defined
    //   feed_end_date        | user-defined
    //   feed_version         | static - always "1.0.0"    

    feedInfoCreate: function(feed_start_date1, feed_end_date1){
        return {
            feed_publisher_name: "Test Transit",
            feed_publisher_url: "https://github.com/ODOT-PTS/GTFS-ride/",
            feed_lang: "en",
            feed_start_date: feed_start_date1,
            feed_end_date: feed_end_date1,
            feed_version: "1.0.0",
        }
    //   return feed_info;
    },


    // CREATE ROUTES.TXT (GTFS) ================
    // Description: 
    //   generates one line per route desired by the user
    //   '#' in the examples below will be '1', '2' ... 'n'
    //   always generates agency_id, even if only one agency
    //   randomly assigns each route to an agency
    //   randomly generates route_long_name, which is made up of two randomly generated
    //     names from a 500 name set, ie "Franklin-Jefferson," which represents 
    //     heading toward Franklin northbound and Jefferson southbound, for example.
    //     This means there could be duplicates, but this should not be an issue since
    //     odds are very slim for this to happen. A test feed will usually have a few 
    //     hundred routes max anyway.
    //  
    //          
    // User Input: 
    //   number of routes 
    //   number of agencies (for purpose of randomly assigning routes)
    //
    // Attributes: 
    //   route_id         | static - always "ROUTE#"          
    //   agency_id        | random - chosen from number of agencies | example "AGENCY#"
    //   route_long_name  | random - chosen with random-lastname npm module. There are 500
    //                               since each long_name is two names with a hyphen 
    //   route_type       | static - always "3" (= Bus)

    routesCreate: function(num_routes, num_agencies, agencies){
        routes = [];
        var temp_route = {
            route_id: "",
            agency_id: "",
            route_long_name: "",
            route_type: -1,
        };
        //agencies = module.exports.agencyCreate(num_agencies);
        for (var i = 1; i <= num_routes; i++){
            temp_route = {
                route_id: "",
                agency_id: "",
                route_long_name: "",
                route_type: -1,
            };
            temp_route.route_id = "ROUTE" + i;
            var rand_agency = getRandomIntInclusive(1, num_agencies);
            temp_route.agency_id = "AGENCY" + rand_agency;

            rand_name1 = randomLastName();
            rand_name2 = randomLastName();
            temp_route.route_long_name = rand_name1 + "-" + rand_name2;
            temp_route.route_type = 3;
            routes.push(temp_route);
        }
        return routes;
    },

    // CREATE STOPS.TXT (GTFS) ================
    // Description: 
    //   generates one line per stop desired by the user
    //   '#' in the examples below will be '1', '2' ... 'n'
    //   location_type is undefined, meaning all stops are merely stops
    //     without any nested hierarchy/variation in types of stop.
    //   randomly generates a random_lat (-90,90) and random_lon (-180,180)
    //     and then uses these two numbers to randomly generate all stop 
    //     lat's and lon's (so stops occur roughly in the same geographical area)
    //     though sequences of stops will not occur in nice paths/make sense
    //     These values are rounded to six decimal points since this is the standard
    //       of precision.
    //   NOTE :: we will need to be able to handle water vs land and we can use
    //     this API -- https://github.com/simonepri/is-sea  
    //     NOTE :: this was later abandoned due to too many issues with the dependency.
    //       not only were its dependencies far out of date, we also had an issue
    //       with using it.   
    //          
    //   User Input: 
    //     number of stops 
    //
    // Attributes: 
    //   stop_id    | static - always "STOP#"          
    //   stop_name  | random - chosen with random-lastname npm module.
    //                         potentially not unique, but this is fine.
    //   stop_lat   | random - see description above
    //   stop_lon   | random - see description above

    stopsCreate: function(num_stops){
        var stops = [];
        var temp_stop = {
            stop_id: "",
            stop_name: "",
            stop_lat: 0,
            stop_lon: 0,
        };
        var randLat;
        var randLon;
        for (var i = 1; i <= num_stops; i++){
            temp_stop = {
                stop_id: "",
                stop_name: "",
                stop_lat: 0,
                stop_lon: 0,
            };

            // generate random street (ex "21st") and name (ex "Jefferson")
            randNumber = getRandomIntInclusive(1, 200); // between 1 and 200
            randOrdinal = randordinal_converter.toOrdinal(randNumber);
            randName = randomLastName();
            temp_stop.stop_name = randOrdinal + " and " + randName;

            // Math.random() :: generate a float between 0 and 1
            temp_stop.stop_id = "STOP" + i;
            randLatRaw = (Math.random() * 180) - 90; // between -90 and 90
            randLat = parseFloat(randLatRaw.toFixed(6)); // round to six decimal points
 
            randLonRaw = (Math.random() * 360) - 180; // between -180 and 180
            randLon = parseFloat(randLatRaw.toFixed(6)); // rount to six decimal points

            temp_stop.stop_lat = randLat;
            temp_stop.stop_lon = randLon;
            stops.push(temp_stop);
        }
        return stops;
    },
    

    // CREATE STOP_TIMES.TXT (GTFS) ================
    // Description: 
    //     stop_times is essentially helper entries for each trip, specifying
    //          the arrival and departure times for a given trip.
    //     We know the number of trips from #trips per stops.
    //     Loop through trips and for each trip, create 
    //     
    //     NOTE :: arrival_time / stop_time
    //          starts a trip at 6:00:00 then, increments it upward by 5 minutes
    //          between stops with a 2 minute difference between the arrival_time
    //          and departure time.
    //          ie (6:00 arrive, 6:02 depart), (6:07 arrive, 6:09 depart)...
    //     NOTE :: user is specifying avg trips per route. This will yield a 
    //          num_trips that will then have to be supplied to this function.
    //     algorithm for generating more logical stop sequences/routes was abandoned.
    //          
    // User Input: 
    //   number of stops, number of routes
    //
    // Needs to be calculated elsewhere and supplied:
    //   number of trips
    //
    // Importantly, we will use the above to calculate stops per route, so we can 
    //   assign the right number of stops to each trip.
    // This number is being calculated, and yet a stop sequence is also currently being
    //   capped at 100 stops per stop sequence
    // TODO :: add variable from user for max stops per route
    //
    // Attributes: 
    //   trip_id         | static - always "TRIP#"          
    //   arrival_time    | static - incremented in a pattern. see desc above
    //   departure_time  | static - incremented in a pattern. see desc above
    //   stop_id         | static - references a stop (randomized)
    //   stop_sequence   | algorithm - see desc above

    stopTimesCreate: function(num_trips, trips, num_stops, num_routes, num_trips_per_route){
        var stop_times = [];
        var stop_sequence_list = [];
        // var stop_time_entry = {
        //     trip_id: "",
        //     arrival_time: "",
        //     departure_time: "",
        //     stop_id: "",
        //     stop_sequence: 0,
        // };
        var min = 0;
        var count = 1;

        // get number of stops per route. also get remainder so we can add to last trip
        num_stops_per_route = num_stops / num_routes;
        remainder = num_routes % num_stops; 

        // FOR EACH TRIP IN FEED
        while (count <= num_trips) {

            // GENERATE STOP SEQUENCE for a set of trips belonging to the same route
            // e.g. [STOP5, STOP6, STOP48, STOP62...]
            // stop sequences do not ultimately increment here, but we do not 
            //   expect an issue. For example, there could be three lines in stop_times.txt
            //   with stops 5, 56, and 10, but something that consumes this data would 
            //   likely interpret it as 5, 10, 56 or this aspect wouldn't even matter since
            //   ultimately this is just a list of IDs
            stop_sequence_list = []; // empty the list for new sequence
            for(var k = 1; k <= num_stops_per_route && k <= 100000; k++){ // TODO - make this cap user defined                
                // get random stop ID for each index of the stop sequence list
                randStopID = getRandomIntInclusive(1, num_stops); // between 1 and num_stops
                stop_sequence_list.push("STOP" + randStopID);
            }

            // FOR EACH TRIP (in one set - of size defined by user in trips per route)
            for (var j = 1; j <= num_trips_per_route; j++){
                 
                // reset values prior to creating values for a single trip
                var local_arr_time = "00:00:00";
                var local_dep_time = "05:55:00";
                
                // REPEAT STOP SEQUENCE for each trip in the route
                // counter to ensure we generate the proper number of stops for a trip
                for (var c = 0; c < stop_sequence_list.length; c++){
                    //console.log("printing a line for [" + c + "] in stop sequence list");
                    
                    var count2 = count;

                    // increment times accordingly
                    local_arr_time = incrementTime(local_dep_time, 5);
                    local_dep_time = incrementTime(local_arr_time, 2);

                    // GENERATE A LINE (represents a single stop time)
                    var stop_time_entry = {			  
                        trip_id: "TRIP" + count2, // trip id			  
                        arrival_time: local_arr_time, // arrival time begins at 06:00:00
                        departure_time: local_dep_time, // departure time begins at 06:02:00
                        stop_id: stop_sequence_list[c], // stop id (taken from the sequence generated)
                        stop_sequence: c + 1,		   	
                    };
                    
                    // stop_time_entry.trip_id = "TRIP" + count2; // trip id
                    // stop_time_entry.stop_id = stop_sequence_list[c]; // stop id (taken from the sequence generated)
                    // stop_time_entry.arrival_time = incrementTime(stop_time_entry.departure_time, 5); // arrival time begins at 06:00:00
                    // stop_time_entry.departure_time = incrementTime(stop_time_entry.arrival_time, 2); // departure time begins at 06:02:00
                    // stop_time_entry.stop_sequence = c; // the stop sequence #

                    // PUSH LINE TO ARRAY
                    stop_times.push(stop_time_entry); 
                }

                count = count + 1; // account for a new trip
            }
        }
        //console.log("Stop times " + stop_times.length)
        return stop_times;
    },


    // CREATE TRIPS.TXT (GTFS) ================
    // Description: 
    //   generates one line per stop desired by the user
    //   '#' in the examples below will be '1', '2' ... 'n'
    //   each route is assigned a user-defined number of trips
    //   this means that each route is served equally, and for the purposes
    //     of this test feed, that is fine 
    //          
    // User Input: 
    //   number of routes
    //   number of trips per route
    //
    // Attributes: 
    //   route_id     | static - always "ROUTE#" (randomly assigned)         
    //   service_id   | static - always "BASE_CALENDAR" since service days
    //                           do not vary.
    //   trip_id      | static - always "TRIP#"
    //   direction_id | random - either 0 or 1 for direction 
    //                           included because it is referenced in GTFS-ride

    tripsCreate: function(num_routes, num_trips_per_route){
        var trips = [];
        var trips_counter = 1;
        var temp_trip = {
            route_id: "",
            service_id: "",
            trip_id: "",
            direction_id: 0,
        };
        // for each route
        for (var i = 1; i <= num_routes; i++){

            // for each trip in the route
            for (var j = 0; j < num_trips_per_route; j++){
                temp_trip = {
                    route_id: "",
                    service_id: "",
                    trip_id: "",
                    direction_id: 0,
                };
                temp_trip.route_id = "ROUTE" + i;
                temp_trip.service_id = "BASE_CALENDAR";
                temp_trip.trip_id = "TRIP" + trips_counter;
                temp_trip.direction_id = getRandomIntInclusive(0,1); // generates 0 or 1 with equal probability
                trips_counter = trips_counter + 1;

                trips.push(temp_trip);
            }

        }
        return trips;
    },

    // !! NOTE !!
    //   Since the primary purpose of the Feed Creation tool is to allow users
    //     to test and understand the GTFS-ride data format, only the *required* 
    //     elements of a GTFS feed are included. GTFS feeds abound such that more
    //     test data is of lower value due to abundant real-world data.
    // 
    //     However, efforts have been made to create test feed GTFS files that 
    //     are relatively customized for a user, shown by aspects such as the 
    //     ability to choose how the service pattern is specified.
    // 
    //   As for the GTFS-ride feed, *all* five files and *all* fields within 
    //     them are included.


    // CREATE RIDE_FEED_INFO.TXT (GTFS-ride) ================
    // Description: 
    //   generates very basic information about the feeds. 
    //   this is the one file that is required for gtfs-ride, and it is 
    //     often used to discern whether the feed is gtfs or gtfs-ride
    //          
    // User Input: 
    //   files (an int that shows which files ridership data is specified in.)
    //   ride_start_date (same as for feed_info.txt)
    //   ride_end_date (same as for feed_info.txt)
    //
    // Attributes: 
    //   ride_files      | USER INPUT -- All files and all fields will always be generated,
    //                     as specified by ODOT + OSU, however aggregation level will
    //                     be supported (ie data on stop level or agency level),
    //                     so this field *will* vary
    //   ride_start_date | This will simply pull from the feed_info.txt start date
    //   ride_end_date   | This will simply pull from the feed_info.txt end date
    //   gtfs_feed_date  | STATIC -- references feed_version in ride_info.txt or serves 
    //                     as a replacement for it. Specifies correctness/recency of GTFS 
    //                     elements. Since this is a test, feed, will always be "1.0.0"
    //
    //   default_currency_type | STATIC -- USD
    //   ride_feed_version     | STATIC -- 1.0.0
            
    rideFeedInfoCreate: function(files, feed_start_date, feed_end_date){
        var ride_feed_info = {
            ride_files : files, // INT for specific combination of files
            ride_start_date : feed_start_date,
            ride_end_date : feed_end_date,
            gtfs_feed_date : "1.0.0",
            default_currency_type : "USD",
            ride_feed_version : "1.0.0",
        } 
        if ( files == null ){
            //defaults to all files if not speciified
            ride_feed_info.ride_files = 6;
        }
        return ride_feed_info;
    },


    // CREATE BOARD_ALIGHT.TXT (GTFS-ride) ================
    // Description: 
    //   Tracks boarding + alighting (getting off) associated information at stop-level OR trip level.
    //          
    // User Input: 
    //   num_boardings
    //   num_alightings
    //
    // Attributes: 
    //   trip_id | random generate between 0 and num_trips
    //   stop_id | random generate between 0 and num_stops 
    //               and check if used in a trip first
    //               OR if no stop-level ridership information, set all to 0 TODO
    //   stop_sequence | INPUT received from stop_times
    //   record_use | static - 0  Entry contains complete ridership counts
    //   schedule_relationship | user-defined
    //   boardings |automated based on stop
    //   alightings | automated based on stop
    //   currrent_load | load_count / load_type
    //   load_count | user-defined
    //   load_type | user-defined
    //   rack_down | user-defined
    //   bike-boardings |
    //   bike-alightings |
    //   ramp_used |
    //   ramp_boardings |
    //   ramp_alightings |
    //   service_data |
    //   service_arrival_time |
    //   service_departure_time |
    //   source |

    // POSSIBLE DECLARATION boardAlightCreate: function(trips, stops, num_trips, num_stops, stop_times,relationship, loadcount, loadtype, rackdown,bikeboardings,bikealightings,rampused,rampboardings,rampalightings,user_source){
    boardAlightCreate: function(trips, stops, num_trips, num_stops, num_routes, stop_times, user_source, rider_trip, start_date, end_date){
        var board_alight = [];

        var d = start_date
        while (d <= end_date){ // for every day on the feed
            for (var st = 0; st < stop_times.length; st++){ // fill the board_alight array with info from stop_times, no ridership info yet
                board_alight.push ({
                    trip_id : stop_times[st].trip_id,
                    stop_id : stop_times[st].stop_id,
                    stop_sequence : stop_times[st].stop_sequence,
                    record_use : 0,
                    schedule_relationship : 0,
                    boardings : 0,
                    alightings : 0,
                    current_load : 0,
                    load_count : 0,
                    load_type : 1, // departing load
                    rack_down : 0,
                    bike_boardings : 0,
                    bike_alightings : 0,
                    ramp_used : 0,
                    ramp_boardings : 0,
                    ramp_alightings : 0,
                    service_date : d,
                    service_arrival_time : stop_times[st].arrival_time,
                    service_departure_time : stop_times[st].departure_time,
                    source : user_source,  
                })
            }
            d = tomorrow(d) // increment the date
        }

        // sort the rider_trip array by service_date
        /* this WILL change the final array and the exported file
           to undo this, sort the rider_trip array by rider_id,
           but tools should not fail due to the ordering of the rows
        */
        rider_trip.sort(function(a, b){
            return a.service_date - b.service_date
        })

        // fill the board_alight array with ridership data
        var num_stops_per_route = num_stops / num_routes;
        var last_date = start_date // the date of the previous row in rider_trip
        var date_start_index = 0 // the starting index of the board_alight dataset for the day
        for (var r = 0; r < rider_trip.length; r++){ // for every field in rider_trip
            // check if the date is the same as the last one
            if (rider_trip[r].service_date != last_date){
                date_start_index += stop_times.length // increment the starting index to point to the next day's ridership data
                // this works since we sort the rider_trip array by date beforehand
                last_date = rider_trip[r].service_date
            }

            var trip_num = Number(rider_trip[r].trip_id.substr(4)) // get the trip ID from index 4 (where the number starts) onwards and convert it to number
            var trip_start_index = date_start_index + ((trip_num - 1) * num_stops_per_route) // the index where the trip starts on board_alight array
            var boarding_index = trip_start_index + rider_trip[r].boarding_stop_sequence - 1 // the index where boarding occurs
            var alighting_index = trip_start_index + rider_trip[r].alighting_stop_sequence - 1 // the index where alighting occurs

            // increment the boardings and alightings
            board_alight[boarding_index].boardings++
            board_alight[alighting_index].alightings++
        }

        // do another run-through of the board_alight array to set the load_count field
        var max_load = 60 // the maximum load, used for current_load
        // special case for index 0 where there is no row/element before it
        board_alight[0].load_count = board_alight[0].boardings - board_alight[0].alightings // first load = boardings - alightings (no checks to the previous row)
        board_alight[0].current_load = board_alight[0].load_count / max_load
        for (var b = 1; b < board_alight.length; b++){
            if (board_alight[b].trip_id == board_alight[b-1].trip_id){ // if this row is still part of the same trip as the last one
                board_alight[b].load_count = board_alight[b-1].load_count + board_alight[b].boardings - board_alight[b].alightings // add the previous load count to the current calculation
            } else { // if this is a part of a new trip
                board_alight[b].load_count = board_alight[b].boardings - board_alight[b].alightings // just count the number of boardings minus the number of alightings
            }
            board_alight[b].current_load = board_alight[b].load_count * 100 / max_load // current_load is a percentage of the load (how full the vehicle is)
        }
        
        return board_alight;
    },

    riderTripCreate: function(min_riders, max_riders, trips, num_trips, num_stops, routes, num_routes, stop_times, aggr_level, start_date, end_date){
        var num_riders = getRandomIntInclusive(min_riders, max_riders)
        var rider_trips = [];
        var num_stops_per_route = num_stops / num_routes;
        var date = start_date

        for (var i = 0; i < num_riders; i++){

            // get a random trip
            var rand_trip = getRandomIntInclusive(0, num_trips-1);
            var trip_start_index = rand_trip * num_stops_per_route;

            // get 2 random stops within a trip
            var stop1, stop2
            
            var stop1_index = getRandomIntInclusive(trip_start_index, trip_start_index + num_stops_per_route - 1)
            var stop2_index
            do { // stop2 cannot be the same as stop1
                stop2_index = getRandomIntInclusive(trip_start_index, trip_start_index + num_stops_per_route - 1)
            } while (stop1_index == stop2_index)

            if (stop1_index > stop2_index){ // swap the order if stop1_index is greater than stop2_index so the trip always go forward
                stop1 = stop_times[stop2_index]
                stop2 = stop_times[stop1_index]
            } else {
                stop1 = stop_times[stop1_index]
                stop2 = stop_times[stop2_index]
            }

            // add the row to rider_trip
            var temp_rider = {
                rider_id : "RIDER" + i,
                agency_id : getAgencyOfTrip(rand_trip, trips, routes),
                trip_id : "TRIP" + (rand_trip+1),
                boarding_stop_id : stop1.stop_id,
                boarding_stop_sequence : stop1.stop_sequence,
                alighting_stop_id : stop2.stop_id,
                alighting_stop_sequence : stop2.stop_sequence,
                service_date : date,
                boarding_time : stop1.arrival_time,
                alighting_time : stop2.arrival_time,
                rider_type : 0,
                rider_type_description : "no type",
                fare_paid : 10,
                transaction_type : 0,
                fare_media : 0,
                accompanying_device : 0,
                transfer_status : 0,
            };
            rider_trips.push(temp_rider);

            // increment the date, and go back to the start date if the current date exceeds the end date
            date = tomorrow(date)
            if (date > end_date){
                date = start_date
            }
        }

        return rider_trips;
    },


    // CREATE RIDERSHIP.TXT (GTFS-ride) ================
    // Description: 
    //   
    //          
    // User Input: 
    //   num_boardings
    //   num_alightings
    //
    // Attributes: 
    //   temp_ridership

    ridershipCreate: function(operation_days, stops, num_stops, num_routes, routes, board_alight, num_riders, trips, num_trips){
        var ridership = [];
        var temp_ridership = {
            total_boardings : 0,
            total_alightings : 0,
            ridership_start_date : 20000101,
            ridership_end_date : 20000101,
            ridership_start_time : 0,
            ridership_end_time : 0,
            service_id: "BASE_CALENDAR",
            monday: 1,
            tuesday: 1,
            wednesday: 1,
            thursday: 1,
            friday: 1,
            saturday: 1,
            sunday: 1,
            agency_id : "RIDE",
            route_id : "",
            direction_id : "" ,
            trip_id : "",
            stop_id : "",
        };
        
        for (var j = 0; j < num_riders; j++){    
            for ( var i = 0; i< num_stops; i++ ){
                if (board_alight.stop_id == stops[i].stop_id){
                    temp_ridership.stop_id = stops[i].stop_id;
                    temp_ridership.trip_id = stops[i].trip_id;
                    temp_ridership.total_boardings == temp_ridership.total_boardings + board_alight.boardings;
                    temp_ridership.total_alightings == temp_ridership.total_alightings + board_alight.alightings;
                    for ( var k = 0; k < num_trips; k++){
                        if (trips[k].trip_id == stops[i].stop_id){
                            temp_ridership.direction_id = trips[k].direction_id;
                        }
                    }
                }
            }
            var rand_route = getRandomIntInclusive(1, num_routes);
            var rand_id = routes[rand_route].route_id;
            temp_ridership.route_id = rand_id;
            ridership.push(temp_ridership);
        }
        
        return ridership;
    },

    tripCapacityCreate: function(trips, num_trips, agencies, num_agencies){
        var trip_capacities = [];
        
        var temp_trip = {
            agency_id : "",
            trip_id : "",
            service_date : 20000101,
            vehicle_description : "Bus",
            seated_capacity : 75,
            standing_capacity : 30,
            wheelchair_capacity : 5,
            bike_capacity : 15
        };
        
        for (var i = 0; i < num_trips; i++){
            temp_trip.trip_id = trips[i];
            var rand_agency_index = getRandomIntInclusive(1, num_agencies);
            var rand_agency = agencies[rand_agency_index].agency_id;
            temp_trip.agency_id = rand_agency;
            trip_capacities.push(temp_trip);
        }
        return trip_capacities;
    },


    // the main function to generate the test feed
    // this function may take a long time, please call it asynchronously if possible
    Feed_Creation: function(
        num_agencies, num_routes, num_stops, num_trips, num_trips_per_route,
        start_date, end_date, feed_date, operation_days,
        user_source, min_riders, max_riders, aggr_level,
        files){
    //Feed_Creation: function(num_agencies, num_routes, num_stops, num_trips, num_trips_per_route, start_date, end_date, feed_date, user_source, num_riders, files, operation_days){
        var agencies = this.agencyCreate(num_agencies);
        var calendar = this.calendarCreate(operation_days, start_date, end_date);
        var calendar_dates = this.calendarDatesCreate(calendar);
        var stops = this.stopsCreate(num_stops);
        var routes = this.routesCreate(num_routes, num_agencies);
        var trips = this.tripsCreate(num_routes, num_trips_per_route);
        var stopTimes = this.stopTimesCreate(num_trips, trips, num_stops, num_routes, num_trips_per_route);
        var feedInfo = this.feedInfoCreate(start_date, end_date);
        var rideFeedInfo = this.rideFeedInfoCreate(files, start_date, end_date);

        var riderTrip = this.riderTripCreate(min_riders, max_riders, trips, num_trips, num_stops, routes, num_routes, stopTimes, aggr_level, start_date, end_date);
        var boardAlight = this.boardAlightCreate(trips, stops, num_trips, num_stops, num_routes, stopTimes, user_source, riderTrip, start_date, end_date);
        //var ridership = this.ridershipCreate(calendar, stops, num_stops, num_routes, routes, boardAlight, num_riders, trips, num_trips);
        //var tripCapacity = this.tripCapacityCreate(trips, num_trips, agencies, num_agencies);


        // CSV STRINGIFY =========================
        var agencyCSV = csvStringifySync(agencies, {header: true, columns: ["agency_id", "agency_name", "agency_url", "agency_timezone", "agency_lang", "agency_phone", "agency_fare_url", "agency_email"]})
        var calendarCSV = csvStringifySync([calendar], {header: true, columns: ["service_id","monday","tuesday","wednesday","thursday","friday","saturday","sunday","start_date","end_date"]})
        var calendarDatesCSV = csvStringifySync(calendar_dates, {header: true, columns: ["service_id","date","exception_type"]})
        var stopsCSV = csvStringifySync(stops, {header: true, columns: ["stop_id", "stop_code", "stop_name", "stop_desc", "stop_lat", "stop_lon", "zone_id", "stop_url", "location_type", "parent_station", "stop_timezone", "wheelchair_boarding", "level_id", "platform_code"]})
        var routesCSV = csvStringifySync(routes, {header: true, columns: ["agency_id","route_id","route_short_name","route_long_name","route_desc","route_type","route_url","route_color","route_text_color","route_sort_order","min_headway_minutes","eligibility_restricted"]})
        var tripsCSV = csvStringifySync(trips, {header: true, columns: ["route_id", "service_id", "trip_id", "trip_short_name", "trip_headsign", "direction_id", "block_id", "shape_id", "bikes_allowed", "wheelchair_accessible", "trip_type", "drt_max_travel_time", "drt_avg_travel_time", "drt_advance_book_min", "drt_pickup_message", "drt_drop_off_message", "continuous_pickup_message", "continuous_drop_off_message"]})
        var stopTimesCSV = csvStringifySync(stopTimes, {header: true, columns: ["trip_id", "arrival_time", "departure_time", "stop_id", "stop_sequence", "stop_headsign", "pickup_type", "drop_off_type", "shape_dist_traveled", "timepoint", "start_service_area_id", "end_service_area_id", "start_service_area_radius", "end_service_area_radius", "continuous_pickup", "continuous_drop_off", "pickup_area_id", "drop_off_area_id", "pickup_service_area_radius", "drop_off_service_area_radius"]})
        var feedInfoCSV = csvStringifySync([feedInfo], {header: true, columns: ["feed_publisher_url", "feed_publisher_name", "feed_lang", "feed_version", "feed_license", "feed_contact_email", "feed_contact_url", "feed_start_date", "feed_end_date", "feed_id"]})
        var rideFeedInfoCSV = csvStringifySync([rideFeedInfo], {header: true, columns: ["ride_files","ride_start_date","ride_end_date","gtfs_feed_date","default_currency_type","ride_feed_version"]})
        var boardAlightCSV = csvStringifySync(boardAlight, {header: true, columns: ["trip_id","stop_id","stop_sequence","record_use","schedule_relationship","boardings","alightings","current_load","load_count","load_type","rack_down","bike_boardings","bike_alightings","ramp_used","ramp_boardings","ramp_alightings","service_date","service_arrival_time","service_departure_time","source"]})
        var riderTripCSV = csvStringifySync(riderTrip, {header: true, columns: ["rider_id","agency_id","trip_id","boarding_stop_id","boarding_stop_sequence","alighting_stop_id","alighting_stop_sequence","service_date","boarding_time","alighting_time","rider_type","rider_type_description","fare_paid","transaction_type","fare_media","accompanying_device","transfer_status"]})
        // var ridershipCSV = csvStringifySync(ridership, {header: true, columns: ["total_boardings","total_alightings","ridership_start_date","ridership_end_date","ridership_start_time","ridership_end_time","service_id","monday","tuesday","wednesday","thursday","friday","saturday","sunday","agency_id","route_id","direction_id","trip_id","stop_id"]})
        // var tripCapacityCSV = csvStringifySync(tripCapacity, {header: true, columns: ["agency_id","trip_id","service_date","vehicle_description","seated_capacity","standing_capacity","wheelchair_capacity","bike_capacity"]})


        //console.log(process.cwd())
        // WRITE THE FILES =========================
        fs.writeFileSync(FILEPATH + "agency.txt", agencyCSV);
        fs.writeFileSync(FILEPATH + "stops.txt", stopsCSV);
        fs.writeFileSync(FILEPATH + "routes.txt", routesCSV);
        fs.writeFileSync(FILEPATH + "trips.txt", tripsCSV);
        fs.writeFileSync(FILEPATH + "stop_times.txt", stopTimesCSV);
        fs.writeFileSync(FILEPATH + "feed_info.txt", feedInfoCSV);
        fs.writeFileSync(FILEPATH + "calendar.txt", calendarCSV);
        fs.writeFileSync(FILEPATH + "calendar_dates.txt", calendarDatesCSV);
        fs.writeFileSync(FILEPATH + "ride_feed_info.txt", rideFeedInfoCSV);
        fs.writeFileSync(FILEPATH + "board_alight.txt", boardAlightCSV)
        fs.writeFileSync(FILEPATH + "rider_trip.txt", riderTripCSV)
        // fs.writeFileSync(FILEPATH + "ridership.txt", ridershipCSV)
        // fs.writeFileSync(FILEPATH + "trip_capacity.txt", tripCapacityCSV)

        // ZIP ALL FILES =========================
        var current_dir = process.cwd(); // save current working dir
        process.chdir(FILEPATH); // change dir
        zip.zipSync("./*.txt", "./" + FILENAME); // zip the files
        process.chdir(current_dir); // undo change dir

        // RETURN THE ZIP FILENAME
        return (FILEPATH + FILENAME);
    }
};


// test function
//module.exports.Feed_Creation(2, 10, 100, 50, 5, 20200101, 20201231, 20200304, 0, 1000, 6)
//console.log(module.exports.tripsCreate(10, 5));

