var FILEPATH = "split/";
var FILENAME = "split.zip";
var fs = require('fs');
var csvStringifySync = require('csv-stringify/lib/sync');
var {execSync} = require('child_process')



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
    removeAgencyFromRiderTrip: function(agency_id1){
        for (var i = 0; i < rider_trip.length; i++){
            if (rider_trip[i].agency_id != agency_id1){
                rider_trip.splice(i, 1);
                i = i - 1;
            }
        }
    },
    removeAgencyFromTripCapacity: function(agency_id1){
        for (var i = 0; i < trip_capacity; i++){
            if (trip_capacity[i].agency_id != agency_id1){
                trip_capacity.splice(i,1);
                i = i - 1;
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
    createFiles: function(
            agencies, routes, trips, stops, stop_times, calendar, calendar_dates,
            frequencies, stop_times, feed_info,
            board_alight, trip_capacity, rider_trip, ridership, ride_feed_info){
        var agencyCSV = csvStringifySync(agencies, {header: true, columns: ["agency_id", "agency_name", "agency_url", "agency_timezone", "agency_lang", "agency_phone", "agency_fare_url", "agency_email"]})
        var calendarCSV = csvStringifySync([calendar], {header: true, columns: ["service_id","monday","tuesday","wednesday","thursday","friday","saturday","sunday","start_date","end_date"]})
        var calendarDatesCSV = csvStringifySync(calendar_dates, {header: true, columns: ["service_id","date","exception_type"]})
        var stopsCSV = csvStringifySync(stops, {header: true, columns: ["stop_id", "stop_code", "stop_name", "stop_desc", "stop_lat", "stop_lon", "zone_id", "stop_url", "location_type", "parent_station", "stop_timezone", "wheelchair_boarding", "level_id", "platform_code"]})
        var routesCSV = csvStringifySync(routes, {header: true, columns: ["agency_id","route_id","route_short_name","route_long_name","route_desc","route_type","route_url","route_color","route_text_color","route_sort_order","min_headway_minutes","eligibility_restricted"]})
        var tripsCSV = csvStringifySync(trips, {header: true, columns: ["route_id", "service_id", "trip_id", "trip_short_name", "trip_headsign", "direction_id", "block_id", "shape_id", "bikes_allowed", "wheelchair_accessible", "trip_type", "drt_max_travel_time", "drt_avg_travel_time", "drt_advance_book_min", "drt_pickup_message", "drt_drop_off_message", "continuous_pickup_message", "continuous_drop_off_message"]})
        var stopTimesCSV = csvStringifySync(stop_times, {header: true, columns: ["trip_id", "arrival_time", "departure_time", "stop_id", "stop_sequence", "stop_headsign", "pickup_type", "drop_off_type", "shape_dist_traveled", "timepoint", "start_service_area_id", "end_service_area_id", "start_service_area_radius", "end_service_area_radius", "continuous_pickup", "continuous_drop_off", "pickup_area_id", "drop_off_area_id", "pickup_service_area_radius", "drop_off_service_area_radius"]})
        var feedInfoCSV = csvStringifySync([feed_info], {header: true, columns: ["feed_publisher_url", "feed_publisher_name", "feed_lang", "feed_version", "feed_license", "feed_contact_email", "feed_contact_url", "feed_start_date", "feed_end_date", "feed_id"]})
        var rideFeedInfoCSV = csvStringifySync([ride_feed_info], {header: true, columns: ["ride_files","ride_start_date","ride_end_date","gtfs_feed_date","default_currency_type","ride_feed_version"]})
        var boardAlightCSV = csvStringifySync(board_alight, {header: true, columns: ["trip_id","stop_id","stop_sequence","record_use","schedule_relationship","boardings","alightings","current_load","load_type","rack_down","bike_boardings","bike_alightings","ramp_used","ramp_boardings","ramp_alightings","service_date","service_arrival_time","service_departure_time","source"]})
        var riderTripCSV = csvStringifySync(rider_trip, {header: true, columns: ["rider_id","agency_id","trip_id","boarding_stop_id","boarding_stop_sequence","alighting_stop_id","alighting_stop_sequence","service_date","boarding_time","alighting_time","rider_type","rider_type_description","fare_paid","transaction_type","fare_media","accompanying_device","transfer_status"]})
        var ridershipCSV = csvStringifySync(ridership, {header: true, columns: ["total_boardings","total_alightings","ridership_start_date","ridership_end_date","ridership_start_time","ridership_end_time","service_id","monday","tuesday","wednesday","thursday","friday","saturday","sunday","agency_id","route_id","direction_id","trip_id","stop_id"]})
        var tripCapacityCSV = csvStringifySync(trip_capacity, {header: true, columns: ["agency_id","trip_id","service_date","vehicle_description","seated_capacity","standing_capacity","wheelchair_capacity","bike_capacity"]})


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
        fs.writeFileSync(FILEPATH + "ridership.txt", ridershipCSV)
        fs.writeFileSync(FILEPATH + "trip_capacity.txt", tripCapacityCSV)

    },
//SPLIT OPTIONS 0 = times, 1 = agencies, 2 = dates
    Split: function(
            agencies, routes, trips, stops, stop_times, calendar, calendar_dates,
            frequencies, stop_times, feed_info,
            board_alight, trip_capacity, rider_trip, ridership, ride_feed_info,
            split_options, arrival_limit, departure_limit, desired_agency, start_date_input, end_date_input
        ){
        //Parameters are bounds for the desired time
        //Ex. Desired arrival at 8:00 and departure at 8:05
        //Bus arrives at 7:59 and departs at 8:05 -- The bus will be removed
        //Bus arrives at 8:01 and departs at 8:04 -- The bus will be removed
        //Bus arrives at 8:00 and departs at 8:06 -- The bus will be removed
        if (split_options == 0){
            var hour, minute, second
            if (arrival_limit != null){
                [hour, minute, second] = arrival_limit.split(':');
            }
            var arrival_hour = Number(hour);
            var arrival_minute = Number(minute);
            var dh, dm, depart_second
            if (departure_limit != null){
                [dh, dm, depart_second] = departure_limit.split(':');
            }
            var depart_hour = Number(dh);
            var depart_minute = Number(dm);
            for (var i = 0; i < stop_times.length; i++){
                console.log("i = " + i)
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
                        stop_times.splice(i, 1);
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
                if (ridership != null){
                    for ( j = 0; j < stops.length; j++){
                        this.removeFromRidership(stops[j].stop_id);
                    }
                }
                if (board_alight != null){
                    for ( i = 0; i < stop_times.length; i++){
                        this.removeFromBoardAlight(stop_times[i].stop_id, stop_times[i].trip_id);
                    }
                }
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
            if (rider_trip != null)
                this.removeAgencyFromRiderTrip(desired_agency);
            if (trip_capacity != null)
                this.removeAgencyFromTripCapacity(desired_agency);
            for (var j = 0; j < routes.length; j++){
                this.removeFromTrips(routes[j].route_id);
            }
            for (j = 0; j < trips.length; j++){
                this.removeFromStopTimes(trips[j].trip_id);
            }
            this.removeFromStops();
        }
        else if (split_options == 2){
            //DATE FILTER
            if (board_alight != null)
                this.removeDateFromBoardAlight(start_date_input, end_date_input);
            if (ridership != null)
                this.removeDateFromRidership(start_date_input, end_date_input);
            if (trip_capacity != null)
                this.removeFromTripCapacity(start_date_input, end_date_input);
            if (rider_trip != null)
                this.removeFromRiderTrip(start_date_input, end_date_input);
            this.removeFromCalendar(start_date_input, end_date_input);
            this.removeFromCalendarDates(start_date_input, end_date_input);

        }
        //CREATING FILES
        this.createFiles(
            agencies, routes, trips, stops, stop_times, calendar, calendar_dates,
            frequencies, stop_times, feed_info,
            board_alight, trip_capacity, rider_trip, ridership, ride_feed_info);
        // ZIP ALL FILES =========================
        var current_dir = process.cwd(); // save current working dir
        process.chdir(FILEPATH) // change dir
        console.log("current dir: " + process.cwd())
        try {
            //zip.zipSync("*.txt", FILENAME); // zip the files
            var out = execSync('zip -r -y ' + FILENAME + ' *.txt')
            console.log(out)
        } catch (e){
            console.log("ZIP")
            console.log(e)
        }
        
        process.chdir(current_dir); // undo change dir

        // RETURN THE ZIP FILENAME
        return (FILEPATH + FILENAME); 
    } 
}


//module.exports.Split(2, "6:00:00", "6:00:00", "TEST", 20100401, 20100405);
//module.exports.Split(0, "5:10:00", "5:15:00", 0);

