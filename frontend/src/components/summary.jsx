import React from 'react'

export default () => {
	return (
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
		</div>
	)
}