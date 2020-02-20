module.exports = {
//These functions will report anything that is not in BOTH feeds (symmetric difference)
//example
//ar1 = [a,b];
//ar2 = [b, d];
//all functions will return [a,d]

    checkAgencies:function (feed1_agencies, feed2_agencies){
        //returns agencies that are not in both feeds
        var diff = [];
        for (var i = 0; i < feed1_agencies.length; i++){
            if(feed2_agencies.indexOf(feed1_agencies[i]) === -1){
                diff.push(feed1_agencies[i].agency_name);
            }
        }
         for ( i = 0; i < feed2_agencies.length; i++){
             if(feed1_agencies.indexOf(feed2_agencies[i]) === -1)
                diff.push(feed2_agencies[i].agency_name);
         }
         return diff;
    },

    checkFeedType: function(ride_feed_info1, ride_feed_info2){
        //returns true if the feed types are the same
        if (!ride_feed_info1 == null){ //both ride feeds
            if (!ride_feed_info2 == null)
                return true;
        }
        else if (ride_feed_info1 == null){ //both standard gtfs feeds
            if (ride_feed_info2 == null)
                return true;
        }
        else
            return false;  
    },
    checkRoutes: function(feed1_routes, feed2_routes){
        var diff = [];
        for (var i = 0; i < feed1_routes.length; i++){
            if(feed2_routes.indexOf(feed1_routes[i]) === -1){
                diff.push(feed1_routes[i].route_long_name);
            }
        }
         for ( i = 0; i < feed2_routes.length; i++){
             if(feed1_routes.indexOf(feed2_routes[i]) === -1)
                diff.push(feed2_routes[i].route_long_name);
         }
         return diff;
    },
    checkTrips: function(feed1_trips, feed2_trips){
        var diff = [];
        for (var i = 0; i < feed1_trips.length; i++){
            if(feed2_trips.indexOf(feed1_trips[i]) === -1){
                diff.push(feed1_trips[i].trip_short_name);
            }
        }
         for ( i = 0; i < feed2_trips.length; i++){
             if(feed1_trips.indexOf(feed2_trips[i]) === -1)
                diff.push(feed2_trips[i].trip_short_name);
         }
         return diff;
    },
    checkStops: function(feed1_stops, feed2_stops){
        var diff = [];
        for (var i = 0; i < feed1_stops.length; i++){
            if(feed2_stops.indexOf(feed1_stops[i]) === -1){
                diff.push(feed1_stops[i].stop_name);
            }
        }
         for ( i = 0; i < feed2_stops.length; i++){
             if(feed1_stops.indexOf(feed2_stops[i]) === -1)
                diff.push(feed2_stops[i].stop_name);
         }
         return diff;
    },

    checkDates: function(feed1_dates, feed2_dates){
        var diff = [];
        for (var i = 0; i < feed1_dates.length; i++){
            if(feed2_dates.indexOf(feed1_dates[i]) === -1){
                diff.push(feed1_dates[i]);
            }
        }
         for ( i = 0; i < feed2_dates.length; i++){
             if(feed1_dates.indexOf(feed2_dates[i]) === -1)
                diff.push(feed2_dates[i]);
         }
         return diff;
    },

    checkAlight: function(feed1_board_alight, feed2_board_alight){
        var diff = [];
        for (var i = 0; i < feed1_board_alight.length; i++){
            if(feed2_board_alight.indexOf(feed1_board_alight[i]) === -1){
                diff.push(feed1_board_alight[i]);
            }
        }
         for ( i = 0; i < feed2_board_alight.length; i++){
             if(feed1_board_alight.indexOf(feed2_board_alight[i]) === -1)
                diff.push(feed2_board_alight[i]);
         }
         return diff;
    },

    checkRiderTrip: function(feed1_ridertrip, feed2_ridertrip){
        var diff = [];
        for (var i = 0; i < feed1_ridertrip.length; i++){
            if(feed2_ridertrip.indexOf(feed1_ridertrip[i]) === -1){
                diff.push(feed1_ridertrip[i]);
            }
        }
         for ( i = 0; i < feed2_ridertrip.length; i++){
             if(feed1_ridertrip.indexOf(feed2_ridertrip[i]) === -1)
                diff.push(feed2_ridertrip[i]);
         }
         return diff;
    },
    
    checkRidership: function(feed1_ridership, feed2_ridership){
        var diff = [];
        for (var i = 0; i < feed1_ridership.length; i++){
            if(feed2_ridership.indexOf(feed1_ridership[i]) === -1){
                diff.push(feed1_ridership[i]);
            }
        }
         for ( i = 0; i < feed2_ridership.length; i++){
             if(feed1_ridership.indexOf(feed2_ridership[i]) === -1)
                diff.push(feed2_ridership[i]);
         }
         return diff;
    },
    
    checkTripCapacity: function(feed1_trip_capacity, feed2_trip_capacity){
        var diff = [];
        for (var i = 0; i < feed1_trip_capacity.length; i++){
            if(feed2_trip_capacity.indexOf(feed1_trip_capacity[i]) === -1){
                diff.push(feed1_trip_capacity[i]);
            }
        }
         for ( i = 0; i < feed2_trip_capacity.length; i++){
             if(feed1_trip_capacity.indexOf(feed2_trip_capacity[i]) === -1)
                diff.push(feed2_trip_capacity[i]);
         }
         return diff;
    },
    

    
}