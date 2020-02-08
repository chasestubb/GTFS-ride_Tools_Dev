import React from 'react';
import {Link, NavLink, Switch, Route, useParams} from 'react-router-dom';

const navoptions = [
	{id: "info", name: "Feed Info", icon: "fas fa-info-circle"},
	{id: "fc", name: "Test Feed Creation", icon: "fas fa-file-archive"},
	{id: "ns", name: "Network State", icon: "fas fa-project-diagram"},
	{id: "diff", name: "Difference", icon: "fas fa-not-equal"},
	{id: "clean", name: "Clean", icon: "fas fa-broom"},
	{id: "ts", name: "Time Split", icon: "fas fa-calendar-day"},
	//{id: "tm", name: "Time Merge", icon: "fas fa-calendar-alt"},
	{id: "rm", name: "Merge", icon: "fas fa-object-group"},
	{id: "as", name: "Agency Split", icon: "fas fa-landmark"},
	{id: "ra", name: "Ridership Anomaly", icon: "fas fa-search"},
	{id: "sc", name: "Service Changes", icon: "fas fa-edit"}
];

class Sidebar extends React.Component{
	constructor(props){
		super(props);
		this.state = {nav: "home", sidebar_enabled: true};
	}

	// handles sending navigation data to App.js
	navigate(item){
		this.setState((state) => ({nav:item})); // locally sets the nav state for the sidebar
		this.props.onNavChange(item); // invokes the onNavChange property on <Sidebar> element in App.js
		                              // (sends this.state.nav to App.js)
	}

	render(){

		// Nav items definitions, each defines how the nav buttons look and work
		let homebtn;

		// Home
		/*
		if (current_nav === "home"){ // if user is currently at home
			homebtn = (
				<li className="nav-item active">
					<Link className="nav-link" to="/">
					<i className="fas fa-home"></i>
						<span>Home/About</span></Link>
				</li>
			)
		} else { // if user is currently NOT at home
			homebtn = (
				<li className="nav-item">
					<Link className="nav-link" to="/">
					<i className="fas fa-home"></i>
						<span>Home/About</span></Link>
				</li>
			)
		}
		*/
		homebtn = (
			<li className="nav-item">
				<NavLink className="nav-link" activeClassName="active" exact to="/">
				<i className="fas fa-home"></i>
					<span>Home/About</span></NavLink>
			</li>
		)

		// the rest of the functionalities
		let options = navoptions.map(option =>
			// key is required for each list item       the "active" class will only be used if the user navigates to that page
			<li key={option.id} className="nav-item">
				<NavLink className="nav-link" to={"/" + option.id} activeClassName="active">
				<i className={option.icon}></i>
				<span>{option.name}</span></NavLink>
			</li>
		);

		if (this.state.sidebar_enabled){
			return (
				<ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
				
					{/* the "GTFS-ride Tools" brand (with the logo) - should go to home on click */}
					<Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
						<div className="sidebar-brand-icon sidebar-logo">
							<img src="img/isolated-monochrome-white.svg" alt="GTFS-ride logo" />
						</div>
						<div className="sidebar-brand-text mx-3">GTFS-ride Tools</div>
					</Link>
		
					{/* Divider */}
					<hr className="sidebar-divider my-0" />
		
					{homebtn}
					
					{/* Divider */}
					<hr className="sidebar-divider" />
					
					{/* The nav buttons defined above */}
					{/*infobtn}
					{fcbtn}
					{nsbtn}
					{diffbtn}
					{cleanbtn}
					{tsbtn}
					{tmbtn}
					{rmbtn}
					{asbtn}
					{rabtn}
					{scbtn*/}
					{options}
	
		
					{/* Divider */}
					<hr className="sidebar-divider d-none d-md-block" />
		
					{/* Sidebar Toggler*/}
					{/*<div className="text-center d-none d-md-inline" onClick={() => {this.setState({sidebar_enabled: false})}}>
						<button className="rounded-circle border-0" id="sidebarToggle"></button>
					</div>*/}
		
				</ul>
			)
		} else { // currently unreachable, intended for hiding the sidebar (feature currently disabled)
			return(
				<div className="text-center d-none d-md-inline" onClick={() => {this.setState({sidebar_enabled: true})}}>
					<button className="rounded-circle border-0" id="sidebarToggle"></button>
				</div>
			)
		}
	}
}

export default Sidebar;
