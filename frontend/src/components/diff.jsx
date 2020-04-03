import React from 'react'
import DiffUpload from './diff_upload'

class Diff extends React.Component{
	render(){
		return (
			<div>
				<DiffUpload file={this.props.file} />
			</div>

		)
	}
}

export default Diff