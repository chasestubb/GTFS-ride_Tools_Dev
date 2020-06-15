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

/* ENUM VALUES

	user_source:
	see GTFS-ride documentation on board_alight.txt -> source

	calendar_type:
	0 = calendar.txt only
	1 = calendar_dates.txt only
	2 = both (default)

	operation_days:
	0 = weekends only
	1 = weekdays only
	2 = weekdays + sat
	3 = weekdays + sun
	4 = every day

	files:
	0 = board_alight
	1 = rider_trip
	2 = ridership
	3 = board_alight and rider_trip
	4 = board_alight and ridership
	5 = rider_trip and ridership
	6 = board_alight, rider_trip, and ridership
	this tool can only support 2, 4, or 6

	aggr_level:
	0 = stop
	1 = trip
	2 = route
	3 = agency
	4 = feed

*/

// time limits for functions (in milliseconds)
const STOP_TIMES_TIME_LIMIT = 30000
const BOARD_ALIGHT_TIME_LIMIT = 45000
const BOARD_ALIGHT_MEM_LIMIT = 1000000000
const RIDERSHIP_TOTAL_TIME_LIMIT = 90000
const RIDERSHIP_AGENCY_TIME_LIMIT = 45000
const RIDERSHIP_ROUTE_TIME_LIMIT = 30000
const RIDERSHIP_TRIP_TIME_LIMIT = 30000
const RIDERSHIP_STOP_TIME_LIMIT = 30000

var randomLastName = require('random-lastname');
var randordinal_converter = require('number-to-words'); // ex ordinal_converter.toOrdinal(21); => “21st”
var csvStringify = require('csv-stringify');
var csv_stringify = csvStringify({delimiter: ','});
var csvStringifySync = require('csv-stringify/lib/sync');
var fs = require('fs');
var zip = require('cross-zip');
var {execSync} = require('child_process')

var Info = require("./info")

//var filepath = "feed_creation/";
//var filename = "fc.zip";
//var FILEPATH = "./"

var log_output = ""

// GET RANDOM INT INCLUSIVE ================
function getRandomIntInclusive (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

// PAD NUMBER SIZE TO TWO DIGITS
function pad(num) {
    var s = num + "";
    while (s.length < 2) s = "0" + s;
    return s;
}

// prints str to the console and adds the same str to the global var log_output
function log(str){
    log_output += (str + "\n")
    console.log(str)
}

// prints "Generating <str>...", use at the start of a function
function log_start(str){
    log("Generating " + str + "...")
}

// prints "<str> done [in <time> ms]"", use at the end of a function
function log_end(str, time){
    if (time < 0){
        log(str + " completed.")
    } else {
        log(str + " completed in " + time + " milliseconds.")
    }
}

// prints "<str> stopped after <time> ms, length is <length>", use when a function is stopped due to time limits
function log_stopped(str, time, length){
    log(str + " stopped after " + time + " milliseconds, resulting output contains " + length + " lines.")
}

// prints "<str> not generated because the user chose not to"
function log_none(str){
    log("Cancelled -- the user has selected to not use " + str)
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
function getAgencyOfTrip(trip_index, trips, routes){
    for (var r = 0; r < routes.length; r++){
        if (routes[r].route_id == trips[trip_index].route_id){
            return routes[r].agency_id
        }
    }
    return null
}

// increment date by 1 day
// date is a number formatted as a GTFS date (20200317 = Mar 17, 2020)
function tomorrow(date){
    var year = Math.floor(date / 10000)
    var month = Math.floor((date % 10000) / 100);
    var day = date % 100;
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
                return ++date
            }
        case 4:
        case 6:
        case 9:
        case 11:
            if (day == 30){
                return ((year * 10000) + ((month+1) * 100) + 1)
            } else {
                return ++date
            }
        case 2:
            // if leap year (if year is divisible by 4 and not 100, or year is divisible by 400)
            if (((year % 4) == 0 && (year % 100) != 0) || (year % 400) == 0){
                if (day == 29){
                    return ((year * 10000) + 301)
                } else {
                    return ++date
                }
            } else { // if not leap year
                if (day == 28){
                    return ((year * 10000) + 301)
                } else {
                    return ++date
                }
            }
        case 12:
            if (day == 31){
                return (((year+1) * 10000) + 101)
            } else {
                return ++date
            }
        default:
            return ++date;
    }
}

// converts GTFS-formatted date (20200317) to JS Date object
// input type is number, not string
function gtfs_to_js_date(date){
    var year = Math.floor(date / 10000)
    var month = Math.floor((date % 10000) / 100) - 1;
    var day = date % 100;
    return new Date(year, month, day)
}

// converts JS Date object to GTFS-formatted date (20200317)
// returns a number
function js_to_gtfs_date(date){
    var year = date.getFullYear()
    var month = date.getMonth()
    var day = date.getDate()
    var gtfs_date = year * 10000
    gtfs_date += (month + 1) * 100 // JS date objects have months from 0 to 11
    gtfs_date += day
    return gtfs_date
}


/* check if date is a service day
   returns the same day if it is, returns the next service day if it is not

   date is a number formatted as a GTFS date (20200317 = Mar 17, 2020)
   see the "ENUM VALUES" section above for the possible values of operation_days
   holidays: if true then no service on Christmas day and New Year's day, if false then service as usual on those days

   example:
   if the service does not run on weekends (operation_days = 1) and May 15 2020 is Friday,
   then next_service_day(20200515, 1) will return 20200518
*/
function skip_day(date, operation_days, holidays){
    // skip if holiday
    if (holidays && ((date % 10000 == 1225) || (date % 10000 == 0101))){
        date = tomorrow(date)
    }

    // JS defines days as 0=Sunday, 1=Monday, ..., 6=Saturday
    switch(operation_days){
        case 0: // weekends only
            while (gtfs_to_js_date(date).getDay() != 6 && gtfs_to_js_date(date).getDay() != 0){ // skip the date if not Saturday or Sunday
                date = tomorrow(date)
            }
            break
        case 1: // weekdays only
            while (gtfs_to_js_date(date).getDay() == 6 || gtfs_to_js_date(date).getDay() == 0){ // skip the date if Saturday or Sunday
                date = tomorrow(date)
            }
            break
        case 2: // weekdays + Sat
            if (gtfs_to_js_date(date).getDay() == 0){ // skip the date if Sunday
                date = tomorrow(date)
            }
            break
        case 3: // weekdays + Sun
            if (gtfs_to_js_date(date).getDay() == 6){ // skip the date if Saturday
                date = tomorrow(date)
            }
            break
        //case 4: // every day -- no need for day check

    }
    return date
}

/* increment date by 1 service day

   date is a number formatted as a GTFS date (20200317 = Mar 17, 2020)
   see the "ENUM VALUES" section above for the possible values of operation_days
   holidays: if true then no service on Christmas day and New Year's day, if false then service as usual on those days

   example:
   if the service does not run on weekends (operation_days = 1) and May 15 2020 is Friday,
   then next_service_day(20200515, 1) will return 20200518
*/
function next_service_day(date, operation_days, holidays){
    var next_day = tomorrow(date)
    next_day = skip_day(next_day, operation_days, holidays)
    return next_day
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
        log_start("agencies")
        var start = Date.now()

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
        log_end("agencies", Date.now() - start)
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

    calendarCreate: function(operation_days, start_date_input, end_date_input, calendar_type){
        log_start("calendar")
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
        // if (operation_days == 0){
        //     calendar.service_id = "WEEKEND_CALENDAR";
        //     calendar.monday = 0;
        //     calendar.tuesday = 0;
        //     calendar.wednesday = 0;
        //     calendar.thursday = 0;
        //     calendar.friday = 0;
        //     calendar.saturday = 1;
        //     calendar.sunday = 1;
        //     calendar.start_date = start_date_input;
        //     calendar.end_date = end_date_input;
        // }
        if (calendar_type == 1){
            //if the user selected not to use calendar.txt
            log_none("calendar.txt")
            return;
        }
        else{
            if (operation_days == 0){
                log_end("calendar (weekend)", -1)
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
                log_end("calendar (weekday)", -1)
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
                log_end("calendar (weekday + sat)", -1)
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
                log_end("calendar (weekday + sun)", -1)
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
                log_end("calendar (all days)", -1)
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

    calendarDatesCreate: function(calendar, operation_days, start_date_input, end_date_input, calendar_type){
        log_start("calendar_dates")
        var start = Date.now()
        if (calendar_type == 0){
            //do not use calendar_dates
            log_none("calendar_dates.txt")
            return;
        }
        else if (calendar_type == 2){
            startYearNum = Math.floor(calendar.start_date / 10000); // number
            endYearNum = Math.floor(calendar.end_date / 10000); // number

            //Use both calendar_dates.txt and calendar.txt
            var calendar_dates = [];
            for(var i = startYearNum; i <= endYearNum; i++){
                // NEW YEARS
                var newyear_date = {
                    service_id: calendar.service_id,
                    date: i + "0101",
                    exception_type: 2,
                };
                calendar_dates.push(newyear_date);

                // CHRISTMAS
                var christmas_date = {
                    service_id: calendar.service_id,
                    date: i + "1225",
                    exception_type: 2,
                };
                calendar_dates.push(christmas_date);
            }

            log_end("calendar_dates", Date.now() - start)
            return calendar_dates;
        }
        else{
            //Handle usage of only calendar_dates.txt
            //First we get every day between the feed start and end date
            var start_date_str = String(start_date_input);
            var start_year = start_date_str.substr(0,4);
            var start_month = start_date_str.substr(4,2);
            //month starts at 0 -- Jan is Month 0
            var month1 = start_month - 1;
            var start_day = start_date_str.substr(6,2);
            var start_date = new Date(start_year, month1, start_day);

            var end_date_str = String(end_date_input);
            var end_year = end_date_str.substr(0,4);
            var end_month = end_date_str.substr(4,2);
            var month2 = end_month - 1;
            var end_day = end_date_str.substr(6,2);
            var end_date = new Date(end_year, month2, end_day);
            var calendar_dates = [];
            for(var dates=[],dt=new Date(start_date); dt<=end_date; dt.setDate(dt.getDate()+1)){
            dates.push(new Date(dt));
        }
            var temp_date = {
                service_id: "", 
                date: "",
                exception_type: 0
            }
            if (operation_days == 1){
                console.log("weekdays");
                //get all weekdays
                for (var i = 0; i < dates.length; i++){
                    if (dates[i].getDay() ==  6|| dates[i].getDay() == 0){
                            dates.splice(i, 1);
                            i = i - 1;
                    }
                }
                for (var i = 0; i < dates.length; i++){
                    temp_date = {
                        service_id: "", 
                        date: "",
                        exception_type: 1,
                    }
                    temp_date.service_id = "WEEKDAY_CALENDAR";
                    //converts back to our date format
                    var month = dates[i].getUTCMonth() + 1
                    var day = dates[i].getUTCDate();
                    var year = dates[i].getUTCFullYear();

                    // Check for month and day < 10
                    var month0, day0;
                    if (month < 10)
                        month0 = "0" + String(month);
                    else
                        month0 = month;
                    if (day < 10)
                        day0 = "0" + String(day);
                    else
                        day0 = day;

                    temp_date.date = year + "" + month0 + day0;
                    temp_date.exception_type = 1;
                    calendar_dates.push(temp_date);
                }
            }
            if (operation_days == 0){
                console.log("weekends");
                //only weekends
                for (var i = 0; i < dates.length; i++){
                    if (dates[i].getDay() > 0 && dates[i].getDay() < 6){
                        dates.splice(i,1);
                        i = i - 1;
                    }
                }
                for (var i = 0; i < dates.length; i++){
                    temp_date = {
                        service_id: "", 
                        date: "",
                        exception_type: 1,
                    }
                    //converts back to our date format
                    var month = dates[i].getUTCMonth() + 1
                    var day = dates[i].getUTCDate();
                    var year = dates[i].getUTCFullYear();
                    // Check for month and day < 10
                    var month0, day0;
                    if (month < 10)
                        month0 = "0" + String(month);
                    else
                        month0 = month;
                    if (day < 10)
                        day0 = "0" + String(day);
                    else
                        day0 = day;

                    temp_date.date = year + "" + month0 + day0;
                    temp_date.service_id = "WEEKEND_CALENDAR";
                    temp_date.exception_type = 1;
                    calendar_dates.push(temp_date);
                }
            }
            if (operation_days == 2){
                console.log("saturdays");
                //No saturdays
                for (var i = 0; i < dates.length; i++){
                    if (dates[i].getDay() == 6){
                        dates.splice(i,1);
                        i = i - 1;
                    }
                }
                for (var i = 0; i < dates.length; i++){
                    temp_date = {
                        service_id: "", 
                        date: "",
                        exception_type: 1,
                    }
                    //converts back to our date format
                    var month = dates[i].getUTCMonth() + 1
                    var day = dates[i].getUTCDate();
                    var year = dates[i].getUTCFullYear();
                    // Check for month and day < 10
                    var month0, day0;
                    if (month < 10)
                        month0 = "0" + String(month);
                    else
                        month0 = month;
                    if (day < 10)
                        day0 = "0" + String(day);
                    else
                        day0 = day;

                    temp_date.date = year + "" + month0 + day0;
                    temp_date.service_id = "SATURDAY_CALENDAR";
                    temp_date.exception_type = 1;
                    calendar_dates.push(temp_date);
                }
            }
            if (operation_days == 3){
                console.log("sundays");
                //No sundays
                for (var i = 0; i < dates.length; i++){

                    if (dates[i].getDay() == 0){
                        dates.splice(i,1);
                        i = i - 1;
                    }
                }
                for (var i = 0; i < dates.length; i++){
                    temp_date = {
                        service_id: "", 
                        date: "",
                        exception_type: 1,
                    }
                    //converts back to our date format
                    var month = dates[i].getUTCMonth() + 1
                    var day = dates[i].getUTCDate();
                    var year = dates[i].getUTCFullYear();
                    // Check for month and day < 10
                    var month0, day0;
                    if (month < 10)
                        month0 = "0" + String(month);
                    else
                        month0 = month;
                    if (day < 10)
                        day0 = "0" + String(day);
                    else
                        day0 = day;

                    temp_date.date = year + "" + month0 + day0;
                    temp_date.service_id = "SUNDAY_CALENDAR";
                    temp_date.exception_type = 1;
                    calendar_dates.push(temp_date);
                }
            }
            if (operation_days == 4){
                console.log("all");
                //Keep all days except holidays
                for (var i = 0; i < dates.length; i++){
                    if (dates[i].isHoliday)
                        dates.splice(i,1);
                }
                for (var i = 0; i < dates.length; i++){
                    temp_date = {
                        service_id: "", 
                        date: "",
                        exception_type: 1,
                    }
                    //converts back to our date format
                    var month = dates[i].getUTCMonth() + 1
                    var day = dates[i].getUTCDate();
                    var year = dates[i].getUTCFullYear();

                    // Check for month and day < 10
                    var month0, day0;
                    if (month < 10)
                        month0 = "0" + String(month);
                    else
                        month0 = month;
                    if (day < 10)
                        day0 = "0" + String(day);
                    else
                        day0 = day;

                    temp_date.date = year + "" + month0 + day0;
                    temp_date.service_id = "ALL_CALENDAR";
                    temp_date.exception_type = 1;
                    calendar_dates.push(temp_date);
                }
            }
   /*         for (var j = 0; j < calendar_dates.length; j++){
                console.log("printing dates");
                console.log(calendar_dates[j]);
            }*/
            console.log("Number of days in this calendar: " + calendar_dates.length)
            log_end("calendar_dates", Date.now() - start)
            return calendar_dates;
        }
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
        log_start("feed_info")
        log_end("feed_info", -1)
        return {
            feed_publisher_name: "Test Transit",
            feed_publisher_url: "https://github.com/ODOT-PTS/GTFS-ride/",
            feed_lang: "en",
            feed_start_date: feed_start_date1,
            feed_end_date: feed_end_date1,
            feed_version: "1.0.0",
        };
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
        log_start("routes")
        var start = Date.now()
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
        log_end("routes", Date.now() - start)
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
        log_start("stops")
        var start = Date.now()
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
            randLon = parseFloat(randLonRaw.toFixed(6)); // rount to six decimal points

            temp_stop.stop_lat = randLat;
            temp_stop.stop_lon = randLon;
            stops.push(temp_stop);
        }
        log_end("stops", Date.now() - start)
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
        log_start("stop_times")
        var start = Date.now()
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

                    if (Date.now() - start >= 45000){
                        log_stopped("stop_times", 45000, stop_times.length)
                        return stop_times
                    }
                }

                count = count + 1; // account for a new trip
            }
        }
        //console.log("Stop times " + stop_times.length)
        log_end("stop_times", Date.now() - start)
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
        log_start("trips")
        var start = Date.now()
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
        log_end("trips", Date.now() - start)
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
        log_start("ride_feed_info")
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
        log_end("ride_feed_info", -1)
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
    boardAlightCreate: function(trips, stops, num_trips, num_stops, num_routes, stop_times, user_source, rider_trip, start_date, end_date, operation_days){
        log_start("board_alight")
        var start = Date.now()
        var start_op

        var board_alight = [];

        var d = start_date
        log("    Reading stop_times and copying its contents for every service day...")
        start_op = Date.now()
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
                if (process.memoryUsage().rss >= BOARD_ALIGHT_MEM_LIMIT){ // if total memory usage for this node process is at least 512 MiB
                    log("No more rows added to board_alight due to memory limit. Last row on board_alight is row " + board_alight.length + " (trip " + stop_times[st].trip_id + " at stop " + stop_times[st].stop_id + " on " + d + ").")

                    // break out of 2 levels of loops at once
                    d = end_date + 1 // the while loop
                    break // the for loop
                }
                if (Date.now() - start_op >= BOARD_ALIGHT_TIME_LIMIT){
                    log("No more rows added to board_alight due to time limit. Last row on board_alight is row " + board_alight.length + " (trip " + stop_times[st].trip_id + " at stop " + stop_times[st].stop_id + " on " + d + ").")
                    
                    // break out of 2 levels of loops at once
                    d = end_date + 1 // the while loop
                    break // the for loop
                }
            }
            // increment the date
            //d = tomorrow(d)
            d = next_service_day(d, operation_days, true)
        }
        log("    board_alight array generated in " + (Date.now() - start_op) + " milliseconds with no riderships")

        // sort the rider_trip array by service_date
        /* this WILL change the final array and the exported file
           to undo this, sort the rider_trip array by rider_id,
           but tools should not fail due to the ordering of the rows
        */
        log("    Sorting rider_trip by date...")
        start_op = Date.now()
        rider_trip.sort(function(a, b){
            return a.service_date - b.service_date
        })
        log("    rider_trip sorted in " + (Date.now() - start_op) + " milliseconds.")

        log("    Filling board_alight with ridership data...")
        start_op = Date.now()
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
            if (boarding_index < board_alight.length){
                board_alight[boarding_index].boardings++
            }
            if (alighting_index < board_alight.length){
                board_alight[alighting_index].alightings++
            }
            
        }
        log("    board_alight filled with ridership data in " + (Date.now() - start_op) +" milliseconds.")

        start_op = Date.now()
        log("    Calculating vehicle load...")

        // do another run-through of the board_alight array to set the load_count field
        var max_load = 60 // the maximum load, used for current_load
        // special case for index 0 where there is no row/element before it
        board_alight[0].load_count = board_alight[0].boardings - board_alight[0].alightings // first load = boardings - alightings (no checks to the previous row)
        board_alight[0].current_load = Math.round(board_alight[0].load_count * 100 / max_load)
        for (var b = 1; b < board_alight.length; b++){
            if (board_alight[b].trip_id == board_alight[b-1].trip_id){ // if this row is still part of the same trip as the last one
                board_alight[b].load_count = board_alight[b-1].load_count + board_alight[b].boardings - board_alight[b].alightings // add the previous load count to the current calculation
            } else { // if this is a part of a new trip
                board_alight[b].load_count = board_alight[b].boardings - board_alight[b].alightings // just count the number of boardings minus the number of alightings
            }
            board_alight[b].current_load = Math.round(board_alight[b].load_count * 100 / max_load) // current_load is a percentage of the load (how full the vehicle is)
        }
        log("    Vehicle load calculated in " + (Date.now() - start_op) + " milliseconds.")
        
        log_end("board_alight", Date.now() - start)
        return board_alight;
    },

    riderTripCreate: function(min_riders, max_riders, trips, num_trips, num_stops, routes, num_routes, stop_times, num_agencies, aggr_level, start_date, end_date, operation_days){
        log_start("rider_trip")
        var start = Date.now()
        var num_riders
        var rider_trips = [];
        var num_stops_per_route = num_stops / num_routes;
        var date = start_date

        switch (aggr_level){
            case 0: // stop
                num_riders = getRandomIntInclusive(min_riders, max_riders) * num_stops
                break;
            case 1: // trip
                num_riders = getRandomIntInclusive(min_riders, max_riders) * num_trips
                break;
            case 2: // route
                num_riders = getRandomIntInclusive(min_riders, max_riders) * num_routes
                break;
            case 3: // agency
                num_riders = getRandomIntInclusive(min_riders, max_riders) * num_agencies
                break;
            default: // feed
                num_riders = getRandomIntInclusive(min_riders, max_riders)
                break;
        }

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
            date = next_service_day(date, operation_days, true)
            if (date > end_date){
                date = start_date
            }
        }

        log_end("rider_trip", Date.now() - start)
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

    ridershipCreate: function(operation_days, board_alight, agency, stops, trips, routes, start_date, end_date){
        log_start("ridership")
        var start = Date.now()
        var start_op
        var ridership = [];
        var weekday = Number(operation_days !== 0) // converted to number so that true is 1 and false is 0 (instead of "true" and "false")
        var saturday = Number(operation_days === 0 || operation_days === 2 || operation_days === 4)
        var sunday = Number(operation_days === 0 || operation_days === 3 || operation_days === 4)
        var service_pattern;
        switch(operation_days){
            case 0:
                service_pattern = "WEEKEND_CALENDAR"
                break
            case 1:
                service_pattern = "WEEKDAY_CALENDAR"
                break
            case 2:
                service_pattern = "SATURDAY_CALENDAR"
                break
            case 3:
                service_pattern = "SUNDAY_CALENDAR"
                break
            case 4:
                service_pattern = "ALL_CALENDAR"
                break
            default:
                service_pattern = "BASE_CALENDAR"
                break
        }

        // stop-level ridership
        log("    Calculating ridership per stop...")
        start_op = Date.now()
        for (var s = 0; s < stops.length; s++){
            if (Date.now() - start_op <= RIDERSHIP_STOP_TIME_LIMIT){
                ridership.push({
                    total_boardings : Info.countStopRiders(board_alight, stops[s]),
                    total_alightings : Info.countStopAlightings(board_alight, stops[s]),
                    ridership_start_date : start_date,
                    ridership_end_date : end_date,
                    ridership_start_time : "",
                    ridership_end_time : "",
                    service_id: service_pattern,
                    monday: weekday,
                    tuesday: weekday,
                    wednesday: weekday,
                    thursday: weekday,
                    friday: weekday,
                    saturday: saturday,
                    sunday: sunday,
                    agency_id : "",
                    route_id : "",
                    direction_id : "",
                    trip_id : "",
                    stop_id : stops[s].stop_id,
                })
            } else {
                log_stopped("    Ridership per stop calculation", RIDERSHIP_STOP_TIME_LIMIT, ridership.length)
                break
            }
        }
        log_end("    Ridership per stop calculation", Date.now() - start_op)

        // trip-level ridership
        log("    Calculating ridership per trip...")
        start_op = Date.now()
        if (Date.now() - start < RIDERSHIP_TOTAL_TIME_LIMIT){
            for (var t = 0; t < trips.length; t++){
                if (Date.now() - start_op <= RIDERSHIP_TRIP_TIME_LIMIT){
                    var trip_ridership = Info.countTripRiders(board_alight, trips[t]);
                    ridership.push({
                        total_boardings : trip_ridership,
                        total_alightings : trip_ridership,
                        ridership_start_date : start_date,
                        ridership_end_date : end_date,
                        ridership_start_time : "",
                        ridership_end_time : "",
                        service_id: service_pattern,
                        monday: weekday,
                        tuesday: weekday,
                        wednesday: weekday,
                        thursday: weekday,
                        friday: weekday,
                        saturday: saturday,
                        sunday: sunday,
                        agency_id : "",
                        route_id : "",
                        direction_id : trips[t].direction_id,
                        trip_id : trips[t].trip_id,
                        stop_id : "",
                    })
                } else {
                    log_stopped("    Ridership per trip calculation", RIDERSHIP_TRIP_TIME_LIMIT, ridership.length)
                    break
                }
            }
            log_end("    Ridership per trip calculation", Date.now() - start_op)
        } else {
            log("    Not enough time to calculate ridership by route")
        }
        

        // route-level ridership
        log("    Calculating ridership per route...")
        start_op = Date.now()
        if (Date.now() - start < RIDERSHIP_TOTAL_TIME_LIMIT){
            for (var r = 0; r < routes.length; r++){
                if (Date.now() - start_op <= RIDERSHIP_ROUTE_TIME_LIMIT){
                    var route_ridership = Info.countRouteRiders(routes[r], board_alight, trips);
                    ridership.push({
                        total_boardings : route_ridership,
                        total_alightings : route_ridership,
                        ridership_start_date : start_date,
                        ridership_end_date : end_date,
                        ridership_start_time : "",
                        ridership_end_time : "",
                        service_id: service_pattern,
                        monday: weekday,
                        tuesday: weekday,
                        wednesday: weekday,
                        thursday: weekday,
                        friday: weekday,
                        saturday: saturday,
                        sunday: sunday,
                        agency_id : "",
                        route_id : routes[r].route_id,
                        direction_id : "" ,
                        trip_id : "",
                        stop_id : "",
                    })
                } else {
                    log_stopped("    Ridership per route calculation", RIDERSHIP_ROUTE_TIME_LIMIT, ridership.length)
                    break
                }
            }
            log_end("    Ridership per route calculation", Date.now() - start_op)
        } else {
            log("    Not enough time to calculate ridership by route")
        }
        

        // agency-level ridership
        log("    Calculating ridership per agency...")
        start_op = Date.now()
        if (Date.now() - start < RIDERSHIP_TOTAL_TIME_LIMIT){
            for (var a = 0; a < agency.length; a++){
                if (Date.now() - start_op <= RIDERSHIP_AGENCY_TIME_LIMIT){
                    var agency_ridership = Info.countAgencyRiders(agency[a], board_alight, trips, routes);
                    ridership.push({
                        total_boardings : agency_ridership,
                        total_alightings : agency_ridership,
                        ridership_start_date : start_date,
                        ridership_end_date : end_date,
                        ridership_start_time : "",
                        ridership_end_time : "",
                        service_id: service_pattern,
                        monday: weekday,
                        tuesday: weekday,
                        wednesday: weekday,
                        thursday: weekday,
                        friday: weekday,
                        saturday: saturday,
                        sunday: sunday,
                        agency_id : agency[a].agency_id,
                        route_id : "",
                        direction_id : "" ,
                        trip_id : "",
                        stop_id : "",
                    })
                } else {
                    log_stopped("    Ridership per agency calculation", RIDERSHIP_AGENCY_TIME_LIMIT, ridership.length)
                    break
                }
            }
            log_end("    Ridership per agency calculation", Date.now() - start_op)
        } else {
            log("    Not enough time to calculate ridership by agency")
        }
        
        
        log_end("ridership", Date.now() - start)
        return ridership;
    },

    tripCapacityCreate: function(trips, num_trips, agencies, num_agencies, routes){
        log_start("trip_capacity")
        //var start = Date.now()
        var trip_capacities = [];
  
        for (var i = 0; i < num_trips; i++){
            trip_capacities.push({
                agency_id : getAgencyOfTrip(i, trips, routes),
                trip_id : trips[i].trip_id,
                service_date : "",
                vehicle_description : "Bus",
                seated_capacity : 35,
                standing_capacity : 25,
                wheelchair_capacity : 2,
                bike_capacity : 2,
            });
        }
        log_end("trip_capacity", -1)
        return trip_capacities;
    },


    // the main function to generate the test feed
    // this function may take a long time, please call it asynchronously if possible
    Feed_Creation: function(
        num_agencies, num_routes, num_stops, num_trips, num_trips_per_route,
        start_date, end_date, feed_date, operation_days,
        user_source, min_riders, max_riders, aggr_level,
        calendar_type, files, filepath, filename){

        // ridership should start on the next service day if feed does not start on a service day
        // example case: service is only available on weekdays, but feed starts on Saturday
        start_service_date = skip_day(start_date, operation_days, true)

        var agencies = this.agencyCreate(num_agencies);
        var calendar = this.calendarCreate(operation_days, start_date, end_date, calendar_type);
        var calendar_dates = this.calendarDatesCreate(calendar, operation_days, start_date, end_date, calendar_type);
        var stops = this.stopsCreate(num_stops);
        var routes = this.routesCreate(num_routes, num_agencies);
        var trips = this.tripsCreate(num_routes, num_trips_per_route);
        var stopTimes = this.stopTimesCreate(num_trips, trips, num_stops, num_routes, num_trips_per_route);
        var feedInfo = this.feedInfoCreate(start_date, end_date);
        var rideFeedInfo = this.rideFeedInfoCreate(files, start_date, end_date);

        var riderTrip = this.riderTripCreate(min_riders, max_riders, trips, num_trips, num_stops, routes, num_routes, stopTimes, num_agencies, aggr_level, start_service_date, end_date, operation_days);
        var boardAlight = this.boardAlightCreate(trips, stops, num_trips, num_stops, num_routes, stopTimes, user_source, riderTrip, start_service_date, end_date, operation_days);
        var ridership = this.ridershipCreate(operation_days, boardAlight, agencies, stops, trips, routes, start_service_date, end_date);
        var tripCapacity = this.tripCapacityCreate(trips, num_trips, agencies, num_agencies, routes);

        // CSV STRINGIFY =========================

        log("Stringifying data... (converting internal objects to CSV text)")
        var start = Date.now()

        var agencyCSV = csvStringifySync(agencies, {header: true, columns: ["agency_id", "agency_name", "agency_url", "agency_timezone", "agency_lang", "agency_phone", "agency_fare_url", "agency_email"]})
        
        if(calendar_type != 1)
            var calendarCSV = csvStringifySync([calendar], {header: true, columns: ["service_id","monday","tuesday","wednesday","thursday","friday","saturday","sunday","start_date","end_date"]})
        if(calendar_type != 0)
            var calendarDatesCSV = csvStringifySync(calendar_dates, {header: true, columns: ["service_id","date","exception_type"]})

        var stopsCSV = csvStringifySync(stops, {header: true, columns: ["stop_id", "stop_code", "stop_name", "stop_desc", "stop_lat", "stop_lon", "zone_id", "stop_url", "location_type", "parent_station", "stop_timezone", "wheelchair_boarding", "level_id", "platform_code"]})
        var routesCSV = csvStringifySync(routes, {header: true, columns: ["agency_id","route_id","route_short_name","route_long_name","route_desc","route_type","route_url","route_color","route_text_color","route_sort_order","min_headway_minutes","eligibility_restricted"]})
        var tripsCSV = csvStringifySync(trips, {header: true, columns: ["route_id", "service_id", "trip_id", "trip_short_name", "trip_headsign", "direction_id", "block_id", "shape_id", "bikes_allowed", "wheelchair_accessible", "trip_type", "drt_max_travel_time", "drt_avg_travel_time", "drt_advance_book_min", "drt_pickup_message", "drt_drop_off_message", "continuous_pickup_message", "continuous_drop_off_message"]})
        var stopTimesCSV = csvStringifySync(stopTimes, {header: true, columns: ["trip_id", "arrival_time", "departure_time", "stop_id", "stop_sequence", "stop_headsign", "pickup_type", "drop_off_type", "shape_dist_traveled", "timepoint", "start_service_area_id", "end_service_area_id", "start_service_area_radius", "end_service_area_radius", "continuous_pickup", "continuous_drop_off", "pickup_area_id", "drop_off_area_id", "pickup_service_area_radius", "drop_off_service_area_radius"]})
        var feedInfoCSV = csvStringifySync([feedInfo], {header: true, columns: ["feed_publisher_url", "feed_publisher_name", "feed_lang", "feed_version", "feed_license", "feed_contact_email", "feed_contact_url", "feed_start_date", "feed_end_date", "feed_id"]})
        var rideFeedInfoCSV = csvStringifySync([rideFeedInfo], {header: true, columns: ["ride_files","ride_start_date","ride_end_date","gtfs_feed_date","default_currency_type","ride_feed_version"]})
        if(files == 4 || files == 6)
            var boardAlightCSV = csvStringifySync(boardAlight, {header: true, columns: ["trip_id","stop_id","stop_sequence","record_use","schedule_relationship","boardings","alightings","current_load","load_count","load_type","rack_down","bike_boardings","bike_alightings","ramp_used","ramp_boardings","ramp_alightings","service_date","service_arrival_time","service_departure_time","source"]})
        if(files == 6)
            var riderTripCSV = csvStringifySync(riderTrip, {header: true, columns: ["rider_id","agency_id","trip_id","boarding_stop_id","boarding_stop_sequence","alighting_stop_id","alighting_stop_sequence","service_date","boarding_time","alighting_time","rider_type","rider_type_description","fare_paid","transaction_type","fare_media","accompanying_device","transfer_status"]})
        var ridershipCSV = csvStringifySync(ridership, {header: true, columns: ["total_boardings","total_alightings","ridership_start_date","ridership_end_date","ridership_start_time","ridership_end_time","service_id","monday","tuesday","wednesday","thursday","friday","saturday","sunday","agency_id","route_id","direction_id","trip_id","stop_id"]})
        var tripCapacityCSV = csvStringifySync(tripCapacity, {header: true, columns: ["agency_id","trip_id","service_date","vehicle_description","seated_capacity","standing_capacity","wheelchair_capacity","bike_capacity"]})
        
        log_end("Stringify", Date.now() - start)

        //console.log(process.cwd())

        // DELETE PREVIOUS FILES
        try {
            var out = execSync('rm ./feed_creation/*') // delete all files in feed_creation dir
            log("File deletion output:")
            log(out.toString())
        } catch (e){ // rm will throw an error if the dir is empty, this statement will catch the error (preventing the server from breaking)
            log("RM error:")
            log(e)
        }


        // WRITE THE FILES =========================
        log("Writing text to files...")
        start = Date.now()
        fs.writeFileSync(filepath + "agency.txt", agencyCSV);
        fs.writeFileSync(filepath + "stops.txt", stopsCSV);
        fs.writeFileSync(filepath + "routes.txt", routesCSV);
        fs.writeFileSync(filepath + "trips.txt", tripsCSV);
        fs.writeFileSync(filepath + "stop_times.txt", stopTimesCSV);
        fs.writeFileSync(filepath + "feed_info.txt", feedInfoCSV);

        if(calendar_type != 1)
            fs.writeFileSync(filepath + "calendar.txt", calendarCSV);
        if(calendar_type != 0)
            fs.writeFileSync(filepath + "calendar_dates.txt", calendarDatesCSV);

        fs.writeFileSync(filepath + "ride_feed_info.txt", rideFeedInfoCSV);
        if(files == 4 || files == 6)
            fs.writeFileSync(filepath + "board_alight.txt", boardAlightCSV)
        if(files == 6)
            fs.writeFileSync(filepath + "rider_trip.txt", riderTripCSV)
        fs.writeFileSync(filepath + "ridership.txt", ridershipCSV) // always generated
        fs.writeFileSync(filepath + "trip_capacity.txt", tripCapacityCSV)
        log_end("Writing files", Date.now() - start)

        // ZIP ALL FILES =========================
        var current_dir = process.cwd(); // save current working dir
        process.chdir(filepath); // change dir
        try {
            var out = execSync('zip -r -y ' + filename + ' *.txt') // zip the files
            log("File compression (zipping) output:")
            log(out.toString())
        } catch (e){
            log("ZIP error:")
            log(e)
        }
        process.chdir(current_dir); // undo change dir

        // RETURN THE LOG OUTPUT
        return (log_output);
    },

    // this function generates GTFS-ride files from a GTFS feed
    // it will only generate the GTFS-ride files and won't generate GTFS files not part of GTFS-ride
    // this function may take a long time, please call it asynchronously if possible
    Feed_Creation_from_GTFS: function(
        agencies, calendar, calendar_dates, stops, routes, trips, stop_times, feed_info,
        feed_date, operation_days, user_source, min_riders, max_riders, aggr_level, files){

        var start_date = feed_info[0].feed_start_date
        var end_date = feed_info[0].feed_end_date
        var stopTimes = stop_times
        if (!feed_date){
            feed_date = start_date
        }

        var num_agencies = agencies.length
        var num_routes = routes.length
        var num_stops = stops.length
        var num_trips = trips.length
       
        var rideFeedInfo = this.rideFeedInfoCreate(files, start_date, end_date);
        var riderTrip = this.riderTripCreate(min_riders, max_riders, trips, num_trips, num_stops, routes, num_routes, stopTimes, aggr_level, start_date, end_date, operation_days);
        var boardAlight = this.boardAlightCreate(trips, stops, num_trips, num_stops, num_routes, stopTimes, user_source, riderTrip, start_date, end_date, operation_days);
        var ridership = this.ridershipCreate(operation_days, boardAlight, agencies, stops, trips, routes, start_date, end_date);
        var tripCapacity = this.tripCapacityCreate(trips, num_trips, agencies, num_agencies, routes);

        // CSV STRINGIFY =========================
        var agencyCSV = csvStringifySync(agencies, {header: true, columns: ["agency_id", "agency_name", "agency_url", "agency_timezone", "agency_lang", "agency_phone", "agency_fare_url", "agency_email"]})
        
        if(calendar_type != 1)
            var calendarCSV = csvStringifySync([calendar], {header: true, columns: ["service_id","monday","tuesday","wednesday","thursday","friday","saturday","sunday","start_date","end_date"]})
        if(calendar_type != 0)
            var calendarDatesCSV = csvStringifySync(calendar_dates, {header: true, columns: ["service_id","date","exception_type"]})

        var stopsCSV = csvStringifySync(stops, {header: true, columns: ["stop_id", "stop_code", "stop_name", "stop_desc", "stop_lat", "stop_lon", "zone_id", "stop_url", "location_type", "parent_station", "stop_timezone", "wheelchair_boarding", "level_id", "platform_code"]})
        var routesCSV = csvStringifySync(routes, {header: true, columns: ["agency_id","route_id","route_short_name","route_long_name","route_desc","route_type","route_url","route_color","route_text_color","route_sort_order","min_headway_minutes","eligibility_restricted"]})
        var tripsCSV = csvStringifySync(trips, {header: true, columns: ["route_id", "service_id", "trip_id", "trip_short_name", "trip_headsign", "direction_id", "block_id", "shape_id", "bikes_allowed", "wheelchair_accessible", "trip_type", "drt_max_travel_time", "drt_avg_travel_time", "drt_advance_book_min", "drt_pickup_message", "drt_drop_off_message", "continuous_pickup_message", "continuous_drop_off_message"]})
        var stopTimesCSV = csvStringifySync(stopTimes, {header: true, columns: ["trip_id", "arrival_time", "departure_time", "stop_id", "stop_sequence", "stop_headsign", "pickup_type", "drop_off_type", "shape_dist_traveled", "timepoint", "start_service_area_id", "end_service_area_id", "start_service_area_radius", "end_service_area_radius", "continuous_pickup", "continuous_drop_off", "pickup_area_id", "drop_off_area_id", "pickup_service_area_radius", "drop_off_service_area_radius"]})
        var feedInfoCSV = csvStringifySync([feedInfo], {header: true, columns: ["feed_publisher_url", "feed_publisher_name", "feed_lang", "feed_version", "feed_license", "feed_contact_email", "feed_contact_url", "feed_start_date", "feed_end_date", "feed_id"]})
        
        var rideFeedInfoCSV = csvStringifySync([rideFeedInfo], {header: true, columns: ["ride_files","ride_start_date","ride_end_date","gtfs_feed_date","default_currency_type","ride_feed_version"]})
        if(files == 4 || files == 6)
            var boardAlightCSV = csvStringifySync(boardAlight, {header: true, columns: ["trip_id","stop_id","stop_sequence","record_use","schedule_relationship","boardings","alightings","current_load","load_count","load_type","rack_down","bike_boardings","bike_alightings","ramp_used","ramp_boardings","ramp_alightings","service_date","service_arrival_time","service_departure_time","source"]})
        if(files == 6)
            var riderTripCSV = csvStringifySync(riderTrip, {header: true, columns: ["rider_id","agency_id","trip_id","boarding_stop_id","boarding_stop_sequence","alighting_stop_id","alighting_stop_sequence","service_date","boarding_time","alighting_time","rider_type","rider_type_description","fare_paid","transaction_type","fare_media","accompanying_device","transfer_status"]})
        var ridershipCSV = csvStringifySync(ridership, {header: true, columns: ["total_boardings","total_alightings","ridership_start_date","ridership_end_date","ridership_start_time","ridership_end_time","service_id","monday","tuesday","wednesday","thursday","friday","saturday","sunday","agency_id","route_id","direction_id","trip_id","stop_id"]})
        var tripCapacityCSV = csvStringifySync(tripCapacity, {header: true, columns: ["agency_id","trip_id","service_date","vehicle_description","seated_capacity","standing_capacity","wheelchair_capacity","bike_capacity"]})


        //console.log(process.cwd())

        // DELETE PREVIOUS FILES
        try {
            var out = execSync('rm ./feed_creation/*') // delete all files in feed_creation dir
            console.log("File deletion output:")
            console.log(out.toString())
        } catch (e){ // rm will throw an error if the dir is empty, this statement will catch the error (preventing the server from breaking)
            console.log("RM")
            console.log(e)
        }


        // WRITE THE FILES =========================
        fs.writeFileSync(filepath + "agency.txt", agencyCSV);
        fs.writeFileSync(filepath + "stops.txt", stopsCSV);
        fs.writeFileSync(filepath + "routes.txt", routesCSV);
        fs.writeFileSync(filepath + "trips.txt", tripsCSV);
        fs.writeFileSync(filepath + "stop_times.txt", stopTimesCSV);
        fs.writeFileSync(filepath + "feed_info.txt", feedInfoCSV);

        if(calendar_type != 1)
            fs.writeFileSync(filepath + "calendar.txt", calendarCSV);
        if(calendar_type != 0)
            fs.writeFileSync(filepath + "calendar_dates.txt", calendarDatesCSV);

        fs.writeFileSync(filepath + "ride_feed_info.txt", rideFeedInfoCSV);
        if(files == 4 || files == 6)
            fs.writeFileSync(filepath + "board_alight.txt", boardAlightCSV)
        if(files == 6)
            fs.writeFileSync(filepath + "rider_trip.txt", riderTripCSV)
        fs.writeFileSync(filepath + "ridership.txt", ridershipCSV) // always generated
        fs.writeFileSync(filepath + "trip_capacity.txt", tripCapacityCSV)

        // ZIP ALL FILES =========================
        var current_dir = process.cwd(); // save current working dir
        process.chdir(filepath); // change dir
        try {
            var out = execSync('zip -r -y fc.zip *.txt') // zip the files
            console.log("File compression (zipping) output:")
            console.log(out.toString())
        } catch (e){
            console.log("ZIP")
            console.log(e)
        }
        process.chdir(current_dir); // undo change dir

        // RETURN THE ZIP FILENAME
        return (filepath + filename); 
    } 
}; 


// test function
//Feed_Creation: function(num_agencies, num_routes, num_stops, num_trips, num_trips_per_route, start_date, end_date, feed_date, user_source, min_riders, max_riders, files, operation_days, calendar_type)
//calendar_dates = this.calendarDatesCreate(calendar, operation_days, start_date, end_date, calendar_type);

//module.exports.Feed_Creation(1, 5, 100, 10, 3, 20200501, 20200531, 20200531, 6, 6, 6, 6, 0, 1);
//module.exports.calendarDatesCreate()
//console.log(module.exports.tripsCreate(10, 5));

