#include "gtfs.h"

using namespace std;

void GTFS_ride::populateTripCapacity(vector<struct trip_capacity> &t){
    string line;
    string temp; //for storing results from file and converting type
    struct trip_capacitytempr;
    int i = 0;
    int num_lines = 0;
    ifstream file("trip_capacity.txt");
    getline(file, line); //skips the first line (this describes format of file)
    while(getline(file, line)){
        //this loop will give us the number of lines in the file, which indicates how many elements we need to add to the vector
        ++num_lines;
    }
    file.clear();
    file.seekg(0, file.beg); //resets to beginning of file
    getline(file, line); //skip first line again
    for (int j = 0; j < num_lines; j++){
        //for each of the lines, we have a new agency
        while(getline(file, temp, ',')){
        //content is separated by commas
            if (i == 0)
               tempr.agency_id = temp;
        
            else if (i == 1)
               tempr.trip_id = temp;
        
            else if (i == 2)
               tempr.service_date = stoi(temp);
        
            else if ( i == 3)
               tempr.vehicle_description = temp;
            
            else if (i == 4)
               tempr.seated_capacity = stoi(temp);
            else if (i == 5)
               tempr.standing_capacity = stoi(temp);
            else if ( i == 6)
               tempr.wheelchair_capacity = stoi(temp);
            else if ( i == 7)
               tempr.bike_capacity = stoi(temp);
         
            else
            {
                break;
            }        
        i++;
        }
        t.push_back(tempt);
    }
}

void GTFS_ride::populateRidership(vector<ridership> &r){
    string line;
    string temp; //for storing results from file and converting type
    struct ridership tempr;
    int i = 0;
    int num_lines = 0;
    ifstream file("ridership.txt");
    getline(file, line); //skips the first line (this describes format of file)
    while(getline(file, line)){
        //this loop will give us the number of lines in the file, which indicates how many elements we need to add to the vector
        ++num_lines;
    }
    file.clear();
    file.seekg(0, file.beg); //resets to beginning of file
    getline(file, line); //skip first line again
    for (int j = 0; j < num_lines; j++){
        //for each of the lines, we have a new agency
        while(getline(file, temp, ',')){
        //content is separated by commas
            if (i == 0)
               tempr.total_boardings = stoi(temp);
        
            else if (i == 1)
               tempr.total_alightings = stoi(temp);
        
            else if (i == 2)
               tempr.ridership_start_date = stoi(temp);
        
            else if ( i == 3)
               tempr.ridership_end_date = stoi(temp);
            else
            {
                break;
            }        
        i++;
        }
        r.push_back(tempr);
    }
}

void GTFS_ride::populateRiderTrip(vector<rider_trip> &t){
    string line;
    string temp; //for storing results from file and converting type
    struct rider_trip tempt;
    int i = 0;
    int num_lines = 0;
    ifstream file("rider_trip.txt");
    getline(file, line); //skips the first line (this describes format of file)
    while(getline(file, line)){
        //this loop will give us the number of lines in the file, which indicates how many elements we need to add to the vector
        ++num_lines;
    }
    file.clear();
    file.seekg(0, file.beg); //resets to beginning of file
    getline(file, line); //skip first line again
    for (int j = 0; j < num_lines; j++){
        //for each of the lines, we have a new agency
        while(getline(file, temp, ',')){
        //content is separated by commas
            if (i == 0)
                tempt.rider_id = temp;
        
            else if (i == 1)
                tempt.boarding_stop_id = temp;
        
            else if (i == 2)
                tempt.boarding_stop_sequence = stoi(temp);
        
            else if ( i == 3)
                tempt.alighting_stop_id = temp;
            
            else if (i == 4)
                tempt.alighting_stop_sequence = stoi(temp);
         
            else
            {
                break;
            }        
        i++;
        }
        t.push_back(tempt);
    }
}