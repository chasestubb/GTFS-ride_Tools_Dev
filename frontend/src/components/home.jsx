import React from 'react'
import Axios from 'axios'

// FOR PRODUCTION, CHANGE THIS URL TO THE SERVER HOST URL
const HOST = "http://localhost:8080";

// ONLY CHANGE THESE IF YOU ARE CHANGING THEM ON THE SERVER AS WELL
const path = "/fileupload"
const url = HOST + path


class Home extends React.Component{
	constructor(props){
		super(props);
		this.state = {filepath: "", filename: "", file: null, parsed_feed: null}; // filename = the name only, without path
		this.fileSelected = this.fileSelected.bind(this);
		this.upload = this.upload.bind(this);
	}

	// updates state when user selects a file
	fileSelected(event){
		console.log("File selected:");
		console.log(event.target.files);
		let fp = event.target.value;
		this.setState({filepath: fp, filename: fp.slice(12), file: event.target.files[0]});
		// the file path will always be "C:\\fakepath\\<FILENAME>"
		// slice(n) removes the first n characters from a string (non-destructive)
	}

	// uploads the file when user clicks "confirm upload"
	async upload(event){
		let fd = new FormData();
		fd.append("file", this.state.file);
		const config = {headers: {"content-type": "multipart/form-data"}, mode: "no-cors"};
		//                        required for the file upload to succeed
		try {
			const res = await Axios.post(url, fd, config);
			console.log(res.data);
			this.setState({ parsed_feed: res.data });
			this.props.onUpload(res.data);
		}
		catch (err) {
			if (err) {
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
								<strong>1. Choose a feed file<br/></strong>
								<input type="file" name="fileupload" accept=".zip" onChange={this.fileSelected}/><br/>
								<br/>
								<strong>2. Upload the selected file: </strong>{this.state.filename}<br/>
								{uploadConfirmBtn}<br/>
								{this.state.parsed_feed ? <span><strong>Upload successful.</strong> Check the top right corner to see the currently loaded feed.</span> : null}
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
					</div>
	
					{/* ABOUT GTFS RIDE - Project Card */}
					<div className="col-lg-6 mb-4">
	
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
	
				</div>
			</div>
		)
	}
}
export default Home;
