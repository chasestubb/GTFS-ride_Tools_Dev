import React from 'react'
import {Link, Switch, Route, useParams} from 'react-router-dom'
import Axios from 'axios'
import Info_Detail from "./info-detail"

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
			]// mock data
		}
		
		
		//this.componentDidMount = this.componentDidMount.bind(this)
	}

	/*componentDidMount(){
		Axios.get(url).then(function(res){
			this.filename = res.filename;
			this.is_gtfs_ride = res.is_gtfs_ride;
			this.agency_list = res.agencies;
		})
	}*/

	render(){
		if (this.state.agency_list){
			return (
				<div>
					
					{/* Content Row */}
					<div className="row">
		
						{/* Content Column */}
						<div className="col-lg-6 mb-4">
		
							{/* Project Card Example */}
							<div className="card shadow mb-4">
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
						</div>
		
					{this.state.agency_list.map(agency => 
						<div className="col-lg-6 mb-4">
		
							<div className="card shadow mb-4">
								<div className="card-header py-3">
									<h6 className="m-0 font-weight-bold text-primary"><Link to="/info/detail">{agency.name}</Link></h6>
								</div>
								<div className="card-body">
									Routes: <strong>{agency.routes}</strong><br/>
									Stops: <strong>{agency.stops}</strong><br/>
									Service span: <strong>{agency.span}</strong><br/>
									Weekly ridership: <strong>{agency.ridership}</strong>
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
