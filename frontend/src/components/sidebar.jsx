import React from 'react'


class Sidebar extends React.Component{
	constructor(props){
		super(props);
		this.state = {nav: "home", sidebar_enabled: true};
	}

	render(){

		// Nav items definitions
		let homebtn, infobtn, fcbtn, nsbtn, diffbtn, cleanbtn, tsbtn, tmbtn, rmbtn, asbtn, rabtn, scbtn;

		// Home
		if (this.state.nav == "home"){
			homebtn = (
				<li className="nav-item active">
					<a className="nav-link">
					<i class="fas fa-home"></i>
						<span>Home</span></a>
				</li>
			)
		} else {
			homebtn = (
				<li className="nav-item">
					<a className="nav-link" onClick = {() => this.setState({nav: "home"})}>
					<i class="fas fa-home"></i>
						<span>Home</span></a>
				</li>
			)
		}

		// Info
		if (this.state.nav == "info"){
			infobtn = (
				<li className="nav-item active">
					<a className="nav-link">
					<i class="fas fa-info-circle"></i>
						<span>Info</span></a>
				</li>
			)
		} else {
			infobtn = (
				<li className="nav-item">
					<a className="nav-link" onClick = {() => this.setState({nav: "info"})}>
					<i class="fas fa-info-circle"></i>
						<span>Info</span></a>
				</li>
			)
		}

		// Feed Creation
		if (this.state.nav == "fc"){
			fcbtn = (
				<li className="nav-item active">
					<a className="nav-link">
					<i class="fas fa-file-archive"></i>
						<span>Feed Creation</span></a>
				</li>
			)
		} else {
			fcbtn = (
				<li className="nav-item">
					<a className="nav-link" onClick = {() => this.setState({nav: "fc"})}>
					<i class="fas fa-file-archive"></i>
						<span>Feed Creation</span></a>
				</li>
			)
		}

		// Network State
		if (this.state.nav == "ns"){
			nsbtn = (
				<li className="nav-item active">
					<a className="nav-link">
					<i class="fas fa-project-diagram"></i>
						<span>Network State</span></a>
				</li>
			)
		} else {
			nsbtn = (
				<li className="nav-item">
					<a className="nav-link" onClick = {() => this.setState({nav: "ns"})}>
					<i class="fas fa-project-diagram"></i>
						<span>Network State</span></a>
				</li>
			)
		}

		// Diff
		if (this.state.nav == "diff"){
			diffbtn = (
				<li className="nav-item active">
					<a className="nav-link">
					<i class="fas fa-not-equal"></i>
						<span>Diff</span></a>
				</li>
			)
		} else {
			diffbtn = (
				<li className="nav-item">
					<a className="nav-link" onClick = {() => this.setState({nav: "diff"})}>
					<i class="fas fa-not-equal"></i>
						<span>Diff</span></a>
				</li>
			)
		}

		// Clean
		if (this.state.nav == "clean"){
			cleanbtn = (
				<li className="nav-item active">
					<a className="nav-link">
					<i class="fas fa-broom"></i>
							<span>Clean</span></a>
				</li>
			)
		} else {
			cleanbtn = (
				<li className="nav-item">
					<a className="nav-link" onClick = {() => this.setState({nav: "clean"})}>
					<i class="fas fa-broom"></i>
							<span>Clean</span></a>
				</li>
			)
		}

		// Time Split
		if (this.state.nav == "ts"){
			tsbtn = (
				<li className="nav-item active">
					<a className="nav-link">
					<i class="fas fa-calendar-day"></i>
						<span>Time Split</span></a>
				</li>
			)
		} else {
			tsbtn = (
				<li className="nav-item">
					<a className="nav-link" onClick = {() => this.setState({nav: "ts"})}>
					<i class="fas fa-calendar-day"></i>
						<span>Time Split</span></a>
				</li>
			)
		}

		// Time Merge
		if (this.state.nav == "tm"){
			tmbtn = (
				<li className="nav-item active">
					<a className="nav-link">
					<i class="fas fa-calendar-alt"></i>
						<span>Time Merge</span></a>
				</li>
			)
		} else {
			tmbtn = (
				<li className="nav-item">
					<a className="nav-link" onClick = {() => this.setState({nav: "tm"})}>
					<i class="fas fa-calendar-alt"></i>
						<span>Time Merge</span></a>
				</li>
			)
		}

		// Ridership Merge
		if (this.state.nav == "rm"){
			rmbtn = (
				<li className="nav-item active">
					<a className="nav-link">
					<i class="fas fa-object-group"></i>
						<span>Ridership Merge</span></a>
				</li>
			)
		} else {
			rmbtn = (
				<li className="nav-item">
					<a className="nav-link" onClick = {() => this.setState({nav: "rm"})}>
					<i class="fas fa-object-group"></i>
						<span>Ridership Merge</span></a>
				</li>
			)
		}

		// Agency Split
		if (this.state.nav == "as"){
			asbtn = (
				<li className="nav-item active">
					<a className="nav-link">
					<i class="fas fa-landmark"></i>
						<span>Agency Split</span></a>
				</li>
			)
		} else {
			asbtn = (
				<li className="nav-item">
					<a className="nav-link" onClick = {() => this.setState({nav: "as"})}>
					<i class="fas fa-landmark"></i>
						<span>Agency Split</span></a>
				</li>
			)
		}

		// Ridership Anomaly
		if (this.state.nav == "ra"){
			rabtn = (
				<li className="nav-item active">
					<a className="nav-link">
					<i class="fas fa-search"></i>
						<span>Ridership Anomaly</span></a>
				</li>
			)
		} else {
			rabtn = (
				<li className="nav-item">
					<a className="nav-link" onClick = {() => this.setState({nav: "ra"})}>
					<i class="fas fa-search"></i>
						<span>Ridership Anomaly</span></a>
				</li>
			)
		}

		// Service Changes
		if (this.state.nav == "sc"){
			scbtn = (
				<li className="nav-item active">
					<a className="nav-link">
					<i class="fas fa-edit"></i>
						<span>Service Changes</span></a>
				</li>
			)
		} else {
			scbtn = (
				<li className="nav-item">
					<a className="nav-link" onClick = {() => this.setState({nav: "sc"})}>
					<i class="fas fa-edit"></i>
						<span>Service Changes</span></a>
				</li>
			)
		}

		if (this.state.sidebar_enabled){
			return (
				<ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
				
					{/* the "GTFS-ride Tools" brand (with the logo) - should go to home on click */}
					<a className="sidebar-brand d-flex align-items-center justify-content-center" onClick = {() => this.setState({nav: "home"})}>
						<div className="sidebar-brand-icon sidebar-logo">
							<img src="img/isolated-monochrome-white.svg" alt="GTFS-ride logo" />
						</div>
						<div className="sidebar-brand-text mx-3">GTFS-ride Tools</div>
					</a>
		
					{/* Divider */}
					<hr className="sidebar-divider my-0" />
		
					{homebtn}
					
					{/* Divider */}
					<hr className="sidebar-divider" />
					
					{/* The nav buttons defined above */}
					{infobtn}
					{fcbtn}
					{nsbtn}
					{diffbtn}
					{cleanbtn}
					{tsbtn}
					{tmbtn}
					{rmbtn}
					{asbtn}
					{rabtn}
					{scbtn}
	
		
					{/* Divider */}
					<hr className="sidebar-divider d-none d-md-block" />
		
					{/* Sidebar Toggler*/}
					<div className="text-center d-none d-md-inline" onClick={() => {this.setState({sidebar_enabled: false})}}>
						<button className="rounded-circle border-0" id="sidebarToggle"></button>
					</div>
		
				</ul>
			)
		} else {
			return(
				<div className="text-center d-none d-md-inline" onClick={() => {this.setState({sidebar_enabled: true})}}>
					<button className="rounded-circle border-0" id="sidebarToggle"></button>
				</div>
			)
		}
	}
}

export default Sidebar;
