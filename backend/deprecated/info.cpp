#include "gtfs.h"
#include <node.hpp>

void GTFS::Info(GTFS feed){
    //mostly for printing information
    //may not use-instead use helper functions to get values and have JS print
    int num_agency;
    int num_routes;
    cout<< "This feed has " << feed.ag.size() << "agencies" << endl;
    cout<< "The agencies it has are";
    for (int i = 0; i <feed.ag.size(); i++){
        cout<< feed.ag[i].agency_name << endl;
    }
    for (int i = 0; i < feed.ag.size(); i++){
        num_routes = routesPerAgency(feed.ag[i], feed.r.size(), feed.r);
        cout << "Agency " << feed.ag[i].agency_name << " has " << num_routes << " routes" << endl;
    }


}


int routesPerAgency(agency a, int routes, vector<struct routes> r){
    //helper function for finding routes per agency
    int peragency = 0;
    string match;   
    match = a.agency_id;
    for (int i = 0; i < routes; i++){
        if (match.compare(r[i].agency_id)){
            peragency++;
        }
    }
    return peragency;
}

int stopsPerAgency(agency a, vector<struct routes> r, vector<struct trips> t, vector <struct stops> s){
    string match;
    match = a.agency_id;
    int count = 0;
    for (int i = 0; i < s.size(); i++){
        for (int j = 0; j < t.size(); j++){
        //    if 
            for (int k = 0; k < r.size(); k++){

            }
        }
    }
}


//void GTFS_ride::Info(){

//}