import React from 'react'
import {Route, useParams} from 'react-router-dom'
import Axios from 'axios'

// FOR PRODUCTION, CHANGE THIS URL TO THE SERVER URL
const url = "http://localhost:8080/info/agency/";

class Info_Detail extends React.Component{
	constructor(props){
		super(props);
		this.state = {
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
			routes: []
		}
	}

	getInfo(){
		Axios.get(url + this.props.index, {mode: "no-cors"}).then((res) => {
			console.log(res)
			/*this.setState({
				filename: res.data.filename,
				is_gtfs_ride: res.data.is_gtfs_ride,
				agency_list: res.data.agencies
			})*/
			this.setState(res.data)
		})
	}

	componentDidMount(){
		this.getInfo();
	}

	render(){
		return (
			<div>
				<div className="row">
	
					{/* Page Heading */}
					<div className="d-sm-flex align-items-center justify-content-between mb-4">
						<h1 className="h3 mb-0 text-gray-800">{this.state.name}</h1>
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
	
					{/* Stops */}
					<div className="col-xl-3 col-md-6 mb-4">
						<div className="card border-left-dark shadow h-100 py-2">
							<div className="card-body">
								<div className="row no-gutters align-items-center">
									<div className="col mr-2">
										<div className="text-xs font-weight-bold text-danger text-uppercase mb-1">Stops</div>
										<div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.stops}</div>
									</div>
									<div className="col-auto">
										<i className="fas fa-sign fa-2x text-gray-300"></i>
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
										<div className="text-xs font-weight-bold text-accent text-uppercase mb-1">Avg. Daily Riderships</div>
										<div className="row no-gutters align-items-center">
											<div className="col-auto">
											<div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{this.state.ridership_day}</div>
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
	
					{/* Average daily trips */}{/*
					<div className="col-xl-3 col-md-6 mb-4">
						<div className="card border-left-secondary shadow h-100 py-2">
							<div className="card-body">
								<div className="row no-gutters align-items-center">
									<div className="col mr-2">
										<div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">Avg. Daily Trips</div>
										<div className="h5 mb-0 font-weight-bold text-gray-800">16.1</div>
									</div>
									<div className="col-auto">
										<i className="fas fa-exchange-alt fa-2x text-gray-300"></i>
									</div>
								</div>
							</div>
						</div>
					</div>*/}
	
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
								Name: {this.state.name}
							</div>
						</div>
					</div>
	
					{/* Content Column */}
					{this.state.routes.map(route => 
						<div className="col-lg-6 mb-4">
	
							<div className="card shadow mb-4">
								<div className="card-header py-3">
									<h6 className="m-0 font-weight-bold text-primary"><strong>{route.short_name}</strong> - {route.long_name}</h6>
								</div>
								<div className="card-body">
									Description: {route.desc}
								</div>
							</div>
						</div>
					)}
					
				</div>
		</div>
	
		)
	}
}
export default Info_Detail
