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

				{/* FUNCTION DESCRIPTIONS - Project Card */}
				<div className="col-lg-6 mb-4">

					<div className="card shadow mb-4">
						<div className="card-header py-3">
							<h5 className="m-0 font-weight-bold text-primary">Tool Descriptions</h5>
						</div>
						<div className="card-body">
							<h5 className="font-weight-bold">Feed Info</h5>
							Receives a GTFS or GTFS-ride feed and displays feed information.
							<br /><br />
							<h5 className="font-weight-bold">Feed Creation</h5>
							Generates a test feed that is either user-provided, randomly generated, or a mix of both.
							<br /><br />
							<h5 className="font-weight-bold">Network State</h5>
							Needs further definition.
							<br /><br />
							<h5 className="font-weight-bold">Difference</h5>
							Compares two feeds, often an old and new version of the same feed.
							<br /><br />
							<h5 className="font-weight-bold">Clean</h5>
							Removes under-utilized data elements and notifies user on what was changed.
							<br /><br />
							<h5 className="font-weight-bold">Time Split</h5>
							Filters a GTFS or GTFS-ride feed based on start and end time.
							<br /><br />
							<h5 className="font-weight-bold">Time Merge</h5>
							Merges two feeds. Needs further definition. Similar open-source tools may already exist.
							<br /><br />
						</div>
					</div>
				</div>

				{/* NAVIGATION - Project Card */}
				<div className="col-lg-6 mb-4">
					<div className="card shadow mb-4">
						<div className="card-header py-3">
							<h5 className="m-0 font-weight-bold text-primary">Help</h5>
						</div>
						<div className="card-body">
							<h5 className="font-weight-bold">Navigation</h5>
							Use the lefthand sidebar to choose tool.
							<br /><br />
							<h5 className="font-weight-bold">Uploads</h5>
							GTFS and GTFS-ride feeds consist of .txt files in a zipped folder.
							<br /><br />
						</div>
					</div>
				</div>

				{/* ABOUT GTFS RIDE - Project Card */}
				<div className="col-lg-6 mb-4">

					{/* Project Card Example 2 */}
					<div className="card shadow mb-4">
						<div className="card-header py-3">
							<h5 className="m-0 font-weight-bold text-primary">About GTFS-ride</h5>
						</div>
						<div className="card-body">
							<h5 className="font-weight-bold">Feed Info</h5>
							Receives a GTFS or GTFS-ride feed and displays feed information.
							<br /><br />
							<h5 className="font-weight-bold">Feed Creation</h5>
							Generates a test feed that is either user-provided, randomly generated, or a mix of both.
							<br /><br />
						</div>
					</div>
				</div>

			</div>
	</div>

	)
}