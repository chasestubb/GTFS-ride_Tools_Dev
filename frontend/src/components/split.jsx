import React from 'react'
import Axios from 'axios'
import * as Settings from './settings'

// returns " hidden" if a != b, returns null if a == b
function hide_elem(a, b){
	if (a != b){
		return " hidden"
	} else {
		return null
	}
}

class Split extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			split_by: 2,
			dep_time: null,
			arr_time: null,
			start_date: null,
			end_date: null,
			agencies: [],
			agency: null,
		}
		this.set = this.set.bind(this)
		this.setNumber = this.setNumber.bind(this)
	}

	// sets a parameter based on the name attribute on the HTML element
	// if the HTML code looks like <input name="xyz" onChange={this.set}/>
	// then this function modifies this.state.params.xyz
	set(event){
		this.setState({fileStatus: 0})
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	setNumber(event){
		this.setState({fileStatus: 0})
		this.setState({
			[event.target.name]: Number(event.target.value)
		})
	}

	getAgencies(){
		var url = Settings.HOST + Settings.LIST_AGENCY_URL
		Axios.get(url).then((res) => {
			console.log(res)
			this.setState({
				agencies: res.data
			})
		})
	}

	componentDidMount(){
		this.getAgencies()
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
								<h6 className="m-0 font-weight-bold text-primary">Parameters</h6>
							</div>
							<div className="card-body">
								<label for="split_by">Split by</label>
								<select id="split_by" name="split_by" onChange={this.set}>
									<option value={2}>Date</option>
									<option value={0}>Time</option>
									<option value={1}>Agency</option>
								</select>
								<br />

								<table className={"date-split" + hide_elem(this.state.split_by, 2)}>
									<tr>
										<td>Start date</td>
										<td>
											<input type="date" name="start_date" onChange={this.set}></input>
										</td>
									</tr><tr>
										<td>End date</td>
										<td>
											<input type="date" name="end_date" onChange={this.set}></input>
										</td>
									</tr>
								</table>

								<table className={"time-split" + hide_elem(this.state.split_by, 0)}>
									<tr>
										<td>Departure time limit</td>
										<td>
											<input type="time" name="dep_time" onChange={this.setNumber}></input>
										</td>
									</tr><tr>
										<td>Arrival time limit: </td>
										<td>
											<input type="time" name="arr_time" onChange={this.set}></input>
										</td>
									</tr>
								</table>

								<div className={"agency-split" + hide_elem(this.state.split_by, 1)}>
									Desired agency:
									<select id="agency" name="agency">
										{this.state.agencies.map(a => 
											<option value={a.id} onChange={this.set}>{a.name}</option>
										)}
									</select>
								</div>
								<button>Split the feed</button>
								
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
	
}

export default Split;