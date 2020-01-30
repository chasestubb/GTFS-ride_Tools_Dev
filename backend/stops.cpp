#include "gtfs.h"

using namespace std;

void GTFS::populateStopTimes(vector<stop_times> &s){
    string line;
    string temp; //for storing results from file and converting type
    int i = 0;
    struct stop_times temps;
    int num_lines = 0;
    ifstream file("stop_times.txt");
    getline(file, line); //skips the first line (this describes format of file)
    while(getline(file, line)){
        //this loop will give us the number of lines in the file, which indicates how many elements we need to add to the vector
        ++num_lines;
    }

    file.clear();
    file.seekg(0, file.beg); //resets to beginning of file
    getline(file, line); //skip first line again
    for (int j = 0; j < num_lines; j++){

        while(getline(file, temp, ',')){
            //content is separated by commas
            if (i == 0){
                temps.trip_id = temp;
            }
            else if (i == 1)
                temps.arrival_time = temp;

            else if (i == 2)
                temps.departure_time = temp;
                
            else if ( i == 3)
                temps.stop_id = temp;

            else if (i == 4)
                temps.stop_sequence = stoi(temp);
            else if ( i == 5)
                temps.pickup_type = stoi(temp);
            else if ( i == 6)
                temps.drop_off_type = stoi(temp);
            
            else
            {
                break;
            }

            i++;
        }
        s.push_back(temps);
    }
}
void GTFS::populateStops(vector<stops> &s){
    string line;
    string temp; //for storing results from file and converting type
    int i = 0;
    struct stops temps;
    int num_lines = 0;
    ifstream file("stops.txt");
    getline(file, line); //skips the first line (this describes format of file)
    while(getline(file, line)){
        //this loop will give us the number of lines in the file, which indicates how many elements we need to add to the vector
        ++num_lines;
    }

    file.clear();
    file.seekg(0, file.beg); //resets to beginning of file
    getline(file, line); //skip first line again
    for (int j = 0; j < num_lines; j++){

        while(getline(file, temp, ',')){
            //content is separated by commas
            if (i == 0){
                temps.stop_id = temp;
            }
            else if (i == 1)
                temps.stop_code = temp;

            else if (i == 2)
                temps.stop_name = temp;
                
            else if ( i == 3)
                temps.stop_desc = temp;

            else if (i == 4)
                temps.stop_lat = stof(temp);
            else if ( i == 5)
                temps.stop_lon = stof(temp);
            else if ( i == 6)
                temps.zone_id = temp;
            else if ( i == 7)
                temps.stop_url == temp;
            else if ( i == 8)
                temps.location_type = temp;
            else if ( i == 9)
                temps.parent_station = temp;
            else
            {
                break;
            }

            i++;
        }
        s.push_back(temps);
    }
}