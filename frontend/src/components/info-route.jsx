// info-route.jsx shows the route-level info

import React from 'react';
//import {Link, Route, useParams} from 'react-router-dom' // Route, useParams never used
import {Link} from 'react-router-dom';
import Axios from 'axios';
import * as Settings from './settings'

// FOR PRODUCTION, CHANGE THIS URL TO THE SERVER URL
const url = Settings.HOST + Settings.INFO_ROUTE_URL
const RIDERSHIP_TIME = Settings.RIDERSHIP_TIME

// get the route type (route type is an enum on the standard)
function get_route_type(type){
	switch(Number(type)){ // no break statements because all cases return at the end
		case 0:
			return(<span>Light Rail</span>)
		case 1:
			return(<span>Rail Rapid Transit</span>)
		case 2:
			return(<span>Rail</span>)
		case 3:
			return(<span>Bus</span>)
		case 4:
			return(<span>Ferry</span>)
		case 5:
			return(<span>Cable Tram</span>)
		case 6:
			return(<span>Cable-Suspended Lift</span>)
		case 7:
			return(<span>Furnicular</span>)
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

// finds whether the text color should be white or black (based on the background color) if it is not provided in the feed
function get_fgcolor(bgcolor){
	var rgb = String(bgcolor)
	var r = parseInt(rgb.slice(0,1), 16)
	var g = parseInt(rgb.slice(2,3), 16)
	var b = parseInt(rgb.slice(4,5), 16)
	var lum = 0.2126*r + 0.7152*g + 0.0722*b
	if (lum < 128){
		return "FFFFFF"
	} else {
		return "000000"
	}
}

// show route colors with the colors specified on the feed (if exists)
function RouteColor(bg, fg){
	var bgcolor = ""
	var fgcolor = ""
	if (bg){ // if route has background color specified

		bgcolor = bg
		if (fg) { // if route has text color specified
			fgcolor = fg
			return (<span style={{backgroundColor: "#"+bgcolor, color: "#"+fgcolor}}><strong>{bgcolor} / {fgcolor}</strong></span>) // show something like "012345 / AFAFAF"
		} else { // if route has no text color
			fgcolor = get_fgcolor(bgcolor) // calculate the best foreground color (black/white)
			return (<span style={{backgroundColor: "#"+bgcolor, color: "#"+fgcolor}}><strong>{bgcolor}</strong></span>)
		}
		
	} else { // if route has no background color
		return (<em>no color specified</em>)
	}
}

class Info_Route extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			status: -1,
			short_name: "",
			long_name: "",
			desc: "",
			type: -1,
			url: "",
			bgcolor: "",
			fgcolor: "",
			min_headway: -1,
			variations: -1,
			span: {
				m: "",
				t: "",
				w: "",
				r: "",
				f: "",
				s: "",
				u: ""
			},
			trips: [],
			is_gtfs_ride: false,
			ridership: 0,
			err: null,
		}
		this.getInfo = this.getInfo.bind(this)
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
			if (err){
				//this.setState({err: err})
			}
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
							<h1 className="h3 mb-0 text-gray-800">
								<button className="back-button" onClick={() => window.history.back()}><i className="fas fa-chevron-left back-button"></i></button>
								<strong>{this.state.short_name}</strong>{(this.state.short_name && this.state.long_name) ? " - " : null}{this.state.long_name}
							</h1>
						</div>
					</div>
		
					<div className="row">
		
						{/* Route type */}
						<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-primary shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-info text-uppercase mb-1">Type</div>
											<div className="h5 mb-0 font-weight-bold text-gray-800">{get_route_type(this.state.type)}</div>
										</div>
										<div className="col-auto">
											<i className="fas fa-train fa-2x text-gray-300"></i>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Number of trips */}
						<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-success shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-success text-uppercase mb-1">Trips</div>
											<div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.trips.length}</div>
										</div>
										<div className="col-auto">
											<i className="fas fa-arrow-circle-right fa-2x text-gray-300"></i>
										</div>
									</div>
								</div>
							</div>
						</div>
		
						{/* Riderships */}
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
													<div className="h3 mb-0 mr-3 font-weight-bold text-gray-800">{/* INSERT SPAN DATA HERE */}</div>
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
		
							{/* General route info */}
							<div className="card shadow mb-4">
								<div className="card-header py-3">
									<h6 className="m-0 font-weight-bold text-primary">Route Info</h6>
								</div>
								<div className="card-body">
									Short Name: {this.state.short_name ? <strong>{this.state.short_name}</strong> : <em>none provided</em>} <br/>
									Long Name: {this.state.long_name ? <strong>{this.state.long_name}</strong> : <em>none provided</em>} <br/>
									Description: {this.state.desc ? <strong>{this.state.desc}</strong> : <em>no description provided</em>} <br/>
									Website: {this.state.url ? <a href={this.state.url}><strong>{this.state.url}</strong></a> : <em>no website provided</em>} <br/>
									{/*Color: <RouteColor bg={this.state.bgcolor} fg={this.state.fgcolor} /><br/>*/}
									Color: {RouteColor(this.state.bgcolor, this.state.fgcolor)}<br/>
									Variations: <strong>{this.state.variations}</strong><br/>
								</div>
							</div>
						</div>
					</div>
					<div className="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 className="h3 mb-0 text-gray-800">Trips ({(this.state.trips).length})</h1>
					</div>
					<div className="row">
		
						{/* Content Column - ROUTES */}
						{this.state.trips.length ? this.state.trips.map(trip => 
							<div className="col-lg-6 mb-4">
		
								<div className="card shadow mb-4">
									<div className="card-header py-3">
										<h6 className="m-0 font-weight-bold text-primary"><strong>{trip.short_name ? trip.short_name : trip.id}</strong></h6>
									</div>
									<div className="card-body">
										Days: <strong>{trip.days}</strong> <br/>
										Start time: <strong>{trip.start_time}</strong> <br/>
										End time: <strong>{trip.end_time}</strong> <br/>
										Headsign: <strong>{trip.headsign}</strong> <br/>
										Direction: <strong>{trip.direction}</strong> <br/>
										{ridership_num(this.state.is_gtfs_ride, trip.ridership)} <br/>
									</div>
								</div>
							</div>
						) : <h5>{this.state.short_name}{(this.state.short_name && this.state.long_name) ? " - " : null} has no trips on this feed</h5>}
						
					</div>
					
				</div>
		
			)
		} else if (this.state.err) {
			return(
				<div className="row">
					<h4>{this.state.err}</h4><br/><br/>
				</div>
			)
		} else {
			return(
				<div className="row">
					<h4>Loading feed...</h4><br/><br/>
				</div>
			)
		}
		
	}
}
export default Info_Route
