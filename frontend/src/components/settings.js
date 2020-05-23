export const HOST = "http://localhost:8080" // FOR PRODUCTION, CHANGE THIS TO THE SERVER HOST

// Settings for Feed Info
export const RIDERSHIP_TIME = "Total"

// Settings for Feed Creation
export const CHECK_DATE = true // set this to true if the program should prohibit start date to be later than end date, set it to false to allow

// Paths -- CHANGING THIS REQUIRES A CHANGE ON backend/filehandler.js
export const SERVER_CHECK_URL = "/server_check"
export const FILE_UPLOAD_URL = "/fileupload"
export const INFO_URL = "/info"
export const FC_POST_URL = "/fc/params"
export const FC_GET_URL = "/fc/getfile"
export const LIST_AGENCY_URL = "/agencies"
export const SPLIT_URL = "/split"