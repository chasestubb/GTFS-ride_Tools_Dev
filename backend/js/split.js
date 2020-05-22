//Create a feed representing only the specified period of time or date
var csv_parse = require('csv-parse/lib/sync') // converting CSV text input into arrays or objects
var fs = require('fs');
var routes = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/routes.txt"), {columns: true}) 
var agencies = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/agency.txt"), {columns: true})
var trips = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/trips.txt"), {columns: true})
var stops = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/stops.txt"), {columns: true})
var stop_times = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/stop_times.txt"), {columns: true})
var calendar = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/calendar.txt"), {columns: true})
var calendar_dates = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/calendar_dates.txt"), {columns: true})
var frequencies = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/frequencies.txt"), {columns: true})
var feed_info = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/feed_info.txt"), {columns: true})
var board_alight = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/board_alight.txt"), {columns: true})
var trip_capacity = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/trip_capacity.txt"), {columns: true})
var rider_trip = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/rider_trip.txt"), {columns: true})
var ridership = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/ridership.txt"), {columns: true})
var ride_feed_info = csv_parse(fs.readFileSync("../testFeeds/Specification_example_feed/ride_feed_info.txt"), {columns: true})

module.exports = {

    //will only work with globals?
    //we want to update the overall object instead of creating a new one

//TIME REMOVALS
    removeFromBoardAlight: function(stop_id1, trip_id1){
        //Removes stop it does not have the proper corresponding trip
        for (var i = 0; i < board_alight.length; i++){
            if (board_alight[i].stop_id == stop_id1 && board_alight[i].trip_id == trip_id1){
                continue;
            }
            else{
                board_alight.splice(i, 1)
                i = i - 1;
            }
        }
    },

    removeFromRidership: function(stop_id1, trip_id1){
        for (var i = 0; i < ridership.length; i++){
            if (ridership[i].stop_id == stop_id1 && ridership[i].trip_id == trip_id1){
                continue;
            }
            else{
                ridership.splice(i,1);
                i = i - 1;
            }
        }
    },
//AGENCY REMOVALS
    removeFromRoutes: function(agency_id1){
        for (var i = 0; i < routes.length; i++){
            if (routes[i].agency_id != agency_id1){
                routes.splice(i, 1);
                i = i - 1;
            }
        }
    },
    removeFromTrips: function(route_id1){
        for (var i = 0; i < trips.length; i++){
            if (trips[i].route_id != route_id1){
                trips.splice(i, 1);
                i = i - 1;
            }
        }
    },
    removeFromStopTimes: function(trip_id1){
        for (var i = 0; i < stop_times.length; i++){
            if (stop_times[i].trip_id != trip_id1){
                stop_times.splice(i, 1);
                i = i - 1;
            }
        }
    },
    removeFromStops: function(){
        for (j = 0; j < stops.length;){
            if (stop_times.length == stops.length){
                console.log("done");
                break;
            }
            for (i = 0; i < stop_times.length; i++){
                var found = 0;
                console.log("checking stop_times " + stop_times[i].stop_id + " and stop " + stops[j].stop_id);
                if (stop_times[i].stop_id == stops[j].stop_id){
                    found = 1;
                    break;                      
                }
            }
            if (found == 0){
                stops.splice(j, 1)
            }
            else if (found == 1){
                j = j + 1;
            }
        }
    },
//DATE REMOVALS
    removeDateFromBoardAlight: function(service_date_start, service_date_end){
        for (var i = 0; i < board_alight.length; i++){
            if (board_alight[i].service_date < service_date_start){
                board_alight.splice(i, 1);
                i = i - 1;
            }
            if (board_alight[i].service_date > service_date_end){
                board_alight.splice(i, 1);
                i = i - 1;
            }
        }
    },
    removeFromTripCapacity: function(service_date_start, service_date_end){
        for (var i = 0; i < trip_capacity.length; i++){
            if (trip_capacity[i].service_date < service_date_start){
                trip_capacity.splice(i, 1);
                i = i - 1;
            }
            if (trip_capacity[i].service_date > service_date_end){
                trip_capacity.splice(i, 1);
                i = i - 1;
            }
        }
    },
    removeFromRiderTrip: function(service_date_start, service_date_end){
        for (var i = 0; i < rider_trip.length; i++){
            if (rider_trip[i].service_date < service_date_start){
                rider_trip.splice(i, 1);
                i = i - 1;
            }
            if (rider_trip[i].service_date > service_date_end){
                rider_trip.splice(i, 1);
                i = i - 1;
            }
        }
    },
    removeDateFromRidership: function(service_date_start, service_date_end){
        for (var i = 0; i < ridership.length; i++){
            if (ridership[i].ridership_start_date < service_date_start || ridership[i].ridership_end_date > service_date_end){
                ridership.splice(i, 1);
                i = i - 1;
            }
        }
    },
    removeFromCalendarDates: function(service_date_start, service_date_end){
        for (var i = 0; i < calendar_dates.length; i++){
            if (calendar_dates[i].date < service_date_start){
                calendar_dates.splice(i, 1);
                i = i - 1
            }
            if (calendar_dates[i].date > service_date_end){
                calendar_dates.splice(i,1);
                i = i - 1;
            }
        }
    },
    removeFromCalendar: function(service_date_start, service_date_end){
        for (var i = 0; i < calendar.length; i++){
            if (calendar[i].start_date < service_date_start || calendar[i].end_date > service_date_end){
                calendar.splice(i,1);
                i = i - 1;
            }
        }
    },
//SPLIT OPTIONS 0 = times, 1 = agencies, 2 = dates
    Split: function(split_options, arrival_limit, departure_limit, desired_agency, start_date_input, end_date_input){
        //Parameters are bounds for the desired time
        //Ex. Desired arrival at 8:00 and departure at 8:05
        //Bus arrives at 7:59 and departs at 8:05 -- The bus will be removed
        //Bus arrives at 8:01 and departs at 8:04 -- The bus will be removed
        //Bus arrives at 8:00 and departs at 8:06 -- The bus will be removed
        if (split_options == 0){
            var [hour, minute, second] = arrival_limit.split(':');
            var arrival_hour = Number(hour);
            var arrival_minute = Number(minute);
            var [dh, dm, depart_second] = departure_limit.split(':');
            var depart_hour = Number(dh);
            var depart_minute = Number(dm);
            for (var i = 0; i < stop_times.length; i++){
                var [sh, sm, stop_second] = stop_times[i].arrival_time.split(':');
                var [sh2, sm2, stop_second] = stop_times[i].departure_time.split(':');
                var stop_arrival_hour = Number(sh)
                var stop_arrival_minute= Number(sm);
                var stop_depart_hour = Number(sh2);
                var stop_depart_minute = Number(sm2);
                console.log("length of stop_times " + stop_times.length);
                console.log("checking " + stop_times[i].arrival_time);
                if (arrival_limit != null){ 
                    //error handling -- checks for input              
                    if (stop_arrival_hour < arrival_hour){
                        console.log("stop hour" + stop_arrival_hour + " < arrival hour" + arrival_hour);
                        i = i - 1;
                        continue;
                    }
                    if (stop_arrival_hour == arrival_hour){
                        console.log("stop hour" + stop_arrival_hour + " = arrival hour" + arrival_hour);
                        //checks for same hour but after minute
                        if (stop_arrival_minute > arrival_minute){
                            console.log("stop minute" + stop_arrival_minute + " > arrival minute" + arrival_minute);
                            stop_times.splice(i, 1);
                            i = i - 1;
                            continue;
                        }
                    }
                }
                if (departure_limit != null){
                    //error handling -- checks for input
                    if (stop_depart_hour > depart_hour){
                        console.log("stop hour" + stop_depart_hour + " > departure hour" + depart_hour);
                        //removes a stop if it departs after the desired departure hour
                        stop_times.splice(i, 1);
                        i = i - 1;
                        continue;
                    }
                    if (depart_hour == stop_depart_hour){
                        console.log("stop hour" + stop_depart_hour + " = depart hour" + depart_hour);
                        //checks for same departure hour
                        if (stop_depart_minute > depart_minute){
                            console.log("stop min " + stop_depart_minute + "> depart min" + depart_minute);
                            stop_times.splice(i, 1);
                            i = i - 1;
                            continue;
                        }
                    }
                }
            }
            console.log(stop_times.length)
            if (stop_times.length == 0){
                //Edge case for removing everything
                stops = [];
                ridership = [];
                board_alight = [];

            }
            else{
                for (j = 0; j < stops.length;){
                    if (stop_times.length == stops.length){
                        console.log("done");
                        break;
                    }
                    for (i = 0; i < stop_times.length; i++){
                        var found = 0;
                        console.log("checking stop_times " + stop_times[i].stop_id + " and stop " + stops[j].stop_id);
                        if (stop_times[i].stop_id == stops[j].stop_id){
                            found = 1;
                            break;                      
                        }
                    }
                    if (found == 0){
                        stops.splice(j, 1)
                    }
                    else if (found == 1){
                        j = j + 1;
                    }
                }
                for ( j = 0; j < stops.length; j++){
                    this.removeFromRidership(stops[j].stop_id);
                }
                for ( i = 0; i < stop_times.length; i++){
                    this.removeFromBoardAlight(stop_times[i].stop_id, stop_times[i].trip_id);
                }
   /*             console.log("stop times after");
                console.log(stop_times);
                console.log("stops after");
                console.log(stops);
                console.log("ridership after");
                console.log(ridership);
                console.log("board alight after");
                console.log(board_alight); */
            }
        }
        else if (split_options == 1){
            //AGENCY FILTER
            for (var i = 0; i < agencies.length; i++){
                if (agencies[i].agency_id != desired_agency){
                    agencies.splice(i, 1);
                    i = i - 1;
                }
            }
            this.removeFromRoutes(desired_agency);
            for (var j = 0; j < routes.length; j++){
                this.removeFromTrips(routes[j].route_id);
            }
            for (j = 0; j < trips.length; j++){
                this.removeFromStopTimes(trips[j].trip_id);
            }
            this.removeFromStops();
     /*       console.log("agencies");
            console.log(agencies);
            console.log("routes");
            console.log(routes);
            console.log("trips");
            console.log(trips);
            console.log("stop times");
            console.log(stop_times);
            console.log("stops");
            console.log(stops);*/
        }
        else if (split_options == 2){
            //DATE FILTER
            this.removeDateFromBoardAlight(start_date_input, end_date_input);
            this.removeDateFromRidership(start_date_input, end_date_input);
            this.removeFromTripCapacity(start_date_input, end_date_input);
            this.removeFromRiderTrip(start_date_input, end_date_input);
            this.removeFromCalendar(start_date_input, end_date_input);
            this.removeFromCalendarDates(start_date_input, end_date_input);
    /*        console.log("board alight");
            console.log(board_alight);
            console.log("ridership");
            console.log(ridership);
            console.log("trip capacity");
            console.log(trip_capacity);
            console.log("rider trip");
            console.log(rider_trip);
            console.log("calendar");
            console.log(calendar);
            console.log("calendar_dates");
            console.log(calendar_dates); */

        }
    }
}


//module.exports.Split(2, "6:00:00", "6:00:00", "TEST", 20100401, 20100405);
//module.exports.Split(0, "5:10:00", "5:15:00", 0);

