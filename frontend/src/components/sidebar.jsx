import React from 'react'
//import logo_white from "img/isolated-monochrome-white.svg"

export default () => {
	return (
		<ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
		
					{/* Sidebar - Brand */}
					<a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
						<div className="sidebar-brand-icon sidebar-logo">
							<img src="img/isolated-monochrome-white.svg" alt="GTFS-ride logo" />
						</div>
						<div className="sidebar-brand-text mx-3">GTFS-ride</div>
					</a>
		
					{/* Divider */}
					<hr className="sidebar-divider my-0" />
		
					{/* Nav Item - Dashboard */}
					<li className="nav-item active">
						<a className="nav-link" href="index.html">
							<i className="fa fa-fw fa-tachometer-alt"></i>
							<span>Dashboard</span></a>
					</li>
		
					{/* Divider */}
					<hr className="sidebar-divider" />

					{/*Info*/}
					<li className="nav-item">
						<a className="nav-link" href="info.html">
							<i class="fas fa-info-circle"></i>
							<span>Info</span></a>
					</li>

					{/*Feed Creation*/}
					<li className="nav-item">
						<a className="nav-link" href="info.html">
						<i class="fas fa-file-archive"></i>
							<span>Feed Creation</span></a>
					</li>

					{/*Network State*/}
					<li className="nav-item">
						<a className="nav-link" href="info.html">
						<i class="fas fa-project-diagram"></i>
							<span>Network State</span></a>
					</li>

					{/*Diff*/}
					<li className="nav-item">
						<a className="nav-link" href="info.html">
						<i class="fas fa-not-equal"></i>
							<span>Diff</span></a>
					</li>

					{/*Clean*/}
					<li className="nav-item">
						<a className="nav-link" href="info.html">
						<i class="fas fa-broom"></i>
							<span>Clean</span></a>
					</li>

					{/*Time Split*/}
					<li className="nav-item">
						<a className="nav-link" href="info.html">
						<i class="fas fa-calendar-day"></i>
							<span>Time Split</span></a>
					</li>

					{/*Time Merge*/}
					<li className="nav-item">
						<a className="nav-link" href="info.html">
						<i class="fas fa-calendar-alt"></i>
							<span>Time Merge</span></a>
					</li>

					{/*Ridership Merge*/}
					<li className="nav-item">
						<a className="nav-link" href="info.html">
						<i class="fas fa-object-group"></i>
							<span>Ridership Merge</span></a>
					</li>

					{/*Agency Split*/}
					<li className="nav-item">
						<a className="nav-link" href="info.html">
						<i class="fas fa-landmark"></i>
							<span>Agency Split</span></a>
					</li>

					{/*Ridership Anomaly*/}
					<li className="nav-item">
						<a className="nav-link" href="info.html">
						<i class="fas fa-search"></i>
							<span>Ridership Anomaly</span></a>
					</li>

					{/*Service Changes*/}
					<li className="nav-item">
						<a className="nav-link" href="info.html">
						<i class="fas fa-edit"></i>
							<span>Service Changes</span></a>
					</li>
		
					{/* Divider */}
					<hr className="sidebar-divider d-none d-md-block" />
		
					{/* Sidebar Toggler (Sidebar) */}
					<div className="text-center d-none d-md-inline">
						<button className="rounded-circle border-0" id="sidebarToggle"></button>
					</div>
		
				</ul>
	)
}