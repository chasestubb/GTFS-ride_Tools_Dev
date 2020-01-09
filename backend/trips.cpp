#include "gtfs.h"
//provides population for trips, rider trip, and trip capacity

void populateTrips(vector<trips> &t){
    string line;
    string temp; //for storing results from file and converting type
    struct trips tempt;
    int i = 0;
    int num_lines = 0;
    ifstream file("trips.txt");
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
                tempt.route_id = temp[0];
        
            else if (i == 1)
                tempt.service_id = temp;
        
            else if (i == 2)
                tempt.trip_id = temp;
        
            else if ( i == 3)
                tempt.trip_headsign = temp;
            
            else if (i == 4)
                tempt.block_id = stoi(temp);
         
            else
            {
                break;
            }        
        i++;
        }
        t.push_back(tempt);
    }
}
