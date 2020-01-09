import React from 'react';
import './App.css';
import Sidebar from "./components/sidebar"
import Topbar from "./components/topbar"
import HomeAbout from "./components/home-about"
import Info from "./components/info"

function content(nav){
	if (nav === "home"){
		return (<HomeAbout></HomeAbout>);
	} else if (nav === "info") {
		return (<Info></Info>);
	}
}

class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {nav: "home", title: "GTFS-ride Tools"};
		this.navChange = this.navChange.bind(this);
	}

	// handles receiving data from the sidebar
	// selectedNav is where the item from sidebar.jsx -> Sidebar -> navigate(item) received
	navChange(selectedNav) {
		this.setState({nav: selectedNav});
		switch (selectedNav){
			case "home":
				this.setState({title: "GTFS-ride Tools"});
				break;
			case "info":
				this.setState({title: "GTFS-ride Info"});
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
			default:
				this.setState({title: "GTFS-ride Tools"});
				break;
		}
	}

	render(){

		/*let content;
		if (this.state.nav === "home"){
			content = <HomeAbout></HomeAbout>;
		} else if (this.state.nav === "info") {
			content = <Info></Info>;
		}*/
		let contentPreview = content(this.state.nav);

		return (
			<div id="page-top">

				{/* Page Wrapper */}
				<div id="wrapper">

					{/* see explanation on sidebar.jsx */}
					<Sidebar onNavChange={this.navChange}></Sidebar>
			
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
									<span>Copyright &copy; Your Website 2019</span>
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
				<div className="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
