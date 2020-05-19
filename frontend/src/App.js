// App.js is the starting point of the client-side code.

import React from 'react';
import './App.css';
import {Switch, Route, useParams} from 'react-router-dom'

// the general elements
import Sidebar from "./components/sidebar2"
import Topbar from "./components/topbar"

// the contents & the naming conventions
import Home from "./components/home"
import Info from "./components/info"   // feed info (formerly just "info")
import FC from "./components/fc"       // feed creation
import NS from "./components/ns"       // network state
import Diff from "./components/diff"   // diff
import Clean from "./components/clean" // clean
import Split from "./components/split" // split (formerly "time split")
//import TM from "./components/tm"     // time merge -- combined with "ridership merge" to create "merge"
import Merge from "./components/merge" // merge (formerly "ridership merge")
//import AS from "./components/as"     // agency split -- combined with "time split" to create "split"
import RA from "./components/ra"       // ridership anomaly
import SC from "./components/sc"       // service changes
import InfoAgency from './components/info-agency' // agency view of info
import InfoRoute from './components/info-route'   // route view of info

// other contents
import Error404 from "./components/404"



// show agency info based on the index
// index is determined by the agency's position on agency.txt
// first agency has the index of 0, second agency with index 1, third with 2, etc
function AgencyInfo(){
	const {index} = useParams();
	return <InfoAgency index={index}/>
}

// show route info based on the index
// index is determined by the route's position on routes.txt, not by the route's position on the agency screen
// first route has the index of 0, second route with index 1, third with 2, etc
function RouteInfo(){
	const {index} = useParams();
	return <InfoRoute index={index}/>
}

// TODO: show the same with stops and trips

class App extends React.Component{
	constructor(props){ 
		super(props);
		this.state = {filename: ""};
		this.setFilename = this.setFilename.bind(this);
	}

	setFilename(name){
		this.setState({filename: name});
	}

	render(){

		return (
			<div id="page-top">

				{/* Page Wrapper */}
				<div id="wrapper">

					{/* The sidebar */}
					<Sidebar/>
			
					{/* Content Wrapper */}
					<div id="content-wrapper" className="d-flex flex-column">
			
						{/* Main Content */}
						<div id="content">
			
							<Topbar filename={this.state.filename}/>
			
							{/* Begin Page Content */}
							<div className="container-fluid">
			
								{/* Selects the page displayed on the main app based on the URL path */}
								<Switch>
									{/* Home page */}
									<Route exact path="/">
										<Home filename={this.state.filename} onUpload={this.setFilename}/>
									</Route>

									{/* Agency-level info */}
									<Route path="/info/agency/:index">
										<AgencyInfo/>
									</Route>

									{/* Route-level info */}
									<Route path="/info/route/:index">
										<RouteInfo/>
									</Route>

									{/* Feed-level info */}
									<Route path="/info">
										<Info filename={this.state.filename}/>
									</Route>

									{/* Test feed creation */}
									<Route path="/fc">
										<FC/>
									</Route>

									{/* Network state */}
									<Route path="/ns">
										<NS/>
									</Route>

									{/* Diff */}
									<Route path="/diff">
										<Diff/>
									</Route>

									{/* Clean */}
									<Route path="/clean">
										<Clean/>
									</Route>

									{/* Split */}
									<Route path="/split">
										<Split/>
									</Route>

									{/* Merge */}
									<Route path="/merge">
										<Merge/>
									</Route>

									{/* Ridership anomaly */}
									<Route path="/ra">
										<RA/>
									</Route>

									{/* Service changes */}
									<Route path="/sc">
										<SC/>
									</Route>

									{/* everything else */}
									<Route path="/">
										<Error404/>
									</Route>
								</Switch>
								
								
							</div>
							{/* /.container-fluid */}
			
						</div>
						{/* End of Main Content */}
			
						{/* Footer */}
						<footer className="sticky-footer bg-white">
							<div className="container my-auto">
								<div className="copyright text-center my-auto">
									<span>Copyright &copy; 2020 GTFS-ride</span>
								</div>
							</div>
						</footer>
						{/* End of Footer */}
			
					</div>
					{/* End of Content Wrapper */}
			
				</div>
				{/* End of Page Wrapper */}
			
				{/* Scroll to Top Button*/}
				<a className="scroll-to-top rounded" href="#page-top">
					<i className="fa fa-angle-up"></i>
				</a>
			
				{/* Logout Modal -- unused*/}
				{/*<div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
								<button className="close" type="button" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">×</span>
								</button>
							</div>
							<div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
							<div className="modal-footer">
								<button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
								<a className="btn btn-primary" href="login.html">Logout</a>
							</div>
						</div>
					</div>
				</div>*/}
			
				{/* Bootstrap core JavaScript*/}
				<script src="vendor/jquery/jquery.min.js"></script>
				<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
			
				{/* Core plugin JavaScript*/}
				<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
			
				{/* Custom scripts for all pages*/}
				<script src="js/sb-admin-2.min.js"></script>
			
				{/* Page level plugins */}
				<script src="vendor/chart.js/Chart.min.js"></script>
			
				{/* Page level custom scripts */}
				<script src="js/demo/chart-area-demo.js"></script>
				<script src="js/demo/chart-pie-demo.js"></script>
			
			</div>
		);
	}
}


export default App;
