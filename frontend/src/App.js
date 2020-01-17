import React from 'react';
import './App.css';

// the general elements
import Sidebar from "./components/sidebar"
import Topbar from "./components/topbar"

// the contents & the naming conventions
import Home from "./components/home"
import Info from "./components/info"   // feed info (formerly just "info")
import FC from "./components/fc"       // feed creation
import NS from "./components/ns"       // network state
import Diff from "./components/diff"   // diff
import Clean from "./components/clean" // clean
import TS from "./components/ts"       // time split
import TM from "./components/tm"       // time merge
import RM from "./components/rm"       // ridership merge
import AS from "./components/as"       // agency split
import RA from "./components/ra"       // ridership anomaly
import SC from "./components/sc"       // service changes

// other contents
import Error404 from "./components/404"

function content(nav){
	if (nav === "home"){
		return (<Home></Home>);
	} else if (nav === "info") {
		return (<Info></Info>);
	} else if (nav === "fc") {
		return (<FC></FC>);
	} else if (nav === "ns") {
		return (<NS></NS>);
	} else if (nav === "diff") {
		return (<Diff></Diff>);
	} else if (nav === "clean") {
		return (<Clean></Clean>);
	} else if (nav === "ts") {
		return (<TS></TS>);
	} else if (nav === "tm") {
		return (<TM></TM>);
	} else if (nav === "rm") {
		return (<RM></RM>);
	} else if (nav === "as") {
		return (<AS></AS>);
	} else if (nav === "ra") {
		return (<RA></RA>);
	} else if (nav === "sc") {
		return (<SC></SC>);
	} else {
		return (<Error404></Error404>);
	}
}

class App extends React.Component{
	constructor(props){ 
		super(props);
		this.state = {nav: "home", title: "GTFS-ride Tools"};
		this.navChange = this.navChange.bind(this); // required to make onNavChange={this.navChange} work
	}

	// handles receiving data from the sidebar
	// selectedNav is where the item from sidebar.jsx -> Sidebar -> navigate(item) received
	navChange(selectedNav) {

		// set the navigation state of the page
		this.setState({nav: selectedNav});

		// dynamically change the page title on the topbar
		// selectedNav and this.state.nav use the same naming convention as the sidebar nav buttons
		switch (selectedNav){
			case "info":
				this.setState({title: "GTFS-ride Feed Info"});
				break;
			case "fc":
				this.setState({title: "GTFS-ride Feed Creation"});
				break;
			case "ns":
				this.setState({title: "GTFS-ride Network State"});
				break;
			case "diff":
				this.setState({title: "GTFS-ride Diff"});
				break;
			case "clean":
				this.setState({title: "GTFS-ride Clean"});
				break;
			case "ts":
				this.setState({title: "GTFS-ride Time Split"});
				break;
			case "tm":
				this.setState({title: "GTFS-ride Time Merge"});
				break;
			case "rm":
				this.setState({title: "GTFS-ride Ridership Merge"});
				break;
			case "as":
				this.setState({title: "GTFS-ride Agency Split"});
				break;
			case "ra":
				this.setState({title: "GTFS-ride Ridership Anomaly"});
				break;
			case "sc":
				this.setState({title: "GTFS-ride Service Changes"});
				break;
			default: // home, 404, etc.
				this.setState({title: "GTFS-ride Tools"});
				break;
		}
	}

	render(){

		/*let content;
		if (this.state.nav === "home"){
			content = <Home></Home>;
		} else if (this.state.nav === "info") {
			content = <Info></Info>;
		}*/
		let contentPreview = content(this.state.nav);

		return (
			<div id="page-top">

				{/* Page Wrapper */}
				<div id="wrapper">

					{/* see explanation on sidebar.jsx */}
					<Sidebar defaultNav={this.state.nav} onNavChange={this.navChange}></Sidebar>
					{/* onNavChange also exists in sidebar.jsx -> Sidebar -> navigate(item)*/}
			
					{/* Content Wrapper */}
					<div id="content-wrapper" className="d-flex flex-column">
			
						{/* Main Content */}
						<div id="content">
			
							<Topbar title={this.state.title}></Topbar>
			
							{/* Begin Page Content */}
							<div className="container-fluid">
			
								{contentPreview}
								
								
							</div>
							{/* /.container-fluid */}
			
						</div>
						{/* End of Main Content */}
			
						{/* Footer */}
						<footer className="sticky-footer bg-white">
							<div className="container my-auto">
								<div className="copyright text-center my-auto">
									<span>Copyright &copy; GTFS-ride 2020</span>
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
			
				{/* Logout Modal*/}
				<div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
				</div>
			
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
