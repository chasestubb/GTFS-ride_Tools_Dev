import React from 'react'
import Axios from 'axios'


// FOR PRODUCTION, CHANGE THIS TO THE SERVER HOST
const HOST = "http://localhost:8080"

// DO NOT CHANGE THESE UNLESS YOU CHANGE THEM ON THE SERVER AS WELL
const postURL = HOST + "/fc/params"
const getURL = HOST + "/fc/getfile"
const SERVER_CHECK_URL = "/server_check"

function OutputCard(fileStatus){
	switch (Number(fileStatus)){
		case 1:
			return(
				<span>Your request has been sent to the server.</span>
			)
		case 2:
			return(
				<span>The server is has received the request and is now generating the files.</span>
			)
		case 3:
			return(
				<div>
					Your feed is ready.
				</div>
			)
		case -1:
			return(
				<span>Server unreachable.</span>
			)
		default:
			return(
				<span>Please fill out the form and click "Generate Feed".</span>
			)
	}
}

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
				feed_date: null, // just made it the same as start_date
				user_source: 0, // enum
				num_riders: 1,
				files: 6, // because we are generating all files
			},
			status: -1,
			fileStatus: 0, // 0 = no requests sent, 1 = request sent to server, 2 = server received the request and is now processing it, 3 = file ready, -1 = server unreachable
		}
		this.setNumber = this.setNumber.bind(this)
		this.setDate = this.setDate.bind(this)
		this.set = this.set.bind(this)
		this.submit = this.submit.bind(this)
		this.isServerAlive = this.isServerAlive.bind(this)
	}

	async isServerAlive(){
		Axios.get(HOST + SERVER_CHECK_URL).then((res) => {
			console.log(res)
			this.setState({status: res.status})
		}).catch((err) => {
			console.log("Error: " + err)
			this.setState({status: -99})
		})
	}

	setNumber(event){
		var num = Number(event.target.value)
		if (num < 1){
			alert("You must enter a positive integer.")
			this.setState({
				params: {
					...this.state.params,
					[event.target.name]: 1
				}
			})
		} else {
			this.setState({
				params: {
					...this.state.params,
					[event.target.name]: Math.round(num)
				}
			})
		}
		
	}

	strDateToIntDate(strDate){
		var arrDate = strDate.split("-")
		var intDate = 0
		intDate += Number(arrDate[0] * 10000)
		intDate += Number(arrDate[1] * 100)
		intDate += Number(arrDate[2])
		return intDate
	}

	setDate(event){
		this.setState({
			params: {
				...this.state.params,
				[event.target.name]: event.target.value
			}
		})
	}

	set(event){
		this.setState({
			params: {
				...this.state.params,
				[event.target.name]: event.target.value
			}
		})
	}

	// sendPost sends a POST requests and the server responds with a simple message when it has confirmed the request
	async sendPost(json){
		const config = {/*headers: {"content-type": "application/json"},*/ mode: "no-cors"/*, params: this.state.params*/};
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
		if (this.state.params.start_date == null && this.state.params.end_date == null){
			alert("Please fill out the start and end dates.")
			return;
		} else if (this.state.params.start_date == null){
			alert("Start date is required.")
			return;
		} else if (this.state.params.end_date == null){
			alert("End date is required.")
			return;
		}
		var params = {
			...this.state.params,
			start_date: this.strDateToIntDate(this.state.params.start_date),
			end_date: this.strDateToIntDate(this.state.params.end_date),
			feed_date: this.strDateToIntDate(this.state.params.start_date)
		}
		console.log(params)
		//var postBody = JSON.stringify(params)
		//this.sendPost(postBody)
		this.sendPost(params)
		this.sendGet()
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
									<tr>
										<td>Feed start date</td>
										<td><input name="start_date" className="" type="date" value={this.state.params.start_date} onChange={this.setDate}></input></td>
									</tr>
									<tr>
										<td>Feed end date</td>
										<td><input name="end_date" className="" type="date" value={this.state.params.end_date} onChange={this.setDate}></input></td>
									</tr>
									<tr>
										<td>Number of riders</td>
										<td><input name="num_riders" className="fc-input-number" type="number" min={1} value={this.state.params.num_riders} onChange={this.setNumber}></input></td>
									</tr>
									<tr>
										<td>Ridership data collection method</td>
										<td><select name="user_source" value={this.state.params.user_source} onChange={this.set}>
											<option value={0}>Manual Counting</option>
											<option value={1}>Automated Passenger Counter</option>
											<option value={2}>Automated Fare Collector</option>
											<option value={3}>Model Estimation</option>
											<option value={4}>Mixed Source</option>
										</select></td>
									</tr>
								</table>
								<br/>
								<button onClick={this.submit}>Generate Feed</button>
							</div>
						</div>
					</div>

					{/* Content Column */}
					<div className="col-lg-6 mb-4">

						{/* Project Card Example */}
						<div className="card shadow mb-4">
							<div className="card-header py-3">
								<h6 className="m-0 font-weight-bold text-primary">Output</h6>
							</div>
							<div className="card-body">
								<OutputCard fileStatus={this.state.fileStatus} />
							</div>
						</div>
					</div>
				</div>
			</div>

		)
	}
	
}
export default FC