import React from 'react'

export default () => {
	return (
		<div>
			{/* Page Heading */}
			{/*<div className="d-sm-flex align-items-center justify-content-between mb-4">
				<h1 className="h3 mb-0 text-gray-800"><br />GTFS-ride Tools</h1>
			</div>*/}
			
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

	)
}