//Create a feed representing only the specified period of time or date

module.exports = {

    //will only work with globals?
    //we want to update the overall object instead of creating a new one


    removeFromBoardAlight: function(stop_id){
        for (var i = 0; i < board_alight.length; i++){
            if (board_alight[i].stop_id == stop_id){
                board_alight.splice(i, 1);
            }
        }
    },

    removeFromRidership: function(stop_id){
        for (var i = 0; i < ridership.length; i++){
            if (ridership[i].stop_id == stop_id){
                ridership.splice(i, 1);
            }
        }
    },

    Split:function(arrival_limit, departure_limit){
        //Parameters are bounds for the desired time
        //Ex. Desired arrival at 8:00 and departure at 8:05
        //Bus arrives at 7:59 and departs at 8:05 -- The bus will be removed
        //Bus arrives at 8:01 and departs at 8:04 -- The bus will not be removed
        //Bus arrives at 8:00 and departs at 8:06 -- The bus will be removed
        var [arrival_hour, arrival_minute, arrival_second] = arrival_limit.split(':');
        var [depart_hour, depart_minute, depart_second] = departure_limit.split(':');
        for (var i = 0; i < stop_times.length; i++){
            var [stop_hour, stop_minute, stop_second] = stop_times[i].arrival_time.split(':');
            if (arrival_limit != null){ 
                //error handling -- checks for input              
                if (stop_hour < arrival_hour){
                    //removes a stop if it arrives before the desired arrival hour
                    for (var j = 0; j < stops.length; j++){
                        if (stop_times[i].stop_id == stops[j].stop_id){
                            removeFromBoardAlight(stops[j].stop_id);
                            removeFromRidership(stops[j].stop_id);
                            stops.splice(j, 1);
                        }
                    }
                }
                if (stop_hour == arrival_hour){
                    //checks for same hour but before minute
                    if (stop_minute < arrival_minute){
                        for (var j = 0; j < stops.length; j++){
                            if (stop_times[i].stop_id == stops[j].stop_id){
                                removeFromBoardAlight(stops[j].stop_id);
                                removeFromRidership(stops[j].stop_id);
                                stops.splice(j, 1);
                            }
                        } 
                    }
                }
            }
            if (departure_limit != null){
                //error handling -- checks for input
                if (stop_hour > depart_hour){
                    //removes a stop if it departs after the desired departure hour
                    for (var j = 0; j < stops.length; j++){
                        if (stop_times[i].stop_id == stops[j].stop_id){
                            removeFromBoardAlight(stops[j].stop_id);
                            removeFromRidership(stops[j].stop_id);
                            stops.splice(j, 1);
                        }
                    }
                }
                if (depart_hour == stop_hour){
                    //checks for same departure hour
                    if (stop_minute > depart_minute){
                        //removes a stop if it departs after desired minute in the same hour
                        for (var j = 0; j < stops.length; j++){
                            if (stop_times[i].stop_id == stops[j].stop_id){
                                removeFromBoardAlight(stops[j].stop_id);
                                removeFromRidership(stops[j].stop_id);
                                stops.splice(j, 1);
                            }
                        }
                    }
                }
            }
        }
    }

}