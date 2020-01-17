import React from 'react'

export default () => {
	return (
		<div>
			<div className="row">

				{/* Page Heading */}
				<div className="d-sm-flex align-items-center justify-content-between mb-4">
					<h1 className="h3 mb-0 text-gray-800">No Name Transit</h1>
				</div>
			</div>

			<div className="row">

				{/* Routes */}
				<div className="col-xl-3 col-md-6 mb-4">
					<div className="card border-left-primary shadow h-100 py-2">
						<div className="card-body">
							<div className="row no-gutters align-items-center">
								<div className="col mr-2">
									<div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Routes</div>
									<div className="h5 mb-0 font-weight-bold text-gray-800">3</div>
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
									<div className="text-xs font-weight-bold text-dark text-uppercase mb-1">Stops</div>
									<div className="h5 mb-0 font-weight-bold text-gray-800">80</div>
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
											<div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">2000</div>
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

				{/* Average daily trips */}
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
				</div>

				{/* Busiest route */}
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
				</div>

				{/* Busiest stop */}
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
				</div>

				{/* Service days */}
				<div className="col-xl-3 col-md-6 mb-4">
					<div className="card border-left-info shadow h-100 py-2">
						<div className="card-body">
							<div className="row no-gutters align-items-center">
								<div className="col mr-2">
									<div className="text-xs font-weight-bold text-info text-uppercase mb-1">Service Days</div>
									<div className="row no-gutters align-items-center">
										<div className="col-auto">
											<div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">7 days a week</div>
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

				{/* Service span */}
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
				</div>
			</div>
			
			{/* Content Row */}
			<div className="row">

				{/* Content Column */}
				<div className="col-lg-6 mb-4">

					{/* Project Card Example */}
					<div className="card shadow mb-4">
						<div className="card-header py-3">
							<h6 className="m-0 font-weight-bold text-primary">mockdata.zip</h6>
						</div>
						<div className="card-body">
							Feed type: <strong>GTFS-ride</strong><br/>
							Contains 1 agency/agencies:
							<ol>
								<li>No Name Transit</li>
							</ol>
						</div>
					</div>
				</div>

				{/* Content Column */}
				<div className="col-lg-6 mb-4">

					{/* Project Card Example */}
					<div className="card shadow mb-4">
						<div className="card-header py-3">
							<h6 className="m-0 font-weight-bold text-primary">No Name Transit</h6>
						</div>
						<div className="card-body">
							Contains 3 routes:
							<ul>
								<li>Route A: 20 trips Mon-Fri, 15 trips Sat, 10 trips Sun</li>
								<li>Route B: 10 trips Mon-Fri, 0 trips Sat-Sun</li>
								<li>Route C: 12 trips Thu-Mon, 0 trips Tue-Wed</li>
							</ul>
							Contains 100 stops
						</div>
					</div>
				</div>
			</div>
	</div>

	)
}