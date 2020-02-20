import React from 'react'
import {Link, Switch, Route, useParams} from 'react-router-dom'
import Axios from 'axios'
//import InfoAgency from "./info-agency"

// FOR PRODUCTION, CHANGE THIS URL TO THE SERVER URL
const url = "http://localhost:8080/info";

function agency_plural(count){
	if (count == 1){
		return "agency"
	} else {
		return "agencies"
	}
}

class Info extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {
			filename : "",
			is_gtfs_ride : true,
			agency_list : []
		}
		/*this.state = { // mock data
			filename : "mockdata.zip",
			is_gtfs_ride : true,
			agency_list : [
				{
					name: "No Name Transit",
					routes: 3,
					stops: 100,
					span: "Mon-Sat 6AM-10PM",
					ridership: 7500
				}, {
					name: "Another Transit Agency",
					routes: 20,
					stops: 800,
					span: "Every day 5AM-2AM",
					ridership: "No data"
				}, {
					name: "Statewide Intercity Lines",
					routes: 11,
					stops: 75,
					span: "Every day 24 hours",
					ridership: "10000"
				}
			]
		}*/
		
		
		this.getInfo = this.getInfo.bind(this)
	}

	getInfo(){
		Axios.get(url).then((res) => {
			console.log(res)
			this.setState({
				filename: res.data.filename,
				is_gtfs_ride: res.data.is_gtfs_ride,
				agency_list: res.data.agencies
			})
			//this.setState(res.data)
		})
	}

	componentDidMount(){
		this.getInfo();
	}

	/*componentDidUpdate(){
		console.log(this.state)
	}*/

	render(){
		console.log(this.state)
		if (this.state.filename){
			return (
				<div>

					{/* Content Row */}
					<div className="row">
						<h4>Click on an agency's card for more info.</h4><br/><br/>
					</div>
			
					<div className="row">

						{/* FILENAME */}
						<div className="col-xl-3 col-md-6 mb-4">
							<div className="card border-left-info shadow h-100 py-2">
								<div className="card-body">
									<div className="row no-gutters align-items-center">
										<div className="col mr-2">
											<div className="text-xs font-weight-bold text-info text-uppercase mb-1">File Uploaded</div>
											<div className="h6 mb-0 font-weight-bold text-gray-800">{this.state.filename}</div>
										</div>
										<div className="col-auto">
											<i className="fas fa-file-archive fa-2x text-gray-300"></i>
										</div>
									</div>
								</div>
							</div>
						</div>

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

						{/* Agency 2 mockup */}
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

					</div>
					
					{/* Content Row */}
					<div className="row">
		
						{/* Content Column */}
						{/*<div className="col-lg-6 mb-4">*/}
		
							{/* Project Card Example */}
							{/*<div className="card shadow mb-4">
								<div className="card-header py-3">
									<h6 className="m-0 font-weight-bold text-primary">General Feed Information</h6>
								</div>
								<div className="card-body">
									File name: <strong>{this.state.filename}</strong><br/>
									Feed type: <strong>{this.state.is_gtfs_ride ? "GTFS-ride" : "GTFS"}</strong><br/>
									Contains <strong>{this.state.agency_list.length}</strong> {agency_plural(this.state.agency_list.length)}.<br/>
									Click on an agency's name to view detailed info.
								</div>
							</div>
						</div>*/}
		
					{this.state.agency_list.map(agency => 
						<div className="col-lg-6 mb-4">
		
							<div className="card shadow mb-4">
								<div className="card-header py-3">
									<h6 className="m-0 font-weight-bold text-primary"><Link to={"/info/agency/" + agency.index}>{agency.name}</Link></h6>
								</div>
								<div className="card-body">
									Routes: <strong>{agency.routes}</strong><br/>
									Stops: <strong>{agency.stops}</strong><br/>
									Service span: <strong>{agency.span}</strong><br/>
									Weekly ridership: {this.state.is_gtfs_ride ? <strong>{agency.ridership}</strong> : <span><strong>no data</strong> (feed is not GTFS-ride)</span>}
								</div>
							</div>
						</div>
					
					)}
					</div>
						
			</div>
		
			)
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
