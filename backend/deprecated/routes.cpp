#include <string>
#include <vector>
#include <iostream>
#include <cstdlib>
#include <fstream>
#include "gtfs.h"

using namespace std;


void GTFS::populateRoutes(vector<routes> &r){
    string line;
    string temp; //for storing results from file and converting type
    int i = 0;
    struct routes tempr;
    int num_lines = 0;
    ifstream file("routes.txt");
    getline(file, line); //skips the first line (this describes format of file)
    while(getline(file, line)){
        //this loop will give us the number of lines in the file, which indicates how many elements we need to add to the vector
        ++num_lines;
    }
 //   cout << "file has " << num_lines << "lines"<< endl;
    file.clear();
    file.seekg(0, file.beg); //resets to beginning of file
    getline(file, line); //skip first line again
    for (int j = 0; j < num_lines; j++){
//        cout << "j" << j << endl;
        //for each of the lines, we have a new route
        while(getline(file, temp, ',')){
 //           cout << "while" << endl;
            //content is separated by commas
            if (i == 0){
//                cout<< "in if" <<endl;
                tempr.route_id = temp;
//cout << "set id" << endl;
}
            else if (i == 1)
                tempr.route_short_name = stoi(temp);
            else if (i == 2)
                tempr.agency_id = temp;
            else if (i == 3)
                tempr.route_long_name = temp;
                
            else if ( i == 4)
                tempr.route_desc = temp;

            else if (i == 5)
                tempr.route_type = stoi(temp);
            else if ( i == 6)
                tempr.route_url = temp;
            else if ( i == 7)
                    tempr.route_color = temp;
            else if ( i == 8)
                    tempr.route_text_color = temp;
            else
            {
                break;
            }

            i++;
        }
 //       cout << "exited while" << endl;
        //adds the completed info to the vector

        r.push_back(tempr);
    }
}
