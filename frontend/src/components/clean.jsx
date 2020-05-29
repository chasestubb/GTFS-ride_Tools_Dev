import React from 'react'
import Axios from 'axios'
import * as Settings from './settings'

class Clean extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			fileStatus: 0,
		}
		this.submit = this.submit.bind(this);
		this.statusText = this.statusText.bind(this);
		this.isServerAlive = this.isServerAlive.bind(this)
	}

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

	submit(){

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
					</div>
				</div>				
			</div>
		)
	}
	
}
export default Clean