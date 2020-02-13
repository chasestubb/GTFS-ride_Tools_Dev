import React from 'react'
import {Switch, Route, Link} from 'react-router-dom'

class Topbar extends React.Component{
	
	render () {
		return (
			<nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
			
			{/* Sidebar Toggle (Topbar) */}
			<button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
				<i className="fa fa-bars"></i>
			</button>

			<h5 className="h5 mb-0 text-gray-800">
				{/* Dynamically change page title */}
				<Switch>
					<Route exact path="/">
						GTFS-ride Tools
					</Route>
					<Route path="/info">
						GTFS-ride Feed Info
					</Route>
					<Route path="/fc">
						GTFS-ride Test Feed Creation
					</Route>
					<Route path="/ns">
						GTFS-ride Network State
					</Route>
					<Route path="/diff">
						GTFS-ride Diff (Compare)
					</Route>
					<Route path="/clean">
						GTFS-ride Clean
					</Route>
					<Route path="/split">
						GTFS-ride Split
					</Route>
					<Route path="/merge">
						GTFS-ride Merge
					</Route>
					<Route path="/ra">
						GTFS-ride Ridership Anomaly
					</Route>
					<Route path="/sc">
						GTFS-ride Service Changes
					</Route>
					<Route path="*">
						Not Found
					</Route>
				</Switch>
			</h5>

			{/* Topbar Navbar */}
			<ul className="navbar-nav ml-auto">

				{/* Nav Item - User Information */}
				<li className="nav-item">
					<Link className="nav-link" to="/">
						<span className="mr-2 d-none d-lg-inline text-black-50 small">{this.props.filename ? this.props.filename : <em>No feed uploaded</em>}</span>
					</Link>
				</li>

			</ul>

		</nav>
		);
	}
}

export default Topbar;