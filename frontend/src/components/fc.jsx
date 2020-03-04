import React from 'react'
import Axios from 'axios'


// FOR PRODUCTION, CHANGE THIS TO THE SERVER HOST
const HOST = "http://localhost:8080"

// DO NOT CHANGE THESE UNLESS YOU CHANGE THEM ON THE SERVER AS WELL
const postURL = HOST + "/fc/params"
const getURL = HOST + "/fc/getfile"

class FC extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			params: {
				agencies: 1,
				routes: 1,
				stops: 1,
				trips: 1,
				trips_per_route: 1,
				start_date: null,
				end_date: null,
			},
			status: -1,
		}
		this.setNumber = this.setNumber.bind(this)
		this.submit = this.submit.bind(this)
	}

	setNumber(event){
		var num = Number(event.target.value)
		if (num < 1){
			alert("You must enter a positive integer.")
			this.setState({
				params: {
					[event.target.name]: 1
				}
			})
		} else {
			this.setState({
				params: {
					[event.target.name]: Math.round(num)
				}
			})
		}
		
	}

	// sendPost sends a POST requests and the server responds with a simple message when it has confirmed the request
	async sendPost(json){
		const config = {headers: {"content-type": "application/json"}};
		try {
			const res = await Axios.post(postURL, json, config);
			console.log(res.data);
		}
		catch (err) {
			if (err) {
				console.log(err);
				if (err.response) {
					alert(err.response.data); // shows a browser alert containing error data
				}
			}
		}
	}

	// sendGet sends a GET request and the server responds with a zip file when it has finished generating the feed
	async sendGet(){

	}

	submit(event){
		var postBody = JSON.stringify(this.state.params)
		this.sendPost(postBody)
		this.sendGet()
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
									<tr>
										<td>Number of agencies</td>
										<td><input name="agencies" className="fc-input-number" type="number" min={1} value={this.state.params.agencies} onChange={this.setNumber}></input></td>
									</tr>
									<tr>
										<td>Number of routes</td>
										<td><input name="routes" className="fc-input-number" type="number" min={1} value={this.state.params.routes} onChange={this.setNumber}></input></td>
									</tr>
									<tr>
										<td>Number of stops</td>
										<td><input name="stops" className="fc-input-number" type="number" min={1} value={this.state.params.stops} onChange={this.setNumber}></input></td>
									</tr>
									<tr>
										<td>Number of trips (total)</td>
										<td><input name="trips" className="fc-input-number" type="number" min={1} value={this.state.params.trips} onChange={this.setNumber}></input></td>
									</tr>
									<tr>
										<td>Number of trips per route</td>
										<td><input name="trips_per_route" className="fc-input-number" type="number" min={1} value={this.state.params.trips_per_route} onChange={this.setNumber}></input></td>
									</tr>
								</table>
								<br/>
								<button onClick={this.submit}>Generate Feed</button>
							</div>
						</div>
					</div>
				</div>
			</div>

		)
	}
	
}
export default FC