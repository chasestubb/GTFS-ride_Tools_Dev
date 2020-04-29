import React from 'react';
//import { render } from '@testing-library/react'; // never used
import {useRouteMatch, Link} from 'react-router-dom';

function Path(){
	//let {url, path} = useRouteMatch("/:path"); // path never used
	let {url} = useRouteMatch("/:path");
	return <span>{url}</span>;
}

class Error404 extends React.Component{
	render() {
		return (
			<div>
				{/* Page Heading */}
				{/*<div className="d-sm-flex align-items-center justify-content-between mb-4">
					<h1 className="h3 mb-0 text-gray-800"><br />GTFS-ride Info</h1>
				</div>*/}
				
				{/* Content Row */}
				<div className="row">
	
					{/* Content Column */}
					<div className="col-lg-6 mb-4">
	
						{/* Project Card Example */}
						<div className="card shadow mb-4">
							<div className="card-header py-3">
								<h6 className="m-0 font-weight-bold text-primary">There's nothing here. You probably went the wrong way.</h6>
							</div>
							<div className="card-body">
								<ul>
									<li>If you pasted or manually entered the URL, please check for mistakes or misspellings.</li>
									<li>If a link from this website redirects you here, please contact the site admin and tell them which link took you here together with the details listed below.</li>
									<li>If you followed a link from another site, please contact that site's admin.</li>
								</ul>
								<b>Details:</b><br/>
								Error code: 404<br/>
								Path: <Path/>
								<br/><br/>
								<a href="https://en.wikipedia.org/wiki/HTTP_404">More info about this type of error</a><br/>
								<Link to="/">Go to homepage</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
	
		)
	}
}

export default Error404;
