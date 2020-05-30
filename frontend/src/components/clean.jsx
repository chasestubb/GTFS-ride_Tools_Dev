import React from 'react'
import Axios from 'axios'
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

class Clean extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			fileStatus: 0,
			report: "",
			zip_filename: this.props.filename + "_cleaned"
		}
		this.submit = this.submit.bind(this);
		this.statusText = this.statusText.bind(this);
		this.isServerAlive = this.isServerAlive.bind(this)
		this.sendRequest = this.sendRequest.bind(this)
		this.sendGetFile = this.sendGetFile.bind(this)
		this.sendGetReport = this.sendGetReport.bind(this)
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
	async sendRequest(){
		Axios.get(Settings.HOST + Settings.CLEAN_CONFIRM_URL).then((res) => {
			this.setState({fileStatus: 2})
		}).catch((err) => {
			console.log("ERROR " + err)
			this.setState({fileStatus: -2})
		})
	}

	// request the cleaned file, sent after sendRequest has received a response
	async sendGetFile(){
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
		Axios.get(Settings.HOST + Settings.CLEAN_REPORT_URL).then((res) => {
			this.setState({
				fileStatus: 3,
				report: res.data
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
	submit(){
		this.setState({fileStatus: 1})
		this.sendRequest().then(() => {
			this.sendGetFile()
			this.sendGetReport()
		})
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
								<h6 className="m-0 font-weight-bold text-primary">Confirmation</h6>
							</div>
							<div className="card-body">
								Click on the button below to clean <strong className="text-dark">{this.props.filename}</strong>.
								Cleaning will return a copy of the feed with these removed:
								<ul>
									<li>Stops without trips</li>
									<li>Routes without trips</li>
									<li>Agencies without routes</li>
									<li>Unused service dates and exceptions</li>
								</ul>
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

						{this.state.report != ""
						?
						<div className="card shadow mb-4">
							<div className="card-header py-3">
								<h6 className="m-0 font-weight-bold text-primary">Cleaning Report</h6>
							</div>
							<div className="card-body">
								Removed the following items from {this.props.filename}:
								{this.state.report}
							</div>
						</div>
						: null}
					</div>
				</div>				
			</div>
		)
	}
	
}
export default Clean