#include <string>
#include <vector>
#include <iostream>
#include <cstdlib>
#include <fstream>

using namespace std;

//all structs contain the information from the file they are created for
struct routes{
    char route_id;
    int route_short_name;
    string route_long_name;
    string route_desc;
    int route_type;
};

struct calendar_dates{
    string service_id;
    int date;
    int exception_type;
};

struct calendar{
    string service_id;
    int monday;
    int tuesday;
    int wednesday;
    int thursday;
    int friday;
    int saturday;
    int sunday;
    int start_date;
    int end_date;
};

struct agency{
    string agency_id;
    string agency_name;
    string agency_url;
    string agency_timezone;
    string agency_phone;
    string agency_lang;
};

struct trips{
    char route_id;
    string service_id;
    string trip_id;
    string trip_headsign;
    int block_id;
};

struct stops{
    string stop_id;
    string stop_name;
    string stop_desc;
    float stop_lat;
    float stop_lon;
    string stop_url;
    string location_type;
    string parent_station;
};

struct stop_times{
    string trip_id;
    string arrival_time;
    string departure_time;
    string stop_id;
    int stop_sequence;
    int pickup_type;
    int drop_off_type;
};
struct fixed_info{

};
//The following structs are specific to GTFS-ride
struct board_alight{
    string trip_id;
    string stop_id;
    int stop_sequence;
    int record_use;
    int boarding;
};

struct trip_capacity{
    string agency_id;
    string trip_id;
    int service_date;
    string vehicle_description;
    int seated_capacity;
    int standing_capacity;
    int wheelchair_capacity;
    int bike_capacity;
};

struct ridership{
    int total_boardings;
    int total_alightings;
    int ridership_start_date;
    int ridership_end_date;
};

struct rider_trip{
    string rider_id;
    string boarding_stop_id;
    int boarding_stop_sequence;
    string alighting_stop_id;
    int alighting_stop_sequence;
};

struct ride_feed_info{
    int ride_files;
    int ride_start_date;
    int ride_end_date;
    int gtfs_feed_date;
    string default_currency_type;
    string ride_feed_version;
};

class GTFS{
    private:
    //we use vectors for all types because a feed can have multiple of any of the options. Vectors allow for easy resizing
            vector<struct routes> r;
            vector<struct calendar_dates> c_dates;
            vector<struct calendar> cal;
            vector<struct agency> ag;
            vector<struct trips> trps;
            vector<struct stops> stps;
            vector<struct stop_times> stop_t;
            vector<struct fixed_info> fixed_info;
    public:
            vector<struct routes> getRoutes(){return r;};
            vector<struct calendar_dates> getDates(){return c_dates;};
            vector<struct calendar> getCalendar(){return cal;};
            vector<struct agency> getAgency(){return ag;};
            vector<struct trips> getTrips(){return trps;};
            vector<struct stops> getStops(){return stps;};
            vector<struct stop_times> getTimes(){return stop_t;};
            void populateRoutes(vector<struct routes>&);
            void populateTrips(vector<struct trips>&);
            void populateCalendarDates(vector<struct calendar_dates>&);
            void populateCalendar(vector<struct calendar>&);
            void populateAgency(vector<struct agency>&);
         
};

class GTFS_ride:public GTFS{
    private:
            
            vector<struct trip_capacity> trip_cap;
            vector<struct ridership> rs;
            vector<struct rider_trip> rt;
            vector<struct ride_feed_info> rfi;
            vector<struct board_alight> ba;
    public:
       //
        
           
};
