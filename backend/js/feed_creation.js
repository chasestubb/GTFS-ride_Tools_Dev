// feed_creation.js is called by filehandler.js
// INPUT :: filehandler.js receives user input and passes it to the functions defined below
// OUTPUT :: feed_creation.js then generates all content for the 

// !! NOTE !!
//   Since the primary purpose of the Feed Creation tool is to allow users
//     to test the GTFS-ride data format, only the *required* elements of 
//     a GTFS feed will be included. GTFS feeds abound such that test
//     data is not necessary in lieu of available real-world data.
//   As for the GTFS-ride feed, *all* five files and all fields within 
//     them will be included.

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
var csvStringify = require('csv-stringify');
var csv_stringify = csvStringify({delimiter: ','})
var fs = require('fs')
const isSea = require('is-sea');
// ex. call => randomLastName();

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
        }
        for (var i = 0; i < num_agencies; i++){
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
    //   none. each agency will have the same service days.
    //
    // Attributes: 
    //   service_id       | static - always "CALENDAR_ALL"          
    //   monday...sunday  | static - each is set to "1"
    //   start_date       | static - always "20000101" = Jan 1, 2000
    //   end_date         | static - always "20500101" = Jan 1, 2050

    calendarCreate: function(){
        var calendar = {
            service_id: "CALENDAR_ALL",
            monday: 1,
            tuesday: 1,
            wednesday: 1,
            thursday: 1,
            friday: 1,
            saturday: 1,
            sunday: 1,
            start_date: 2000101,
            end_date: 20500101,
        }
        return calendar;              
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
        var feed_info = {
            feed_publisher_name: "Test Transit",
            feed_publisher_url: "https://github.com/ODOT-PTS/GTFS-ride/",
            feed_lang: "en",
            feed_start_date: feed_start_date1,
            feed_end_date: feed_end_date1,
        }
       return feed_info;
    },


    // CREATE ROUTES.TXT (GTFS) ================
    // Description: 
    //   generates one line per route desired by the user
    //   '#' in the examples below will be '1', '2' ... 'n'
    //   always generates agency_id, even if only one agency
    //          
    // User Input: 
    //   number of routes 
    //   number of agencies (for purpose of randomly assigning routes)
    //
    // Attributes: 
    //   route_id         | static - always "ROUTE#"          
    //   agency_id        | random - chosen from number of agencies | example "AGENCY#"
    //   route_short_name | random - chosen with random-lastname npm module.
    //                               potentially not unique, but this is fine.
    //   route_type       | static - always "3" (= Bus)

    routesCreate: function(num_routes, num_agencies,agencies){
        routes = [];
        var temp_route = {
            route_id: "",
            agency_id: "",
            route_short_name: "",
            route_type: -1,
        };
        //agencies = module.exports.agencyCreate(num_agencies);
        for (var i = 0; i < num_routes; i++){
            temp_route = {
                route_id: "",
                agency_id: "",
                route_short_name: "",
                route_type: -1,
            };
            temp_route.route_id = "ROUTE" + i;
            var rand_agency = Math.floor(Math.random() * Number(num_agencies));
            temp_route.agency_id = "AGENCY#" + rand_agency;
            temp_route.route_short_name = randomLastName();
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
    //   NOTE :: we will need to be able to handle water vs land and we can use
    //     this API -- https://github.com/simonepri/is-sea  
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
        }
        var randLat;
        var randLon;
        for (var i = 0; i < num_stops; i++){
            temp_stop = {
                stop_id: "",
                stop_name: "",
                stop_lat: 0,
                stop_lon: 0,
            }
            temp_stop.stop_id = "STOP" + i;
            temp_stop.stop_name = randomLastName();
            randLat = Math.floor(Math.random() * 90) - 90;
            randLon = Math.floor(Math.random() * 180) - 180;
            var check = isSea.get(randLat, randLon);
            while(check){
                randLat = Math.floor(Math.random() * 90) - 90;
                randLon = Math.floor(Math.random() * 180) - 180;
                check =isSea.get(randLat, randLon);
            }
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
    //     NOTE :: arrival_time / stop_time
    //          starts a trip at 6:00:00 then, increments it upward by 5 minutes
    //          between stops with a 2 minute difference between the arrival_time
    //          and departure time.
    //          ie (6:00 arrive, 6:02 depart), (6:07 arrive, 6:09 depart)...
    //     NOTE :: user is specifying avg trips per route. This will yield a 
    //          num_trips that will then have to be supplied to this function.
    //     algorithm :: loops through all trips (see note), and for each one,
    //          generates a journey essentially, with its stops (and order of stops),
    //          and times. The sequence will be chosen by randomly selecting two
    //          stops and then seeking to randomly choose stops that occur between
    //          the two. To handle the case of stops being directly next to each
    //          other/near one another, the amount of stops on the trip will be
    //          determined by how quickly these stops can be found (ie do x random
    //          attempts, then stop, so as to continue program execution.)
    //          
    // User Input: 
    //   number of stops
    //
    // Needs to be calculated elsewhere and supplied:
    //   number of trips
    //
    // Attributes: 
    //   trip_id         | static - always "TRIP#"          
    //   arrival_time    | static - incremented in a pattern. see desc above
    //   departure_time  | static - incremented in a pattern. see desc above
    //   stop_id         | 
    //   stop_sequence   | algorithm - see desc above

    stopTimesCreate: function(num_trips, trips){
        var stop_times = [];
        var temp_times = {
            trip_id = "",
            arrival_time = 0,
            departure_time = 0,
            stop_id = "",
            stop_sequence =0,
        }
        var min = 0;
        for (var i = 0; i < num_trips; i++){
            var rand_trip = Math.floor(Math.random() * num_trips);
            var a = new Date();
            a.setHours(6);
            a.setMinutes(min);
            temp_times.trip_id = trips[rand_trip].trip_id;
            temp_times.arrival_time = a;
            a.setMinutes(min + 2);
            temp_times.departure_time = a;
            min = min + 5;
           //Currently stop_sequence is simply incremented up
            temp_times.stop_sequence = temp_times.stop_sequence + 1;
            stop_times.push(temp_times);
       }
       return stop_times;
    },


    // CREATE TRIPS.TXT (GTFS) ================
    // Description: 
    //   generates one line per stop desired by the user
    //   '#' in the examples below will be '1', '2' ... 'n'
    //   each route is assigned a random number of trips 
    //          
    // User Input: 
    //   number of routes
    //   number of trips per route
    //
    // Attributes: 
    //   route_id     | static - always "ROUTE#"          
    //   service_id   | static - always "CALENDAR_ALL" since service days
    //                           do not vary.
    //   trip_id      | static - always "TRIP#"
    //   direction_id | random - either 0 or 1 for direction 
    //                           included because it is referenced in GTFS-ride

    tripsCreate: function(num_routes, num_trips_per_route){
        var trips = [];
        var temp_trip = {
            route_id: "",
            service_id: "",
            trip_id: "",
            direction_id: 0,
        }
        for (var i = 0; i < num_routes; i++){
            for (var j = 0; j < num_trips_per_route; j++){
                temp_trip = {
                    route_id: "",
                    service_id: "",
                    trip_id: "",
                    direction_id: 0,
                }
                temp_trip.route_id = "ROUTE" + i;
                temp_trip.service_id = "CALENDAR_ALL";
                temp_trip.trip_id = "TRIP" + j;
                temp_trip.direction_id = Math.floor(Math.random() * 1);
            }
            trips.push(temp_trip);
        }
        return trips;
   },

      // CREATE RIDE_FEED_INFO.TXT
   // ride_files | TBD user input or require all
   // ride_start_date | user-defined
   // ride_end_date | user-defined
   // gtfs_feed_date | user-defined -- links to feed_info?
   // default_currency_type | static -- USD
   // ride_feed_version | static -- v1

   rideFeedInfoCreate: function(files, start_date, end_date, feed_date){
       var ride_feed_info = {
           ride_files = files,
           ride_start_date = start_date,
           ride_end_date = end_date,
           gtfs_feed_date = feed_date,
           default_currency_type = "USD",
           ride_feed_version = 1,
       } 
      if ( files == null ){
           //defaults to all files if not speciified
            ride_feed_info.ride_files = 6;
       }
       return ride_feed_info;
   },
   

   // CREATE BOARD_ALIGHT.TXT
   // trip_id | static - always "TRIP#"
   // stop_id | static - always "STOP#"
   // stop_sequence | algorithm from stop_times
   // record_use | static - 0  Entry contains complete ridership counts
   // schedule_relationship | user-defined
   // boardings |automated based on stop
   // alightings | automated based on stop
   // currrent_load | load_count / load_type
   // load_count | user-defined
   // load_type | user-defined
   // rack_down | user-defined
   // associated vars are all user defined
   
  // POSSIBLE DECLARATION boardAlightCreate: function(trips, stops, num_trips, num_stops, stop_times,relationship, loadcount, loadtype, rackdown,bikeboardings,bikealightings,rampused,rampboardings,rampalightings,user_source){
    boardAlightCreate: function(trips, stops, num_trips, num_stops, stop_times, user_source){
        var board_alight = [];
        var temp_alight = {
            trip_id = "",
            stop_id = "",
            stop_sequence = 0,
            record_use = 0,
            schedule_relationship = 0,
            boardings = 0,
            alightings = 0,
            current_load = 0,
            load_type = 0,
            rack_down = 0,
            bike_boardings = 0,
            bike_alightings = 0,
            ramp_used = 0,
            ramp_boardings = 0,
            ramp_alightings = 0,
            service_date = 20000101,
            service_arrival_time = 0,
            service_departure_time = 0,
            source = user_source,  
        }

        var min = 0;
        for (var i = 0; i < num_trips; i++){
            var rand_trip = Math.floor(Math.random() * num_trips);
            var a = new Date();
            a.setHours(6);
            a.setMinutes(min);
            temp_alight.trip_id = trips[rand_trip].trip_id;
            temp_alight.arrival_time = a;
            a.setMinutes(min + 2);
            temp_alight.departure_time = a;
            min = min + 5;
            for ( var j = 0; j < stop_times.length; j++){
                if (stop_times[j].trip_id === trips[i].trip_id)
                    temp_alight.stop_sequence = stop_times[j].stop_sequence;
            }
            for (var k = 0; k < num_stops; k++){
                if (stops[k].trip_id == trips[i].trip_id){
                    temp_alight.stop_id = stop[k].stop_id;
                }
            }
            
            //TODO add functionality for optional fields
            board_alight.push(temp_alight);
        }
        return board_alight;
   },

   riderTripCreate: function(num_riders, trips, num_trips, num_stops){
    var rider_trips = [];
    var temp_rider = {
        rider_id = "",
        agency_id = "RIDE",
        trip_id = "",
        boarding_stop_id = "",
        boarding_stop_sequence = 0,
        alighting_stop_id = "",
        alighting_stop_sequence = 0,
        service_date = 20000101,
        boarding_time = 0,
        alighting_time = 0,
        rider_type = 0,
        rider_type_description = "No special type",
        fare_paid = 10,
        transaction_type = 0,
        fare_media = 0,
        accompanying_device = 0,
        transfer_status = 0,
    }
    for (var i = 0; i < num_riders; i++){
        temp_rider.rider_id = "RIDER" + i;
        var rand_stop = Math.floor(Math.random() * num_stops);
        var rand_stop2 = Math.floor(Math.random() * num_stops);
        temp_rider.boarding_stop_id = rand_stop;
        temp_rider.alighting_stop_id = rand_stop2;
        var rand_trip = Math.floor(Math.random() * num_trips);
        var a = new Date();
        a.setHours(6);
        a.setMinutes(min);
        temp_rider.trip_id = trips[rand_trip].trip_id;
        temp_rider.boarding_time = a;
        a.setMinutes(min + 2);
        temp_rider.alighting_time = a;
        min = min + 5;
        temp_rider.boarding_stop_sequence = temp_rider.boarding_stop_sequence + 1;
        temp_rider.alighting_stop_sequence = temp_rider.alighting_stop_sequence + 1;
        rider_trips.push(temp_rider);
    }
    return rider_trips;
  },

    ridershipCreate: function(stops, num_stops, num_routes, routes, board_alight, num_riders, trips, num_trips){
        var ridership = [];
        var temp_ridership = {
            total_boardings = 0,
            total_alightings = 0,
            ridership_start_date = 20000101,
            ridership_end_date = 20000101,
            ridership_start_time = 0,
            ridership_end_time = 0,
            service_id: "CALENDAR_ALL",
            monday: 1,
            tuesday: 1,
            wednesday: 1,
            thursday: 1,
            friday: 1,
            saturday: 1,
            sunday: 1,
            agency_id = "RIDE",
            route_id = "",
            direction_id = "" ,
            trip_id = "",
            stop_id = "",
            }
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
            var rand_route = Math.floor(Math.random() * num_routes);
            var rand_id = routes[rand_route].route_id;
            temp_ridership.route_id = rand_id;
            ridership.push(temp_ridership);
       }
    return ridership;
    },

    tripCapacityCreate: function(trips, num_trips, agencies, num_agencies){
        var trip_capacities = {};
        var temp_trip = {
            agency_id = "",
            trip_id = "",
            service_date = 20000101,
            vehicle_description = "Bus",
            seated_capacity = 75,
            standing_capacity = 30,
            wheelchair_capacity = 5,
            bike_capacity = 15
        }
        for (var i = 0; i < num_trips; i++){
            temp_trip.trip_id = trips[i];
            var rand_agency_index = Math.floor(Math.random() * num_agencies);
            var rand_agency = agencies[rand_agency_index].agency_id;
            temp_trip.agency_id = rand_agency;
            trip_capacities.push(temp_trip);
       }
       return trip_capacities;
  },


    Feed_Creation: function(num_agencies, num_routes, num_stops, num_trips, num_trips_per_route, start_date, end_date,feed_date,user_source, num_riders, files){
        agencies = this.agencyCreate(num_agencies)
        stops = this.stopsCreate(num_stops)
        routes = this.routesCreate(num_routes, num_agencies)
        trips = this.tripsCreate(num_routes, num_trips_per_route)
        stopTimes = this.stopTimesCreate(num_stops, num_trips)
        feedInfo = this.feedInfoCreate(start_date, end_date)
        rideFeedInfo = this.rideFeedInfoCreate(files, start_date, end_date, feed_date)
        boardAlight = this.boardAlightCreate(trips, stops, num_trips, num_stops, stop_times, user_source)
        riderTrip = this.riderTripCreate(num_riders, trips, num_trips, num_stops)
        ridership = this.ridershipCreate(stops, num_stops, num_routes, routes, boardAlight, num_riders, trips, num_trips)
        tripCapacity = this.tripCapacityCreate(trips, num_trips, agencies, num_agencies)



        csvStringify(agencies, {header: true, columns: ["agency_id", "agency_name", "agency_url", "agency_timezone", "agency_lang", "agency_phone", "agency_fare_url", "agency_email"]},
        function(err, out){
            fs.writeFileSync("../feed_creation/agencies.txt", out)
        })
        csvStringify(stops, {header: true, columns: ["stop_id", "stop_code", "stop_name", "stop_desc", "stop_lat", "stop_lon", "zone_id", "stop_url", "location_type", "parent_station", "stop_timezone", "wheelchair_boarding", "level_id", "platform_code"]},
        function(err, out){
            fs.writeFileSync("../feed_creation/stops.txt", out)
        })
        csvStringify(routes, {header: true, columns: ["agency_id","route_id","route_short_name","route_long_name","route_desc","route_type","route_url","route_color","route_text_color","route_sort_order","min_headway_minutes","eligibility_restricted"]},
        function(err, out){
            fs.writeFileSync("../feed_creation/routes.txt", out)
        })
        csvStringify(trips, {header: true, columns: ["route_id", "service_id", "trip_id", "trip_short_name", "trip_headsign", "direction_id", "block_id", "shape_id", "bikes_allowed", "wheelchair_accessible", "trip_type", "drt_max_travel_time", "drt_avg_travel_time", "drt_advance_book_min", "drt_pickup_message", "drt_drop_off_message", "continuous_pickup_message", "continuous_drop_off_message"]},
        function(err, out){
            fs.writeFileSync("../feed_creation/trips.txt", out)
        })
        csvStringify(stopTimes, {header: true, columns: ["trip_id", "arrival_time", "departure_time", "stop_id", "stop_sequence", "stop_headsign", "pickup_type", "drop_off_type", "shape_dist_traveled", "timepoint", "start_service_area_id", "end_service_area_id", "start_service_area_radius", "end_service_area_radius", "continuous_pickup", "continuous_drop_off", "pickup_area_id", "drop_off_area_id", "pickup_service_area_radius", "drop_off_service_area_radius"]},
        function(err, out){
            fs.writeFileSync("../feed_creation/stop_times.txt", out)
        })
        csvStringify(feedInfo, {header: true, columns: ["feed_publisher_url", "feed_publisher_name", "feed_lang", "feed_version", "feed_license", "feed_contact_email", "feed_contact_url", "feed_start_date", "feed_end_date", "feed_id"]},
        function(err, out){
            fs.writeFileSync("../feed_creation/feed_info.txt", out)
        })
        csvStringify(rideFeedInfo, {head: true, columns: ["ride_files","ride_start_date","ride_end_date","gtfs_feed_date","default_currency_type","ride_feed_version"]},
        function(err,out){
            fs.writeFileSync("../feed_creation/ride_feed_info.txt")
        })
        csvStringify(boardAlight, {head: true, columns: ["trip_id","stop_id","stop_sequence","record_use","schedule_relationship","boardings","alightings","current_load","load_type","rack_down","bike_boardings","bike_alightings","ramp_used","ramp_boardings","ramp_alightings","service_date","service_arrival_time","service_departure_time","source"]},
        function(err,out){
            fs.writeFileSync("../feed_creation/board_alight.txt")
        })
        csvStringify(riderTrip, {head: true, columns: ["rider_id","agency_id","trip_id","boarding_stop_id","boarding_stop_sequence","alighting_stop_id","alighting_stop_sequence","service_date","boarding_time","alighting_time","rider_type","rider_type_description","fare_paid","transaction_type","fare_media","accompanying_device","transfer_status"]},
        function(err,out){
            fs.writeFileSync("../feed_creation/rider_trip.txt")
        })
        csvStringify(ridership, {head: true, columns: ["total_boardings","total_alightings","ridership_start_date","ridership_end_date","ridership_start_time","ridership_end_time","service_id","monday","tuesday","wednesday","thursday","friday","saturday","sunday","agency_id","route_id","direction_id","trip_id","stop_id"]},
        function(err,out){
            fs.writeFileSync("../feed_creation/ridership.txt")
        })
        csvStringify(tripCapacity, {head: true, columns: ["agency_id","trip_id","service_date","vehicle_description","seated_capacity","standing_capacity","wheelchair_capacity","bike_capacity"]},
        function(err,out){
            fs.writeFileSync("../feed_creation/trip_capacity.txt")
        })

        //fs.writeFileSync("../feed_creation/agencies.txt", str_agency)
        //fs.writeFileSync("../feed_creation/stops.txt", str_stops)
        //fs.writeFileSync("../feed_creation/routes.txt", str_routes)
    }

};


 

module.exports.Feed_Creation(2, 10, 100, 50, 5, 20200101, 20201231,20200304, 0, 2, 6)