import React from 'react'
import Axios from 'axios'

const HOST = "http://localhost:8080"
const DIFF_UPLOAD_URL_1 = "/diffupload1"

class DiffUpload extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			file1: null,
			file2: null,
			file1_fromHome: false,
			file2_fromHome: false,
		}
		this.set = this.set.bind(this)
		this.setChecked = this.setChecked.bind(this)
		this.fileSelected = this.fileSelected.bind(this)
		this.upload = this.upload.bind(this)
	}

	set(event){
		this.setState({
			...this.state,
			[event.target.name]: event.target.value
		})
	}

	setChecked(event){
		this.setState({
			...this.state,
			[event.target.name]: event.target.checked
		})
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
		let url = HOST + DIFF_UPLOAD_URL_1
		fd.append("file", this.state.file);
		const config = {headers: {"content-type": "multipart/form-data"}, mode: "no-cors"};
		//                        required for the file upload to succeed
		try {
			const res = await Axios.post(url, fd, config);
			console.log(res.data);
			this.setState({ parsed_feed: res.data, err: null });
			this.props.onUpload(res.data);
		}
		catch (err) {
			if (err) {
				this.setState({err: err})
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

	render(){
		let uploadConfirmBtn;
		if (this.state.file1 && this.state.file2){
			uploadConfirmBtn = <button onClick={this.upload}>Confirm Upload</button>;
		} else {
			uploadConfirmBtn = <button disabled>No file selected</button>;
		}

		return (
			<div>				
				{/* Content Row */}
				<div className="row">

					{/* Content Column */}
					<div className="col-lg-6 mb-4">

						{/* Project Card Example */}
						<div className="card shadow mb-4">
							<div className="card-header py-3">
								<h6 className="m-0 font-weight-bold text-primary">Diff - File Upload</h6>
							</div>
							<div className="card-body">
								<strong>1. Choose a feed file<br/></strong>
								<input type="file" name="file1" accept=".zip" onChange={this.fileSelected}/><br/>
								<input type="checkbox" name="file1_fromHome" onChange={this.setChecked} checked={this.state.file1_fromHome} />Use the file uploaded from home
								<br/><br />
								<strong>2. Choose another feed file<br/></strong>
								<input type="file" name="file2" accept=".zip" onChange={this.fileSelected}/><br/>
								<input type="checkbox" name="file2_fromHome" onChange={this.setChecked} checked={this.state.file2_fromHome} />Use the file uploaded from home
								<br/><br />
								<strong>3. Upload the selected files</strong><br/>
								{uploadConfirmBtn}
							</div>
						</div>
					</div>
				</div>
			</div>

		)
	}
}
export default DiffUpload