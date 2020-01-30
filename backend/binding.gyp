{
    "targets": [
      {
        "target_name": "gtfs-ride-backend",
        "sources": [ "gtfs.h", "agency.cpp", "board_alight.cpp", "calendar.cpp", "info.cpp", "ride_feed_info.cpp", "ridership.cpp", "routes.cpp", "stops.cpp", "trips.cpp" ],
        "include_dirs" : [
          "<!(node -e \"require('nan')\")"
        ]
      }
    ]
  }
