import React from 'react';
import Axios from 'axios';
import * as Settings from './settings'
//import fileDownload from 'js-file-download';

const postURL = Settings.HOST + Settings.FC_POST_URL
const getURL = Settings.HOST + Settings.FC_GET_URL

/* ENUM VALUES

	user_source:
	see GTFS-ride documentation on board_alight.txt -> source

	calendar_type:
	0 = calendar.txt only
	1 = calendar_dates.txt only
	2 = both (default)

	operation_days:
	0 = weekends only
	1 = weekdays only
	2 = weekdays + sat
	3 = weekdays + sun
	4 = every day

	fileStatus:
	0 = no requests sent
	1 = sending request to server
	2 = server received the request and is now processing it
	3 = file ready
	-1 = server unreachable
	-2 = other errors

	files:
	0 = board_alight
	1 = rider_trip
	2 = ridership
	3 = board_alight and rider_trip
	4 = board_alight and ridership
	5 = rider_trip and ridership
	6 = board_alight, rider_trip, and ridership
	this tool can only support 2, 4, or 6

	aggr_level:
	0 = stop
	1 = trip
	2 = route
	3 = agency
	4 = feed

*/


class FC extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			params: { // form data goes here
				agencies: 2,
				routes: 10,
				stops: 50,
				trips: 40,
				trips_per_route: 4,
				start_date: null,
				end_date: null,
				feed_date: null, // just make it the same as start_date
				user_source: 1, // enum -- the ridership data collection method
				min_riders: 20000,
				max_riders: 50000,
				aggr_level: 4, // enum -- minimum aggregation level
				calendar_type: 2, // enum -- defines whether calendar.txt or calendar_dates.txt is used
				operation_days: 4, // enum -- defines the service days of the week
				files: 6, // enum -- defines what files are being generated (we only support 2, 4, or 6)
			},
			status: -1,
			fileStatus: 0, // see the "enum values" section above
			zip_filename: "fc", // the resulting zip file name (without extension)
			err: "",
		}
		this.setNumber = this.setNumber.bind(this);
		this.set = this.set.bind(this);
		this.submit = this.submit.bind(this);
		this.isServerAlive = this.isServerAlive.bind(this);
		this.errCheck = this.errCheck.bind(this);
		this.statusText = this.statusText.bind(this);
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

	// checks for input errors, returns a string if the input is invalid, returns null if the server is valid
	errCheck(){
		var input = this.state.params;
		var errmsg = "";
		if (input.agencies < 1){
			errmsg += "Number of agencies must be at least 1.\n";
		}
		if (input.routes < 1){
			errmsg += "Number of routes must be at least 1.\n";
		}
		if (input.stops < 1){
			errmsg += "Number of stops must be at least 1.\n";
		}
		if (input.trips < 1){
			errmsg += "Number of trips must be at least 1.\n";
		}
		if (input.trips_per_route < 1){
			errmsg += "Number of trips per route must be at least 1.\n";
		}
		if (input.start_date == null || input.end_date == null){
			errmsg += "Both start date and end date must be filled.\n";
		} else {
			var start = this.strDateToIntDate(this.state.params.start_date) // convert date representations to int
			var end = this.strDateToIntDate(this.state.params.end_date);
			if (start > end){
				errmsg += "End date cannot be earlier than start date.\n";
			}
		}
		if (input.min_riders < 1 || input.max_riders < 1){
			errmsg += "Number of riders must be at least 1.\n";
		} else {
			if (input.min_riders > input.max_riders){
				errmsg += "Minimum riders cannot be greater than maximum riders.\n";
			}
		}
		
		// if there are no errors
		if (errmsg == ""){
			return null;
		} else { // if there are errors
			alert(errmsg);
			return errmsg;
		}
	}

	// sets a parameter based on the name attribute on the HTML element
	// if the HTML code looks like <input name="xyz" onChange={this.set}/>
	// then this function modifies this.state.params.xyz
	set(event){
		this.setState({fileStatus: 0})
		this.setState({
			params: {
				...this.state.params,
				[event.target.name]: event.target.value
			}
		})
	}

	// same as set but converts the input to number and rounds it
	setNumber(event){
		this.setState({fileStatus: 0})
		var num = Number(event.target.value)
		this.setState({
			params: {
				...this.state.params,
				[event.target.name]: Math.round(num)
			}
		})
	}

	// converts "2019-12-31" to 20191231
	strDateToIntDate(strDate){
		var arrDate = strDate.split("-")
		var intDate = 0;
		intDate += Number(arrDate[0] * 10000);
		intDate += Number(arrDate[1] * 100);
		intDate += Number(arrDate[2]);
		return intDate;
	}

	// same as set but for dates
	/*setDate(event){
		this.setState({fileStatus: 0})
		this.setState({
			params: {
				...this.state.params,
				[event.target.name]: event.target.value
			}
		})
	}*/

	// sendPost sends a POST requests and the server responds with a simple message when it has confirmed the request
	async sendPost(json){
		const config = {mode: "no-cors"};
		this.setState({fileStatus: 1})
		await Axios.post(postURL, {...json}, config).then((res) => {
			this.setState({fileStatus: 2})
		}).catch ((err) => {
			if (err) {
				console.log(err);
				this.setState({err: err, fileStatus: -2})
				if (err.response) {
					alert(err.response.data); // shows a browser alert containing error data
				}
			}
		})
	}

	// sendGet sends a GET request and the server responds with a zip file when it has finished generating the feed
	async sendGet(){
		Axios.get(getURL, {
			responseType: "arraybuffer" // response is a binary file, do not parse as string
		}).then((res) => {
			console.log("Response from sendGet:")
			console.log(res)
			this.setState({fileStatus: 3})
			let blob = new Blob([res.data], {type:res.headers['Content-Type']})
			if (blob){
				//fileDownload(blob, this.state.zip_filename + ".zip") // send for download
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

	/* Submits the form data to the server and wait for the server to respond
	   Procedure:
	   1.  User fills out form
	   2.  User clicks submit
	   3.  Client transforms data
	   4.  Client sends POST data to server
	   5.  Server processes data
	   6.  Server writes data to vars
	   7.  Server starts creating the feed
	   7.  Server responds to POST
	   8.  Client receives POST
	   9.  Client sends GET
	   10. Server waits until feed is done
	   11. Server sends completed feed to the client
	   12. Client receives the feed
	   13. Client downloads the feed to the user's computer
	*/
	submit(event){
		if (this.errCheck() === null){ // if there are no errors on the input
			var start = this.strDateToIntDate(this.state.params.start_date) // convert date representations to int
			var end = this.strDateToIntDate(this.state.params.end_date)
			var params = { // add other parameters and rename some
				...this.state.params,
				trips: (this.state.params.trips_per_route * this.state.params.routes),
				start_date: start,
				end_date: end,
				feed_date: start
			}
			console.log(params)
			this.sendPost(params).then(() => { // send params then get file
				this.setState({fileStatus: 2})
				this.sendGet() // GET request should only be called after POST request has received a response
			})
		}
	}

	// changes the status text displayed on the "output status" card
	statusText(){
		switch (Number(this.state.fileStatus)){
			case 1:
				return("Sending a request to the server...")
			case 2:
				return("The server is has received the request and is now generating the files.")
			case 3:
				return("Your feed is ready. Check your browser's download section.")
			case -1:
				return("Server unreachable.")
			case -2:
				return this.state.err
			default:
				return("Please fill out the form and click \"Generate Feed\".")
		}
	}
	
	componentDidMount(){
		this.isServerAlive()
	}

	render(){
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
								<h6 className="m-0 font-weight-bold text-primary">Input Parameters</h6>
							</div>
							<div className="card-body">
								<table>
									<th><strong className="text-dark">Feed size</strong></th>
									<tr>
										<td>Number of agencies</td>
										<td><input name="agencies" className="fc-input-number" type="number" min={1} defaultValue={this.state.params.agencies} onChange={this.setNumber}></input></td>
									</tr>
									<tr>
										<td>Number of routes</td>
										<td><input name="routes" className="fc-input-number" type="number" min={1} defaultValue={this.state.params.routes} onChange={this.setNumber}></input></td>
									</tr>
									<tr>
										<td>Number of stops</td>
										<td><input name="stops" className="fc-input-number" type="number" min={1} defaultValue={this.state.params.stops} onChange={this.setNumber}></input></td>
									</tr>
									<tr>
										<td>Number of trips per route</td>
										<td><input name="trips_per_route" className="fc-input-number" type="number" min={1} defaultValue={this.state.params.trips_per_route} onChange={this.setNumber}></input></td>
									</tr>
									<tr className="empty-tr"></tr>
									<th><strong className="text-dark">Feed dates</strong></th>
									<tr>
										<td>Service pattern </td>
										<td><select name="operation_days" value={this.state.params.service_days} onChange={this.setNumber}>
											<option value={4}>7 days per week</option>
											<option value={1}>Weekdays only</option>
											<option value={2}>Weekdays + Saturdays</option>
											<option value={3}>Weekdays + Sundays</option>
											<option value={0}>Weekends only</option>
										</select></td>
									</tr>
									<tr>
										<td>Service pattern defined in </td>
										<td><select name="calendar_type" value={this.state.params.calendar_type} onChange={this.setNumber}>
											<option value={0}>calendar.txt only</option>
											<option value={1}>calendar_dates.txt only</option>
											<option value={2}>Both files (recommended)</option>
										</select></td>
									</tr>
									<tr>
										<td>Feed start date</td>
										<td><input name="start_date" className="" type="date" value={this.state.params.start_date} onChange={this.set}></input></td>
									</tr>
									<tr>
										<td>Feed end date</td>
										<td><input name="end_date" className="" type="date" value={this.state.params.end_date} onChange={this.set}></input></td>
									</tr>
									<tr className="empty-tr"></tr>
									<th><strong className="text-dark">Ridership</strong></th>
									<tr>
										<td>Most specific aggregation level </td>
										<td><select name="aggr_level" value={this.state.params.aggr_level} onChange={this.setNumber}>
											<option value={4}>Feed-level data</option>
											<option value={3}>Agency-level data</option>
											<option value={2}>Route-level data</option>
											<option value={1}>Trip-level data</option>
											<option value={0}>Stop-level data</option>
										</select></td>
									</tr>
									<tr>
										<td>Minimum number of riders</td>
										<td><input name="min_riders" className="fc-input-number" type="number" min={1} defaultValue={this.state.params.min_riders} onChange={this.setNumber}></input></td>
									</tr>
									<tr>
										<td>Maximum number of riders</td>
										<td><input name="max_riders" className="fc-input-number" type="number" min={1} defaultValue={this.state.params.max_riders} onChange={this.setNumber}></input></td>
									</tr>
									<tr>
										<td>Ridership data collection method </td>
										<td><select name="user_source" value={this.state.params.user_source} onChange={this.setNumber}>
											<option value={1}>Automated Passenger Counter</option>
											<option value={2}>Automated Fare Collector</option>
											<option value={0}>Manual Counting</option>
											<option value={3}>Model Estimation</option>
											<option value={4}>Mixed Source</option>
										</select></td>
									</tr>
									<tr>
										<td>Ridership files </td>
										<td><select name="files" value={this.state.params.files} onChange={this.setNumber}>
											<option value={2}>Only ridership.txt</option>
											<option value={4}>ridership.txt and board_alight.txt</option>
											<option value={6}>ridership.txt, board_alight.txt, and rider_trip.txt</option>
										</select></td>
									</tr>
								</table>
								<br/>
								<button onClick={this.submit} disabled={this.state.fileStatus === 1 || this.state.fileStatus === 2}>Generate Feed</button>
							</div>
						</div>
					</div>

					{/* Content Column */}
					<div className="col-lg-6 mb-4">

						{/* Project Card Example */}
						<div className="card shadow mb-4">
							<div className="card-header py-3">
								<h6 className="m-0 font-weight-bold text-primary">Output Status</h6>
							</div>
							<div className="card-body">
								{this.statusText()}
							</div>
						</div>

						<div className="card shadow mb-4">
							<div className="card-header py-3">
								<h6 className="m-0 font-weight-bold text-primary">Notice about aggregation level</h6>
							</div>
							<div className="card-body">
								The ridership range is a basis used to randomly generate a feed.
								Ridership values outside of the specified range may occur.
							</div>
						</div>
					</div>
				</div>
			</div>

		)
	}
	
}
export default FC