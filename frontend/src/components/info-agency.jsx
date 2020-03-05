import React from 'react'
import {Link, Route, useParams} from 'react-router-dom'
import Axios from 'axios'

// FOR PRODUCTION, CHANGE THIS URL TO THE SERVER URL
const url = "http://localhost:8080/info/agency/";
const RIDERSHIP_TIME = "Weekly"

function get_route_type(type){
	switch(Number(type)){ // no break because of the return statements
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

	getInfo(){
		console.log("getInfo(" + url + this.props.index + ")")
		Axios.get(url + this.props.index, /*{params: {agency: this.props.index}}*/).then((res) => {
			console.log(res)
			/*this.setState({
				filename: res.data.filename,
				is_gtfs_ride: res.data.is_gtfs_ride,
				agency_list: res.data.agencies
			})*/
			this.setState(res.data)
			this.setState({status: res.status, err: null})
		}).catch(function(err){
			console.log("Error: " + err)
			this.setState({err: err})
		})
	}

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
							<h1 className="h3 mb-0 text-gray-800"><Link to="/info" className="back-button"><i className="fas fa-chevron-left back-button"></i></Link>{this.state.name}</h1>
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
		
						{/* Stops */}{/*
						<div className="col-xl-3 col-md-6 mb-4">
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
		
						{/* Average daily riderships */}
						<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-accent shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-accent text-uppercase mb-1">Avg. {RIDERSHIP_TIME} Riderships</div>
											<div className="row no-gutters align-items-center">
												<div className="col-auto">
												<div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{this.state.ridership ? this.state.ridership : "no data"}</div>
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
		
						{/* Busiest route */}{/*
						<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-warning shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Busiest Route</div>
											<div className="h5 mb-0 font-weight-bold text-gray-800">A</div>
										</div>
										<div className="col-auto">
											<i className="fas fa-route fa-2x text-gray-300"></i>
										</div>
									</div>
								</div>
							</div>
						</div>*/}
		
						{/* Busiest stop */}{/*
						<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-danger shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-danger text-uppercase mb-1">Busiest Stop</div>
											<div className="h5 mb-0 font-weight-bold text-gray-800">Transit Center</div>
										</div>
										<div className="col-auto">
											<i className="fas fa-map-pin fa-2x text-gray-300"></i>
										</div>
									</div>
								</div>
							</div>
						</div>*/}
		
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
					<div className="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 className="h3 mb-0 text-gray-800">Routes ({(this.state.routes).length})</h1>
					</div>
					<div className="row">
		
						{/* Content Column - ROUTES */}
						{this.state.routes.map(route => 
							<div className="col-lg-6 mb-4">
		
								<div className="card shadow mb-4">
									<div className="card-header py-3">
										<h6 className="m-0 font-weight-bold text-primary"><strong>{route.short_name}</strong>{(route.short_name && route.long_name) ? " - " : null}{route.long_name}</h6>
									</div>
									<div className="card-body">
										Description: <strong>{route.desc}</strong> <br/>
										Type: {get_route_type(route.type)} <br/>
										Trips: <strong>{route.trips}</strong> <br/>
										{this.state.is_gtfs_ride ? RIDERSHIP_TIME + " ridership: " + route.ridership : null} <br/>
									</div>
								</div>
							</div>
						)}
						
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
export default Info_Agency
