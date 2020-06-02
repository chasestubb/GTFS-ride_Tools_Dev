import React from 'react'
import DiffUpload from './diff_upload'

class Diff extends React.Component{
	render(){
		/*return (
			<div>
				<DiffUpload file={this.props.file} />
			</div>

		)*/
		return(
			<div className="row">

				{/* Content Column */}
				<div className="col-lg-6 mb-4">

					{/* Project Card Example */}
					<div className="card shadow mb-4">
						<div className="card-header py-3">
							<h6 className="m-0 font-weight-bold text-primary">Under construction</h6>
						</div>
						<div className="card-body">
							Coming soon ...
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Diff