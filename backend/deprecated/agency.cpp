#include "gtfs.h"

void GTFS::populateAgency(vector<agency> &a){
    string line;
    string temp; //for storing results from file and converting type
    struct agency tempa;
    int i = 0;
    int num_lines = 0;
    ifstream file("agency.txt");
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
                tempa.agency_id = temp[0];
        
            else if (i == 1)
                tempa.agency_name = temp;
        
            else if (i == 2)
                tempa.agency_url = temp;
        
            else if ( i == 3)
                tempa.agency_timezone = temp;
            
            else if (i == 4)
                tempa.agency_phone = temp;
            else if ( i == 5)
                tempa.agency_lang = temp;
            else if ( i == 6)
                tempa.agency_fare_url = temp;
            else if ( i == 7)
                tempa.agency_email = temp;
            else
            {
                break;
            }        
        i++;
        }
        a.push_back(tempa);
    }
}
