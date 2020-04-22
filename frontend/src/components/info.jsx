// info.jsx shows the general feed info

import React from 'react'
import {Link, Switch, Route, useParams} from 'react-router-dom'
import Axios from 'axios'

// FOR PRODUCTION, CHANGE THIS URL TO THE SERVER URL
const HOST = "http://localhost:8080"
const INFO_URL = "/info"
const url = HOST + INFO_URL;
const RIDERSHIP_TIME = "Weekly"

const SERVER_CHECK_URL = "/server_check"

function agency_plural(count){
	if (count == 1){
		return "agency"
	} else {
		return "agencies"
	}
}

// format the date
function date_formatter(date_int){
	var date = String(date_int)
	var year = date.substr(0, 4)
	var month = date.substr(4, 2)
	var day = date.substr(6, 2)

	// feel free to edit the date format on the next line
	var formatted_date = year + "-" + month + "-" + day
	// date and month will always be a 2-digit number, year will always be the complete year (e.g.: 2017)

	return (formatted_date)
}

class Info extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {
			status: -1,
			filename : "",
			is_gtfs_ride : true,
			agency_list : [],
			stop_list: [],
			num_trips: 0,
			date: [],
		}
		
		this.getInfo = this.getInfo.bind(this)
		this.isServerAlive = this.isServerAlive.bind(this)
	}

	// sends a test request to the server to check if the server is up
	async isServerAlive(){
		Axios.get(HOST + SERVER_CHECK_URL).then((res) => {
			console.log(res)
		}).catch((err) => {
			console.log("Error: " + err)
			this.setState({status: -99})
		})
	}

	// get the feed info from the server
	async getInfo(){
		Axios.get(url).then((res) => {
			console.log(res)
			this.setState({ // store the feed info in the local state
				status: res.status,
				filename: res.data.filename,
				is_gtfs_ride: res.data.is_gtfs_ride,
				agency_list: res.data.agencies,
				stop_list: res.data.stops,
				num_trips: res.data.num_trips,
				date: [date_formatter(res.data.date[0]), date_formatter(res.data.date[1])],
			})
		}).catch((err) => {
			console.log("Error: " + err)
			this.setState({status: err.status})
		})
	}

	componentDidMount(){
		this.isServerAlive();
		this.getInfo();
	}

	render(){
		console.log(this.state)
		if (this.state.status === 200){
			return (
				<div>

					{/* Content Row */}
					<div className="row">
						<h4>Click on an agency's name for more info.</h4><br/><br/>
					</div>
			
					<div className="row">

						{/* FEED FORMAT */}
						<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-danger shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-danger text-uppercase mb-1">Feed Format</div>
											<div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.is_gtfs_ride ? "GTFS-ride" : "GTFS"}</div>
										</div>
										<div className="col-auto">
											<i className="fas fa-bus fa-2x text-gray-300"></i>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* NUMBER OF AGENCIES */}
						<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-success shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-success text-uppercase mb-1">Number of Agencies</div>
											<div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.agency_list.length}</div>
										</div>
										<div className="col-auto">
											<i className="fas fa-landmark fa-2x text-gray-300"></i>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* NUMBER OF STOPS */}
						<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-dark shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-dark text-uppercase mb-1">Number of Stops</div>
											<div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.stop_list.length}</div>
										</div>
										<div className="col-auto">
											<i className="fas fa-sign fa-2x text-gray-300"></i>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* NUMBER OF TRIPS */}
						<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-info shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-info text-uppercase mb-1">Avg. Daily Trips</div>
											<div className="h5 mb-0 font-weight-bold text-gray-800">{Math.round(this.state.num_trips / 7)}</div>
										</div>
										<div className="col-auto">
											<i className="fas fa-arrow-circle-right fa-2x text-gray-300"></i>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* FEED START DATE */}
						<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-warning shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Feed Start Date</div>
											<div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.date[0]}</div>
										</div>
										<div className="col-auto">
											<i className="fas fa-file-archive fa-2x text-gray-300"></i>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* FEED END DATE */}
						<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-secondary shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">Feed End Date</div>
											<div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.date[1]}</div>
										</div>
										<div className="col-auto">
											<i className="fas fa-file-archive fa-2x text-gray-300"></i>
										</div>
									</div>
								</div>
							</div>
						</div>


					</div>
					
					{/* Content Row */}
					<div className="row">
				
					{/* shows the list of agencies in the feed */}
					{this.state.agency_list.map(agency => 
						<div className="col-lg-6 mb-4">
		
							<div className="card shadow mb-4">
								<div className="card-header py-3">
									<h6 className="m-0 font-weight-bold text-primary"><Link to={"/info/agency/" + agency.index}>{agency.name}</Link></h6>
								</div>
								<div className="card-body">
									Routes: <strong>{agency.routes}</strong><br/>
									Service span: <strong>{agency.span}</strong><br/>
									Weekly ridership: {this.state.is_gtfs_ride ? <strong>{agency.ridership}</strong> : <span><strong>no data</strong> (feed is not GTFS-ride)</span>}
								</div>
							</div>
						</div>
					
					)}
					</div>

					<div className="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 className="h3 mb-0 text-gray-800">Stops</h1>
					</div>
					<div className="row">
		
						{/* Content Column - STOPS */}
						{/* shows the list of all stops in the feed
						    we have decided to not list the stops by agency because it is slow
						    (when testing, TriMet's feed took more than 3 minutes to list when filtered by agency but it took about 20 seconds to list all stops in the feed)
						    this is because getting stops by agency requires joining 4 different tables (agency, routes, trips, stops)
						*/}
						{this.state.stop_list.map(stop => 
							<div className="col-lg-6 mb-4">
		
								<div className="card shadow mb-4">
									<div className="card-header py-3">
										<h6 className="m-0 font-weight-bold text-primary">{stop.name}</h6>
									</div>
									<div className="card-body">
										Code: {stop.code ? <strong>{stop.code}</strong> : <em>no data</em>} <br/>
										Location: {stop.pos ? <a href={"http://www.google.com/maps/place/" + stop.pos[0] + "," + stop.pos[1]} target="_blank" rel="noopener noreferrer"><strong>{stop.pos[0]}, {stop.pos[1]}</strong></a> : <em>no data</em>} <br/>
										{/*                      ^ opens the coordinates on Google Maps                                       ^ opens it on a new tab */}
										Description: {stop.desc ? <strong>{stop.desc}</strong> : <em>no data</em>} <br/>
										{this.state.is_gtfs_ride ? <span>{RIDERSHIP_TIME + " ridership: "} {stop.ridership ? <strong>{stop.ridership}</strong> : <em>no data</em>} <br/></span> : null}
									</div>
								</div>
							</div>
						)}
						
					</div>
						
			</div>
		
			)
		
		// if the server is alive but has not returned a response yet
		} else if (this.state.status == -1 && this.props.filename) {
			return(
				<div className="row">
					<h4>Loading feed...</h4><br/><br/>
				</div>
			)
		
		// if the server is not alive
		} else if (this.state.status == -99) {
			return(
				<div>
					<div className="row">
						<h4>Could not connect to the server.</h4><br/><br/>
						
					</div>
					<div className="row">
						<Link to="/">Go back to homepage</Link>
					</div>
				</div>
				
			)
		
		// if the user has not uploaded a valid feed yet
		} else {
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
		}
		
	}
}
export default Info
