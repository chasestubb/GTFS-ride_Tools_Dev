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

    routesCreate: function(num_routes, num_agencies){
       
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
    //          
    // User Input: 
    //   number of stops 
    //
    // Attributes: 
    //   stop_id    | static - always "STOP#"          
    //   stop_name  | random - chosen with random-lastname npm module.
    //                         potentially not unique, but this is fine.
    //   stop_lat   | random - see description above
    //   stop_lon   | random - see description above

    stopsCreate: function(num_stops){
       
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
       
    },



};


//function Feed_Creation(){
//}