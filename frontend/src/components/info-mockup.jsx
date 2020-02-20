import React from 'react'

export default () => {
	return (
		<div>
			{/* Content Row */}
			<div className="row">
				<h4>Tri-County Metropolitan Transportation</h4><br/><br/>
			</div>

			<div className="row">

				{/* Routes */}
				<div className="col-xl-3 col-md-6 mb-4">
					<div className="card border-left-primary shadow h-100 py-2">
						<div className="card-body">
							<div className="row no-gutters align-items-center">
								<div className="col mr-2">
									<div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Routes</div>
									<div className="h5 mb-0 font-weight-bold text-gray-800">42</div>
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
									<div className="h5 mb-0 font-weight-bold text-gray-800">657</div>
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
									<div className="text-xs font-weight-bold text-accent text-uppercase mb-1">Weekly Ridership</div>
									<div className="row no-gutters align-items-center">
										<div className="col-auto">
											<div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">503,314</div>
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
									<div className="h5 mb-0 font-weight-bold text-gray-800">Beaverton</div>
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
			</div><br/>

			{/* Content Row */}
			<div className="row">
				<h4>General Information</h4><br/><br/>
			</div>

			{/* Content Row */}
			<div className="row">

				{/* Content Column - DAILY SERVICE HOURS */}
				<div className="col-lg-6 mb-4">

					{/* Project Card Example */}
					<div className="card shadow mb-4">
						<div className="card-header py-3">
							<h6 className="m-0 font-weight-bold text-primary">Daily Service Hours</h6>
						</div>
						<div className="card-body">
							<table>
								<tr><td style ={{width: "4em"}}>Sun: </td><td><strong>8AM - 10PM</strong></td></tr>
								<tr><td style ={{width: "4em"}}>Mon: </td><td><strong>6AM - 11PM</strong></td></tr>
								<tr><td style ={{width: "4em"}}>Tue: </td><td><strong>6AM - 11PM</strong></td></tr>
								<tr><td style ={{width: "4em"}}>Wed: </td><td><strong>6AM - 11PM</strong></td></tr>
								<tr><td style ={{width: "4em"}}>Thu: </td><td><strong>6AM - 11PM</strong></td></tr>
								<tr><td style ={{width: "4em"}}>Fri: </td><td><strong>6AM - 11PM</strong></td></tr>
								<tr><td style ={{width: "4em"}}>Sat: </td><td><strong>8AM - 10PM</strong></td></tr>
							</table>
						</div>
					</div>
					
				</div>

				{/* Content Column - RIDERSHIP SUMMARY */}
				<div className="col-lg-6 mb-4">

					{/* Project Card Example */}
					<div className="card shadow mb-4">
						<div className="card-header py-3">
							<h6 className="m-0 font-weight-bold text-primary">Ridership Summary</h6>
						</div>
						<div className="card-body">
							<table>
								<tr><td style ={{width: "6em"}}>Yearly: </td><td><strong>24,159,072</strong></td></tr>
								<tr><td style ={{width: "6em"}}>Monthly: </td><td><strong>2,013,256</strong></td></tr>
								<tr><td style ={{width: "6em"}}>Weekly: </td><td><strong>503,314</strong></td></tr>
								<tr><td style ={{width: "6em"}}>Daily: </td><td><strong>71,902</strong></td></tr>
								
							</table>
						</div>
					</div>
					
				</div>

				{/* Content Column - ORPHAN CONTENT */}
				<div className="col-lg-6 mb-4">

					{/* Project Card Example */}
					<div className="card shadow mb-4">
						<div className="card-header py-3">
							<h6 className="m-0 font-weight-bold text-primary">Orphan Content</h6>
						</div>
						<div className="card-body">
							<em>Un-utilized Stops:</em>
							<ul>
								<li>4-Fessenden</li>
								<li>19-Woodstock/Glisan</li>
							</ul><br/>

							<em>Stops With No Time Assigned:</em>
							<ul>
								<li>48-Cornell</li>
								<li>51-Vista</li>
								<li>57-TV Hwy/Forest Grove</li>
							</ul>
						</div>
					</div>
					
				</div><br/>
			</div>
			
			{/* Content Row */}
			<div className="row">
				<h4>Routes</h4><br/><br/>
			</div>

			{/* Content Row */}
			<div className="row">

				{/* Content Column */}
				<div className="col-lg-6 mb-4">

					{/* Project Card Example */}
					<div className="card shadow mb-4">
						<div className="card-header py-3">
							<h6 className="m-0 font-weight-bold text-primary">92-South Beaverton Express</h6>
						</div>
						<div className="card-body">
							Avg. Daily Ridership: <strong>1,044</strong><br/>
							Stops: <strong>24</strong><br/><br/>

							<em>Variations</em><br/>
							<ul>
								<li>Morning</li>
								<li>Afternoon</li>
								<li>Evening</li>
								<li>Weekend</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Content Column */}
				<div className="col-lg-6 mb-4">

					{/* Project Card Example */}
					<div className="card shadow mb-4">
						<div className="card-header py-3">
							<h6 className="m-0 font-weight-bold text-primary">39-Lewis & Clark</h6>
						</div>
						<div className="card-body">
							Avg. Daily Ridership: <strong>534</strong><br/>
							Stops: <strong>18</strong><br/><br/>

							<em>Variations</em><br/>
							<ul>
								<li>Morning</li>
								<li>Afternoon</li>
								<li>Evening</li>
								<li>Weekend</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Content Column */}
				<div className="col-lg-6 mb-4">

					{/* Project Card Example */}
					<div className="card shadow mb-4">
						<div className="card-header py-3">
							<h6 className="m-0 font-weight-bold text-primary">46-North Hillsboro</h6>
						</div>
						<div className="card-body">
							Avg. Daily Ridership: <strong>1,056</strong><br/>
							Stops: <strong>22</strong><br/><br/>

							<em>Variations</em><br/>
							<ul>
								<li>Morning</li>
								<li>Afternoon</li>
								<li>Evening</li>
								<li>Weekend</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Content Column */}
				<div className="col-lg-6 mb-4">

					{/* Project Card Example */}
					<div className="card shadow mb-4">
						<div className="card-header py-3">
							<h6 className="m-0 font-weight-bold text-primary">50-Cedar Mill</h6>
						</div>
						<div className="card-body">
							Avg. Daily Ridership: <strong>4,029</strong><br/>
							Stops: <strong>12</strong><br/><br/>

							<em>Variations</em><br/>
							<ul>
								<li>Morning</li>
								<li>Afternoon</li>
								<li>Evening</li>
								<li>Weekend</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Content Column */}
				<div className="col-lg-6 mb-4">

					{/* Project Card Example */}
					<div className="card shadow mb-4">
						<div className="card-header py-3">
							<h6 className="m-0 font-weight-bold text-primary">56-Scholls Ferry Rd</h6>
						</div>
						<div className="card-body">
							Avg. Daily Ridership: <strong>4,053</strong><br/>
							Stops: <strong>32</strong><br/><br/>

							<em>Variations</em><br/>
							<ul>
								<li>Morning</li>
								<li>Afternoon</li>
								<li>Evening</li>
								<li>Weekend</li>
							</ul>
						</div>
					</div>
				</div>

			</div>
	</div>

	)
}