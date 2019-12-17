import React from 'react';
import logo from './logo.svg';
import './App.css';
import Sidebar from "./components/sidebar"
import Topbar from "./components/topbar"

function App() {
	return (
		<div id="page-top">

			{/* Page Wrapper */}
			<div id="wrapper">
		
				<Sidebar></Sidebar>
		
				{/* Content Wrapper */}
				<div id="content-wrapper" className="d-flex flex-column">
		
					{/* Main Content */}
					<div id="content">
		
						{/*<Topbar></Topbar>*/}
		
						{/* Begin Page Content */}
						<div className="container-fluid">
		
							{/* Page Heading */}
							<div className="d-sm-flex align-items-center justify-content-between mb-4">
								<h1 className="h3 mb-0 text-gray-800"><br />GTFS-ride Tools	</h1>
							</div>

		
		
							
		
							{/* Content Row */}
							<div className="row">
		
								{/* Content Column */}
								<div className="col-lg-6 mb-4">
		
									{/* Project Card Example */}
									<div className="card shadow mb-4">
										<div className="card-header py-3">
											<h6 className="m-0 font-weight-bold text-primary">Functionalities</h6>
										</div>
										<div className="card-body">
											<h4 className="font-weight-bold">Info</h4>
											Shows information about the feed.
											<br /><br />
											<h4 className="font-weight-bold">Feed Creation</h4>
											Generates a test feed.
											<br /><br />
											<h4 className="font-weight-bold">Network State</h4>
											Needs further definition.
											<br /><br />
											<h4 className="font-weight-bold">Diff</h4>
											Compares two feeds.
											<br /><br />
										</div>
									</div>
								</div>
							</div>
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

export default App;
