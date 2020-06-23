import React from 'react'
import Axios from 'axios'
import {Link} from 'react-router-dom'
import * as Settings from './settings'

/* ENUM VALUES

	fileStatus:
	0 = no requests sent
	1 = sending request to server
	2 = server received the request and is now processing it
	3 = file ready
	-1 = server unreachable
	-2 = other errors
	-3 = no feed

*/

// format the date
function date_formatter(date_int){
	var date = String(date_int);
	var year = date.substr(0, 4);
	var month = date.substr(4, 2);
	var day = date.substr(6, 2);

	// feel free to edit the date format on the next line
	var formatted_date = year + "-" + month + "-" + day;
	// date and month will always be a 2-digit number, year will always be the complete year (e.g.: 2017)

	return (formatted_date)
}

// displays a service pattern from a row in calendar.txt
function service_pattern_disp(cal_entry){
	var days = ""

	cal_entry.sunday ? days += "S" : days += "-"
	cal_entry.monday ? days += "M" : days += "-"
	cal_entry.tuesday ? days += "T" : days += "-"
	cal_entry.wednesday ? days += "W" : days += "-"
	cal_entry.thursday ? days += "T" : days += "-"
	cal_entry.friday ? days += "F" : days += "-"
	cal_entry.saturday ? days += "S" : days += "-"

	days += " from "
	days += date_formatter(cal_entry.start_date)
	days += " to "
	days += date_formatter(cal_entry.end_date)

	return days
}

// displays a service exception from a row in calendar_dates.txt
function service_exception_disp(cdates_entry){
	if (cdates_entry.exception_type == 1){
		return ("service on " + date_formatter(cdates_entry.date))
	} else if (cdates_entry.exception_type == 2){
		return ("no service on " + date_formatter(cdates_entry.date))
	}
}

class Clean extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			fileStatus: 0,
			orphan_stops: [],
			orphan_routes: [],
			orphan_agencies: [],
			orphan_cal_service: [],
			orphan_cdates_service: [],
			option: 0,
			zip_filename: this.props.filename + "_cleaned"
		}
		this.submit = this.submit.bind(this);
		this.statusText = this.statusText.bind(this);
		this.isServerAlive = this.isServerAlive.bind(this)
		this.sendRequest = this.sendRequest.bind(this)
		this.sendGetFile = this.sendGetFile.bind(this)
		this.sendGetReport = this.sendGetReport.bind(this)
		this.setNumber = this.setNumber.bind(this)
		this.cleanList = this.cleanList.bind(this)
	}

	setNumber(event){
		if (this.state.fileStatus > 0){
			this.setState({fileStatus: 0})
		}
		this.setState({
			[event.target.name]: Number(event.target.value)
		})
	}

	cleanList(){
		switch (this.state.option){
			case 1:
				return (<ul>
					<li>Unused service dates and exceptions</li>
				</ul>)

			case 2:
				return (<ul>
					<li>Stops without trips</li>
					<li>Routes without trips</li>
					<li>Agencies without routes</li>
				</ul>)

			default:
				return (<ul>
					<li>Stops without trips</li>
					<li>Routes without trips</li>
					<li>Agencies without routes</li>
					<li>Unused service dates and exceptions</li>
				</ul>)
		}
	}

	statusText(){
		switch (Number(this.state.fileStatus)){
			case 1:
				return("Sending a request to the server...")
			case 2:
				return("The server is has received the request and is now cleaning the feed.")
			case 3:
				return("Your feed is ready. Check your browser's download section.")
			case -1:
				return("Server unreachable.")
			case -2:
				return this.state.err
			case -3:
				return("You have not uploaded any valid feed. Please go to the home page and upload one.")
			default:
				return("Click \"Clean " + this.props.filename + "\" to clean the aforementioned feed.")
		}
	}

	// sends a test request to the server to check if the server is up
	async isServerAlive(){
		Axios.get(Settings.HOST + Settings.SERVER_CHECK_URL).then((res) => {
			console.log(res)
			this.setState({status: res.status, fileStatus: 0});
		}).catch((err) => {
			console.log("Error: " + err);
			this.setState({status: -99, fileStatus: -1});
		})
	}

	componentDidMount(){
		if (this.props.filename){
			this.isServerAlive()
		} else {
			this.setState({fileStatus: -3})
		}
	}

	// sends a request when the user clicks the clean button
	async sendRequest(json){
		console.log("sendRequest")
		Axios.post(Settings.HOST + Settings.CLEAN_CONFIRM_URL, {...json}).then((res) => {
			this.setState({fileStatus: 2})
			console.log("sendRequest received a response")
		}).catch((err) => {
			console.log("ERROR " + err)
			this.setState({fileStatus: -2})
		})
	}

	// request the cleaned file, sent after sendRequest has received a response
	async sendGetFile(){
		console.log("sendGetFile")
		Axios.get(Settings.HOST + Settings.CLEAN_FILE_URL, {
			responseType: "arraybuffer" // response is a binary file, do not parse as string
		}).then((res) => {
			console.log("Response from sendGetFile:")
			console.log(res)
			this.setState({fileStatus: 3})
			let blob = new Blob([res.data], {type:res.headers['Content-Type']})
			if (blob){
				// send for download
				// force the browser to download (i.e. not display or store) the file
				let a = document.createElement("a");
				let downloadUrl = window.URL.createObjectURL(blob)
				let filename = this.state.zip_filename + ".zip"
				if (typeof a.download === "undefined") {
					window.location.href = downloadUrl
				} else {
					a.href = downloadUrl;
					a.download = filename;
					document.body.appendChild(a);
					a.click();
				}
			}
			this.state.err = ""
		}).catch((err) => {
			console.log("ERROR " + err)
			this.setState({err: err, fileStatus: -2})
		})
	}

	// request the report for what got removed, sent after sendRequest has received a response
	async sendGetReport(){
		console.log("sendGetReport")
		Axios.get(Settings.HOST + Settings.CLEAN_REPORT_URL).then((res) => {
			this.setState({
				fileStatus: 3,
				orphan_stops: res.data.orphan_stops,
				orphan_routes: res.data.orphan_routes,
				orphan_agencies: res.data.orphan_agencies,
				orphan_cal_service: res.data.orphan_cal_service,
				orphan_cdates_service: res.data.orphan_cdates_service,
			})
		}).catch((err) => {
			console.log("ERROR " + err)
			this.setState({fileStatus: -2})
		})
	}

	/* Submits the form data to the server and wait for the server to respond
	   Procedure:
	   1.  User clicks "clean"
	   2.  Client sends a GET requst to the server, making sure the server is available
	   3.  Server starts cleaning the feed
	   4.  Server responds to the first GET request
	   5.  Client receives the response
	   6.  Client sends 2 GET requests: one for the file and one for the report
	   7.  Server waits until feed cleaning is done
	   8.  Server sends the resulting feed and report to the client
	   9.  Client receives the cleaned feed and the report
	   10. Client downloads the feed to the user's computer and displays the report
	*/
	submit(event){
		this.setState({fileStatus: 1})
		this.sendRequest({option: this.state.option}).then(() => {
			this.sendGetFile()
			this.sendGetReport()
		})
	}

	render(){
		if (this.state.fileStatus == -3){
			return(
				<div className="row">
					{/* Content Column */}
					<div className="col-lg-6 mb-4">
		
						{/* Project Card Example */}
						<div className="card shadow mb-4">
							<div className="card-header py-3">
								<h6 className="m-0 font-weight-bold text-primary">No Feed Uploaded</h6>
							</div>
							<div className="card-body">
								Please <Link to="/">go to the home page</Link> and upload a feed.
							</div>
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div>
					{/* Page Heading */}
					{/*<div className="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 className="h3 mb-0 text-gray-800"><br />GTFS-ride Info</h1>
					</div>*/}
					
					{/* Content Row */}
					<div className="row">
	
						{/* Content Column */}
						<div className="col-lg-6 mb-4">
	
							{/* Project Card Example */}
							<div className="card shadow mb-4">
								<div className="card-header py-3">
									<h6 className="m-0 font-weight-bold text-primary">Confirmation</h6>
								</div>
								<div className="card-body">
									Clean unused 
									<select name="option" value={this.state.option} onChange={this.setNumber}>
										<option value={0}>calendar entries, stops, routes, and agencies</option>
										<option value={1}>calendar entries</option>
										<option value={2}>stops, routes, and agencies</option>
									</select>
									from <strong className="text-dark">{this.props.filename}</strong>.<br/>
									Click on the button below to return a copy of the feed with these removed:
									{this.cleanList()}
									<button onClick={this.submit}>Clean {this.props.filename}</button>
								</div>
							</div>
						</div>
	
						{/* Content Column */}
						<div className="col-lg-6 mb-4">
	
							{/* Project Card Example */}
							<div className="card shadow mb-4">
								<div className="card-header py-3">
									<h6 className="m-0 font-weight-bold text-primary">Status</h6>
								</div>
								<div className="card-body">
									{this.statusText()}
								</div>
							</div>
	
							{this.state.fileStatus == 3
							?
							<div className="card shadow mb-4">
								<div className="card-header py-3">
									<h6 className="m-0 font-weight-bold text-primary">Cleaning Report</h6>
								</div>
								<div className="card-body">
									{ (this.state.orphan_agencies.length + this.state.orphan_stops.length + this.state.orphan_routes.length + this.state.orphan_cal_service.length + this.state.orphan_cdates_service.length) > 0
									?
									<span>Removed the following unused items from {this.props.filename}:</span>
									:
									<span>No unused items found on {this.props.filename}.</span>
									}
									<br/>
									{this.state.orphan_agencies.length > 0
									?
									<span><strong>Agencies</strong>
									<ul>
										{this.state.orphan_agencies.map((a) => 
											<li>{a.agency_name} ({a.agency_id})</li>
										)}
									</ul>
									</span>
									: null}
	
									{this.state.orphan_routes.length > 0
									?
									<span><strong>Routes</strong>
									<ul>
										{this.state.orphan_routes.map((r) => 
											<li>{r.route_short_name}{(r.route_short_name && r.route_long_name) ? " - " : null}{r.route_long_name} ({r.route_id})</li>
										)}
									</ul>
									</span>
									: null}
	
									{this.state.orphan_stops.length > 0
									?
									<span><strong>Stops</strong>
									<ul>
										{this.state.orphan_stops.map((s) => 
											<li>{s.stop_name} ({s.stop_id})</li>
										)}
									</ul>
									</span>
									: null}
	
									{this.state.orphan_cal_service.length + this.state.orphan_cdates_service > 0
									?
									<span><strong>Service dates</strong>
									<ul>
										{this.state.orphan_cal_service.map((c) => 
											<li>{c.service_id}: {service_pattern_disp(c)}</li>
										)}
										{this.state.orphan_cdates_service.map((d) => 
											<li>{d.service_id}: {service_exception_disp(d)}</li>
										)}
									</ul>
									</span>
									: null}
								</div>
							</div>
							: null}
						</div>
					</div>				
				</div>
			)
		}
		
	}
	
}
export default Clean