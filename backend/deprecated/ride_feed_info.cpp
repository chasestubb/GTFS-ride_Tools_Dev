#include "gtfs.h"

void GTFS_ride::populateRideFeedInfo(vector<ride_feed_info> &r){
    string line;
    string temp; //for storing results from file and converting type
    struct ride_feed_info tempr;
    int i = 0;
    int num_lines = 0;
    ifstream file("ride_feed_info.txt");
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
                tempr.ride_files = stoi(temp);
        
            else if (i == 1)
                tempr.ride_start_date = stoi(temp);
        
            else if (i == 2)
                tempr.ride_end_date = stoi(temp);
        
            else if ( i == 3)
                tempr.gtfs_feed_date = stoi(temp);
            
            else if (i == 4)
                tempr.default_currency_type = temp;
            else if ( i == 5)
                tempr.ride_feed_version = temp;
            else
            {
                break;
            }        
        i++;
        }
        r.push_back(tempr);
    }
}
