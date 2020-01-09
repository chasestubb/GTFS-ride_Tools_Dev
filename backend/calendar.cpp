#include "gtfs.h"
//contains population for calendar dates and calendar

void populateCalendarDates(vector<calendar_dates> &dates){
    string line;
    string temp; //for storing results from file and converting type
    struct calendar_dates tempcd;
    int i = 0;
    int num_lines = 0;
    ifstream file("calendar_dates.txt");
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
                tempcd.service_id = temp;
        
            else if (i == 1)
                tempcd.date = stoi(temp);
        
            else if (i == 2)
                tempcd.exception_type = stoi(temp);

            else
            {
                break;
            }        
        i++;
        }
        dates.push_back(tempcd);
    }
}

void populateCalendar(vector<calendar> &c){
    string line;
    string temp; //for storing results from file and converting type
    struct calendar tempc;
    int i = 0;
    int num_lines = 0;
    ifstream file("calendar.txt");
    getline(file, line); //skips the first line (this describes format of file)
    while(getline(file, line)){
        //this loop will give us the number of lines in the file, which indicates how many elements we need to add to the vector
        ++num_lines;
    }
    file.clear();
    file.seekg(0, file.beg); //resets to beginning of file
    getline(file, line); //skip first line again
    for (int j = 0; j < num_lines; j++){
        //for each of the lines, we have a new member
        while(getline(file, temp, ',')){
        //content is separated by commas
            if (i == 0)
                tempc.service_id = temp[0];
        
            else if (i == 1)
                tempc.monday = stoi(temp);
        
            else if (i == 2)
                tempc.tuesday = stoi(temp);
        
            else if ( i == 3)
                tempc.wednesday = stoi(temp);
            
            else if (i == 4)
                tempc.thursday = stoi(temp);
            else if ( i == 5)
                tempc.friday = stoi(temp);
            else if ( i == 6)
                tempc.saturday = stoi(temp);
            else if ( i == 7)
                tempc.sunday = stoi(temp);
            else if ( i == 8)
                tempc.start_date = stoi(temp);
            else if ( i == 9)
                tempc.end_date = stoi(temp);
            else
            {
                break;
            }        
        i++;
        }
        c.push_back(tempc);
    }
}
