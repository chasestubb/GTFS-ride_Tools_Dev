import React from 'react'

class Topbar extends React.Component{
	
	render () {
		return (
			<nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
			
			{/* Sidebar Toggle (Topbar) */}
			<button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
				<i className="fa fa-bars"></i>
			</button>

			<h1 className="h3 mb-0 text-gray-800">{this.props.title}</h1>

			{/* Topbar Navbar */}
			<ul className="navbar-nav ml-auto">

				{/* Nav Item - User Information */}
				<li className="nav-item">
					<a className="nav-link" href="#">
						<span className="mr-2 d-none d-lg-inline text-black-50 small">No feed uploaded</span>
					</a>
				</li>

			</ul>

		</nav>
		);
	}
}

export default Topbar;