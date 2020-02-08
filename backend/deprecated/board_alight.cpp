#include "gtfs.h"

void GTFS_ride::populateBoardAlight(vector<struct board_alight> &ba){
    string line;
    string temp; //for storing results from file and converting type
    struct board_alight tempb;
    int i = 0;
    int num_lines = 0;
    ifstream file("board_alight.txt");
    getline(file, line); //skips the first line (this describes format of file)
    while(getline(file, line)){
        //this loop will give us the number of lines in the file, which indicates how many elements we need to add to the vector
        ++num_lines;
    }
    file.clear();
    file.seekg(0, file.beg); //resets to beginning of file
    getline(file, line); //skip first line again
    for (int j = 0; j < num_lines; j++){
        //for each of the lines, we have new
        while(getline(file, temp, ',')){
        //content is separated by commas
            if (i == 0)
                tempb.trip_id = temp;
        
            else if (i == 1)
                tempb.stop_id = temp;
        
            else if (i == 2)
                tempb.stop_sequence = stoi(temp);
            else if ( i == 3)
                tempb.record_use = stoi(temp);
            else if ( i == 4)
                tempb.boarding = stoi(temp);
            else
            {
                break;
            }        
        i++;
        }
        ba.push_back(tempb);
    }
}
