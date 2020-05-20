// info-agency.jsx shows the agency-level info

import React from 'react';
//import {Link, Route, useParams} from 'react-router-dom' // Route, useParams never used.
import {Link} from 'react-router-dom';

import Axios from 'axios';

// FOR PRODUCTION, CHANGE THIS URL TO THE SERVER URL
const url = "http://localhost:8080/info/agency/";
const RIDERSHIP_TIME = "Total";

// get the route type (route type is an enum on the standard)
function get_route_type(type){
	switch(Number(type)){ // no break statements because all cases return at the end
		case 0:
			return(<span><strong>light rail</strong></span>)
		case 1:
			return(<span><strong>rail rapid transit</strong></span>)
		case 2:
			return(<span><strong>rail</strong></span>)
		case 3:
			return(<span><strong>bus</strong></span>)
		case 4:
			return(<span><strong>ferry</strong></span>)
		case 5:
			return(<span><strong>cable tram</strong></span>)
		case 6:
			return(<span><strong>cable-suspended lift</strong></span>)
		case 7:
			return(<span><strong>furnicular</strong></span>)
		default:
			return(<span><em>unknown</em></span>)
	}
}

/* displays ridership data

   params:
   - ride -- whether or not the feed is GTFS-ride (true = GTFS-ride, false = GTFS)
   - num -- the ridership count

   output format:
   - nothing if ride is false
   - "<time> ridership: missing board_alight.txt" if num == -1
   - "<time> ridership: <num>" otherwise
   <time> is the RIDERSHIP_TIME constant defined above
*/
function ridership_num (ride, num){
	if (ride){
		if (num == -1){ // missing board_alight
			return (
				<span>
					{RIDERSHIP_TIME} ridership: <em>missing board_alight.txt</em>
				</span>
			)
		} else { // have board_alight
			return (
				<span>
					{RIDERSHIP_TIME} ridership: <strong>{num}</strong>
				</span>
			)
		}
	} else { // not GTFS-ride
		return null
	}
}

class Info_Agency extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			status: -1,
			name: "",
			url: "",
			fare_url: "",
			phone: "",
			email: "",
			hours: {
				m: "",
				t: "",
				w: "",
				r: "",
				f: "",
				s: "",
				u: ""
			},
			routes: [],
			stops: [],
			is_gtfs_ride: false,
			ridership: 0,
			trips: 0,
			err: null,
		}
	}

	// get data from the server
	getInfo(){
		console.log("getInfo(" + url + this.props.index + ")")
		Axios.get(url + this.props.index).then((res) => {
			console.log(res)
			this.setState(res.data) // store the agency data on the local state
			this.setState({status: res.status, err: null})
		}).catch(function(err){
			console.log("Error: " + err)
			this.setState({err: err})
		})
	}

	// get the data on page load
	componentDidMount(){
		this.getInfo();
	}

	render(){
		if (this.state.status == 200){
			return (
				<div>
					<div className="row">
		
						{/* Page Heading */}
						<div className="d-sm-flex align-items-center justify-content-between mb-4">
							<h1 className="h3 mb-0 text-gray-800"><button className="back-button" onClick={() => window.history.back()}><i className="fas fa-chevron-left back-button"></i></button>{this.state.name}</h1>
						</div>
					</div>
		
					<div className="row">
		
						{/* Routes */}
						<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-primary shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-info text-uppercase mb-1">Routes</div>
											<div className="h5 mb-0 font-weight-bold text-gray-800">{(this.state.routes).length}</div>
										</div>
										<div className="col-auto">
											<i className="fas fa-route fa-2x text-gray-300"></i>
										</div>
									</div>
								</div>
							</div>
						</div>
		
						{/* Stops -- SEE EXPLANATION ON INFO.JSX ON WHY THE "STOPS PER AGENCY" LIST IS NO LONGER USED */}
						{/*<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-dark shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-dark text-uppercase mb-1">Stops</div>
											<div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.stops.length}</div>
										</div>
										<div className="col-auto">
											<i className="fas fa-sign fa-2x text-gray-300"></i>
										</div>
									</div>
								</div>
							</div>
						</div>*/}

						{/* Average daily trips */}
						<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-success shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-success text-uppercase mb-1">Trips</div>
											<div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.trips}</div>
										</div>
										<div className="col-auto">
											<i className="fas fa-arrow-circle-right fa-2x text-gray-300"></i>
										</div>
									</div>
								</div>
							</div>
						</div>
		
						{/* Average riderships */}
						<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-accent shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-accent text-uppercase mb-1">Avg. {RIDERSHIP_TIME} Riderships</div>
											<div className="row no-gutters align-items-center">
												<div className="col-auto">
												<div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{this.state.ridership ? (this.state.ridership == -1 ? "---" : this.state.ridership) : "no data"}</div>
												</div>
											</div>
										</div>
										<div className="col-auto">
											<i className="fas fa-users fa-2x text-gray-300"></i>
										</div>
									</div>
								</div>
							</div>
						</div>
		
						{/* Service days */}
						<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-info shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-info text-uppercase mb-1">Service Span</div>
											<div className="row no-gutters align-items-center">
												<div className="col-auto">
													<div className="h3 mb-0 mr-3 font-weight-bold text-gray-800">{this.state.days}<br/>{this.state.span}</div>
												</div>
											</div>
										</div>
										<div className="col-auto">
											<i className="fas fa-calendar-alt fa-2x text-gray-300"></i>
										</div>
									</div>
								</div>
							</div>
						</div>
		
						{/* Service span */}{/*
						<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-success shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-success text-uppercase mb-1">Service span</div>
											<div className="h5 mb-0 font-weight-bold text-gray-800">6 AM - 10 PM</div>
										</div>
										<div className="col-auto">
											<i className="fas fa-clock fa-2x text-gray-300"></i>
										</div>
									</div>
								</div>
							</div>
						</div>*/}
					</div>
					
					{/* Content Row */}
					<div className="row">
		
						{/* Content Column */}
						<div className="col-lg-6 mb-4">
		
							{/* Project Card Example */}
							<div className="card shadow mb-4">
								<div className="card-header py-3">
									<h6 className="m-0 font-weight-bold text-primary">Agency Info</h6>
								</div>
								<div className="card-body">
									Name: <strong>{this.state.name}</strong> <br/>
									Website: {this.state.url ? <a href={this.state.url}><strong>{this.state.url}</strong></a> : "no website provided"} <br/>
									Contact: {this.state.phone ? <strong>{this.state.phone}</strong> : "no phone number provided"} / {this.state.email ? <strong>{this.state.email}</strong> : "no email address provided"}
								</div>
							</div>
						</div>
					</div>
					{/* Content Row */}
					<div className="row">
						<h4 className="h4 mb-0 text-gray-800">Routes ({(this.state.routes).length})</h4>
					</div>
					<div className="row">
						<h5>Click on a route name for more info.</h5><br/><br/>
					</div>
					<div className="row">
		
						{/* Content Column - ROUTES */}
						{this.state.routes.map(route => 
							<div className="col-lg-6 mb-4">
		
								<div className="card shadow mb-4">
									<div className="card-header py-3">
										<h6 className="m-0 font-weight-bold text-primary"><Link to={"/info/route/" + route.index}><strong>{route.short_name}</strong>{(route.short_name && route.long_name) ? " - " : null}{route.long_name}</Link></h6>
									</div>
									<div className="card-body">
										Description: <strong>{route.desc}</strong> <br/>
										Type: {get_route_type(route.type)} <br/>
										Trips: <strong>{route.trips}</strong> <br/>
										{ridership_num(this.state.is_gtfs_ride, route.ridership)} <br/>
									</div>
								</div>
							</div>
						)}
						
					</div>

					<div className="row">
						<h4 className="h4 mb-0 text-gray-800">Stops</h4>
					</div>
					<div className="row">
						<h5>Go back to the <Link to="/info">feed-level info</Link> to see all stops</h5>
					</div>
					<div className="row">
						We have decided to not list the stops by agency because it is slow (when testing, TriMet's feed took more than 3 minutes to list when filtered by agency but it took about 20 seconds to list all stops in the feed).
						This is because getting stops by agency requires joining 4 different tables (agency, routes, trips, stops)
						<br/>
					</div>
					
				</div>
		
			)
		
		// if the server returns an error
		} else if (this.state.err) {
			return(
				<div className="row">
					<h4>{this.state.err}</h4><br/><br/>
				</div>
			)
		
		// if the server has not responded yet
		} else {
			return(
				<div className="row">
					<h4>Loading feed...</h4><br/><br/>
				</div>
			)
		}
		
	}
}
export default Info_Agency
