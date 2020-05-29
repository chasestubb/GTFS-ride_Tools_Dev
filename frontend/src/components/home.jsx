// home.jsx contains the home page (not including the topbar and sidebar), also includes the file upload interface

import React from 'react'
import Axios from 'axios'
import * as Settings from './settings'

// FOR PRODUCTION, CHANGE THIS URL TO THE SERVER HOST URL
const HOST = Settings.HOST
const FILE_UPLOAD_URL = Settings.FILE_UPLOAD_URL
const url = HOST + FILE_UPLOAD_URL;

//const SERVER_CHECK_URL = "/server_check"
function status_text(st, err){
	switch(Number(st)){ // no break statements because all cases return at the end
		case -1:
			return(<span className="text-danger"><strong>{err.response ? err.response.data : this.state.err.toString()}</strong></span>)
		case 1:
			return(<span className="text-dark"><strong>Uploading feed...</strong></span>)
		case 2:
			return(<span className="text-primary"><strong>Upload successful.</strong> Check the top right corner to see the currently loaded feed.</span>)
		default:
			return null
	}
}

class Home extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			filepath: "",
			filename: "", // filename = the name only, without path
			file: null,
			parsed_feed: null,
			err: null,
			upload_status: 0, // 0: no feed uploaded, 1: upload startd but incomplete, 2: upload succeeded, -1: upload failed
		};
		this.fileSelected = this.fileSelected.bind(this);
		this.upload = this.upload.bind(this);
		//this.isServerAlive = this.isServerAlive.bind(this)
	}

	// updates state when user selects a file
	fileSelected(event){
		console.log("File selected:");
		console.log(event.target.files);
		let fp = event.target.value;
		this.setState({filepath: fp, filename: fp.slice(12), file: event.target.files[0], upload_status: 0});
		// the file path will always be "C:\\fakepath\\<FILENAME>"
		// slice(n) removes the first n characters from a string (non-destructive)
	}

	// uploads the file when user clicks "confirm upload"
	async upload(event){
		// Axios sends the file as a part of FormData
		this.setState({upload_status: 1})
		let fd = new FormData();
		fd.append("file", this.state.file);
		const config = {headers: {"content-type": "multipart/form-data"}, mode: "no-cors"};
		//                        required for the file upload to succeed
		try {
			const res = await Axios.post(url, fd, config); // send form data
			this.setState({upload_status: 2})
			console.log(res.data);
			this.setState({ parsed_feed: res.data, err: null });
			this.props.onUpload(res.data);
		}
		catch (err) { // if the server returns an error
			if (err) {
				this.setState({err: err, upload_status: -1})
				console.log(err);
				if (err.response) {
					alert(err.response.data); // shows a browser alert containing error data
				}
			}
		}
		/* how it should work:
		   1. client uploads feed to server from home.jsx
		   2. home.jsx sends the feed as HTTP POST request
		   3. server receives the feed
		   4. server extracts the feed
		   5. server parses the feed
		   6. server "manipulates" data (parsed feed) without writing to any files
		   7. server sends "manipulated" data back to client as a response
		   8. home.jsx receives the "manipulated" data as HTTP response to point #2
		   9. home.jsx sends the data to App.js
		*/
	}

	/*componentDidMount(){
		this.isServerAlive()
	}*/

	render () {

		// disable the confirm upload button if the user has no file selected
		let uploadConfirmBtn;
		if (this.state.filepath){
			uploadConfirmBtn = <button onClick={this.upload}>Confirm Upload</button>;
		} else {
			uploadConfirmBtn = <button disabled>No file selected</button>;
		}

		return (
			<div>
				{/* Page Heading */}
				{/*<div className="d-sm-flex align-items-center justify-content-between mb-4">
					<h1 className="h3 mb-0 text-gray-800"><br />GTFS-ride Tools</h1>
				</div>*/}

				{/* Server alive notification */}
				{/*this.state.server_alive
				?
					null
				:
				<div className="row">
					<h5>Could not connect to the server.</h5><br/><br/>
				</div>
				*/}
				
				
				{/* Content Row */}
				<div className="row">
	
					{/* FUNCTION DESCRIPTIONS - Project Card */}
					<div className="col-lg-6 mb-4">
	
						<div className="card shadow mb-4">
							<div className="card-header py-3">
								<h5 className="m-0 font-weight-bold text-primary">Tool Descriptions</h5>
							</div>
							<div className="card-body">
								<h5 className="font-weight-bold">Feed Info</h5>
								Receives a GTFS or GTFS-ride feed and displays helpful information.
								<br /><br />
								<h5 className="font-weight-bold">Test Feed Creation</h5>
								Randomly generates a GTFS-ride test feed, allowing user to specify feed characteristics.
								<br /><br />
								<h5 className="font-weight-bold">Network State</h5>
								Reports irregular states of the network in a GTFS or GTFS-ride feed (for example different holiday service hours)
								<br /><br />
								<h5 className="font-weight-bold">Difference</h5>
								Compares two GTFS or GTFS-ride feeds, often two versions of the same feed.
								<br /><br />
								<h5 className="font-weight-bold">Clean</h5>
								Removes unused data elements in a GTFS or GTFS-ride feed and notifies user on what was changed.
								<br /><br />
								<h5 className="font-weight-bold">Split</h5>
								Filters a GTFS or GTFS-ride feed based on agencies included or start/end time.
								<br /><br />
								<h5 className="font-weight-bold">Merge</h5>
								Merges two GTFS or GTFS-ride feeds by either ridership or time, implementing a user-defined weight for each source.
								<br /><br />
							</div>
						</div>
					</div>
	
					<div className="col-lg-6 mb-4">
	
						{/* File upload */}
						<div className="card shadow mb-4">
							<div className="card-header py-3">
								<h5 className="m-0 font-weight-bold text-primary">Upload a Feed</h5>
							</div>
							<div className="card-body">
								{this.props.filename == "" ? <span><strong className="text-danger">You have not uploaded any feeds.</strong> Uploads are optional for Test Feed Creation.</span> : <span className="text-dark">You have uploaded <strong>{this.props.filename}</strong></span>}
								<br/>
								<strong>1. Choose a feed file<br/></strong>
								<input type="file" name="fileupload" accept=".zip" onChange={this.fileSelected}/><br/>
								<br/>
								<strong>2. Upload the selected file: </strong>{this.state.filename}<br/>
								{uploadConfirmBtn}<br/>
								{status_text(this.state.upload_status, this.state.err)}
								<br/>
								Accepted file types: zipped GTFS or GTFS-ride feeds (.zip). Password-protected zip files are not supported.
							</div>
						</div>
	
						{/* HELP - Project Card */}
						<div className="card shadow mb-4">
							<div className="card-header py-3">
								<h5 className="m-0 font-weight-bold text-primary">Help</h5>
							</div>
							<div className="card-body">
								<h5 className="font-weight-bold">Navigation</h5>
								Use the lefthand sidebar to choose a tool.
								<br /><br />
							</div>
						</div>

						{/* Project Card Example 2 */}
						<div className="card shadow mb-4">
							<div className="card-header py-3">
								<h5 className="m-0 font-weight-bold text-primary">About GTFS-ride</h5>
							</div>
							<div className="card-body">
								GTFS-ride is an extension to the <a href="https://www.gtfs.org/">GTFS</a> data standard that appends ridership data.
							</div>
						</div>
					</div>
	
					{/* ABOUT GTFS RIDE - Project Card */}
					{/*<div className="col-lg-6 mb-4">
	
						
					</div>*/}
	
				</div>
			</div>
		)
	}
}
export default Home;
