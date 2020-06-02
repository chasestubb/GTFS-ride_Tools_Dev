import React from 'react'
import Axios from 'axios'
import {Link} from 'react-router-dom'
import * as Settings from './settings'

const postURL = Settings.HOST + Settings.SPLIT_POST_URL
const getURL = Settings.HOST + Settings.SPLIT_GET_URL

/* ENUM VALUES

	split_by
	0 = time
	1 = agency
	2 = date

	fileStatus:
	0 = no requests sent
	1 = sending request to server
	2 = server received the request and is now processing it
	3 = file ready
	-1 = server unreachable
	-2 = other errors
	-3 = no feed

*/

// returns " hidden" if a != b, returns null if a == b
function hide_elem(a, b){
	if (a != b){
		return " hidden"
	} else {
		return null
	}
}

class Split extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			split_by: 2,
			dep_time: null,
			arr_time: null,
			start_date: null,
			end_date: null,
			agencies: [],
			agency_id: "",
			status: 0,
			fileStatus: 0,
			zip_filename: "split"
		}
		this.set = this.set.bind(this)
		this.setNumber = this.setNumber.bind(this)
		this.errCheck = this.errCheck.bind(this);
		this.submit = this.submit.bind(this);
		this.statusText = this.statusText.bind(this);
	}

	// sets a parameter based on the name attribute on the HTML element
	// if the HTML code looks like <input name="xyz" onChange={this.set}/>
	// then this function modifies this.state.params.xyz
	set(event){
		if (this.state.fileStatus > 0){
			this.setState({fileStatus: 0})
		}
		if (event.target.value === ""){
			this.setState({
				[event.target.name]: null
			})
		} else {
			this.setState({
			[event.target.name]: event.target.value
			})
		}
		
	}

	// similar to set() but for numbers
	setNumber(event){
		if (this.state.fileStatus > 0){
			this.setState({fileStatus: 0})
		}
		this.setState({
			[event.target.name]: Number(event.target.value)
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

	// converts "12:34:56" to 123456
	strTimeToIntTime(strTime){
		var arrTime = strTime.split(":")
		var intTime = 0;
		intTime += Number(arrTime[0] * 10000);
		intTime += Number(arrTime[1] * 100);
		intTime += Number(arrTime[2]);
		return intTime;
	}

	// get the agencies, also functions as a server check
	getAgencies(){
		var url = Settings.HOST + Settings.LIST_AGENCY_URL
		Axios.get(url).then((res) => {
			console.log(res)
			this.setState({
				agencies: res.data
			})
			if (res.data.length == 0){
				this.setState({fileStatus: -3})
			} else {
				this.setState({fileStatus: 0})
			}
		}).catch((err) => {
			console.log(err)
			this.setState({fileStatus: -1})
		})
	}

	componentDidMount(){
		this.getAgencies()
	}

	// checks for input errors, returns a string if the input is invalid, returns null if the server is valid
	errCheck(){
		var input = this.state;
		var errmsg = "";
		switch (Number(input.split_by)){
			case 0: // split by time
				if (input.dep_time == null && input.arr_time == null){
					errmsg += "At least one of the times must be filled.\n";
				} else if (input.dep_time != null && input.arr_time != null) {
					var start = this.strDateToIntDate(this.state.start_date) // convert date representations to int
					var end = this.strDateToIntDate(this.state.end_date);
					if (start > end){
						errmsg += "End date cannot be earlier than start date.\n";
					}
				}
				break;
				
			case 1: // split by agency
				if (input.agencies.length <= 1){
					errmsg += "Could not split by agency since the feed only contains one agency.\n";
				}
				break;

			case 2: // split by date
				if (input.start_date == null && input.end_date == null){
					errmsg += "At least one of the dates must be filled.\n";
				} else if (input.start_date != null && input.end_date != null) {
					var start = this.strDateToIntDate(this.state.start_date) // convert date representations to int
					var end = this.strDateToIntDate(this.state.end_date);
					if (start > end){
						errmsg += "End date cannot be earlier than start date.\n";
					}
				}
				break;
		}
		
		// if there are no errors
		if (errmsg == ""){
			return null;
		} else { // if there are errors
			alert(errmsg);
			return errmsg;
		}
	}

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
	   2.  User clicks "split"
	   3.  Client transforms data
	   4.  Client sends POST data to server
	   5.  Server processes data
	   6.  Server writes data to vars
	   7.  Server starts splitting the feed
	   7.  Server responds to POST
	   8.  Client receives POST
	   9.  Client sends GET
	   10. Server waits until feed is done
	   11. Server sends the resulting feed to the client
	   12. Client receives the feed
	   13. Client downloads the feed to the user's computer
	*/
	submit(event){
		if (this.errCheck() === null){ // if there are no errors on the input
			var params = { // add other parameters and rename some
				split_by: this.state.split_by,
				dep_time: this.state.dep_time,
				arr_time: this.state.arr_time,
				start_date: this.state.start_date,
				end_date: this.state.end_date,
				agency_id: this.state.agency_id,
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
				return("The server is has received the request and is now splitting the feed.")
			case 3:
				return("Your feed is ready. Check your browser's download section.")
			case -1:
				return("Server unreachable.")
			case -2:
				return this.state.err
			case -3:
				return("You have not uploaded any valid feed. Please go to the home page and upload one.")
			default:
				return("Please fill out the form and click \"Split " + this.props.filename + "\".")
		}
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
									<h6 className="m-0 font-weight-bold text-primary">Parameters</h6>
								</div>
								<div className="card-body">
									<label for="split_by">Split <strong className="text-dark">{this.props.filename}</strong> by</label>
									<select id="split_by" name="split_by" onChange={this.set}>
										<option value={2}>Date</option>
										<option value={0}>Time</option>
										<option value={1}>Agency</option>
									</select>
									<br />
	
									<table className={"date-split" + hide_elem(this.state.split_by, 2)}>
										<tr>
											<td>Start date</td>
											<td>
												<input type="date" name="start_date" onChange={this.set}></input>
											</td>
										</tr><tr>
											<td>End date</td>
											<td>
												<input type="date" name="end_date" onChange={this.set}></input>
											</td>
										</tr>
									</table>
	
									<table className={"time-split" + hide_elem(this.state.split_by, 0)}>
										<tr>
											<td>Departure time limit</td>
											<td>
												<input type="time" name="dep_time" onChange={this.set}></input>
											</td>
										</tr><tr>
											<td>Arrival time limit </td>
											<td>
												<input type="time" name="arr_time" onChange={this.set}></input>
											</td>
										</tr>
									</table>
	
									<div className={"agency-split" + hide_elem(this.state.split_by, 1)}>
										{this.state.agencies.length > 1 ?
											<div>
												Desired agency
												<select id="agency_id" name="agency_id" onChange={this.set}>
													{this.state.agencies.map(a => 
														<option value={a.id} onChange={this.set}>{a.name}</option>
													)}
												</select>
											</div>
										:
											<span>This feed only contains a single agency.</span>
										}
										
									</div>
									<button onClick={this.submit} disabled={this.state.fileStatus == -1 || this.state.fileStatus == -3}>Split {this.props.filename}</button>
									
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
						</div>
					</div>
				</div>
			)
		}
	}
	
}

export default Split;