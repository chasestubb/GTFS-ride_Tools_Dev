import React from 'react'
import InfoAgency from './info-agency.jsx'
import {Link} from 'react-router-dom';

export default () => {
	return (
		<div>

			{/* Content Row */}
			<div className="row">
				<h4>Click on an agency's card for more info.</h4><br/><br/>
			</div>
			
			<div className="row">

				{/* FEED FORMAT */}
				<div className="col-xl-3 col-md-6 mb-4">
					<div className="card border-left-danger shadow h-100 py-2">
						<div className="card-body">
							<div className="row no-gutters align-items-center">
								<div className="col mr-2">
									<div className="text-xs font-weight-bold text-danger text-uppercase mb-1">Feed Format</div>
									<div className="h5 mb-0 font-weight-bold text-gray-800">GTFS-ride</div>
								</div>
								<div className="col-auto">
									<i className="fas fa-bus fa-2x text-gray-300"></i>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* FILENAME */}
				<div className="col-xl-3 col-md-6 mb-4">
					<div className="card border-left-info shadow h-100 py-2">
						<div className="card-body">
							<div className="row no-gutters align-items-center">
								<div className="col mr-2">
									<div className="text-xs font-weight-bold text-info text-uppercase mb-1">File Uploaded</div>
									<div className="h5 mb-0 font-weight-bold text-gray-800">mockdata.zip</div>
								</div>
								<div className="col-auto">
									<i className="fas fa-file-archive fa-2x text-gray-300"></i>
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
									<div className="h5 mb-0 font-weight-bold text-gray-800">3</div>
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
				<div className="col-lg-6 mb-4">

					{/* Project Card Example */}
					<div className="card shadow mb-4">
						<Link className="card-header py-3" to="/info-agency">
							<h6 className="m-0 font-weight-bold text-primary">Tri-County Metropolitan Transportation</h6>
						</Link>
						<div className="card-body">
							Weekly Ridership: <strong>503,314</strong><br/>
							Routes: <strong>42</strong><br/>
							Stops: <strong>657</strong><br/>
						</div>
					</div>
				</div>

				{/* Content Column */}
				<div className="col-lg-6 mb-4">

					{/* Project Card Example */}
					<div className="card shadow mb-4">
						<Link className="card-header py-3" to="/info-agency">
							<h6 className="m-0 font-weight-bold text-primary">Rogue Valley Commuter Line</h6>
						</Link>
						<div className="card-body">
							Weekly Ridership: <strong>2,055</strong><br/>
							Routes: <strong>3</strong><br/>
							Stops: <strong>31</strong><br/>
						</div>
					</div>
				</div>

				{/* Content Column */}
				<div className="col-lg-6 mb-4">

					{/* Project Card Example */}
					<div className="card shadow mb-4">
						<Link className="card-header py-3" to="/info-agency">
							<h6 className="m-0 font-weight-bold text-primary">Josephine Community Transit</h6>
						</Link>
						<div className="card-body">
							Weekly Ridership: <strong>16,084</strong><br/>
							Routes: <strong>8</strong><br/>
							Stops: <strong>24</strong><br/>
						</div>
					</div>
				</div>
			
			</div>
	</div>

	)
}