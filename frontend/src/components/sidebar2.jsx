import React from 'react';
import {Link, NavLink} from 'react-router-dom';

// navigation options
// the ID also defines the path (example: to go to Network State, the user can click on "Network State" or type "<HOSTNAME>/ns")
const navoptions = [
	{id: "info",  name: "Feed Info",          icon: "fas fa-info-circle"},
	{id: "fc",    name: "Test Feed Creation", icon: "fas fa-file-archive"},
	{id: "ns",    name: "Network State",      icon: "fas fa-project-diagram"},
	{id: "diff",  name: "Difference",         icon: "fas fa-not-equal"},
	{id: "clean", name: "Clean",              icon: "fas fa-broom"},
	{id: "split", name: "Split",              icon: "fas fa-copy"},
	//{id: "tm",  name: "Time Merge",         icon: "fas fa-calendar-alt"}, // now in merge
	{id: "merge", name: "Merge",              icon: "fas fa-object-group"},
	//{id: "as",  name: "Agency Split",       icon: "fas fa-landmark"}, // now in split
	{id: "ra",    name: "Ridership Anomaly",  icon: "fas fa-search"},
	{id: "sc",    name: "Service Changes",    icon: "fas fa-edit"}
];

class Sidebar extends React.Component{
	/*constructor(props){
		super(props);
	}*/
	// constructor is no longer used after code cleanup

	render(){

		// home button definition, defines how the home button looks and works
		let homebtn = (
			<li className="nav-item">
				<NavLink className="nav-link" activeClassName="active" exact to="/">
				<i className="fas fa-home"></i>
					<span>Home/About</span></NavLink>
			</li>
		)

		// the rest of the functionalities
		let options = navoptions.map(option =>
			// nav items definitions, each defines how the nav buttons look and work
			// key is required for each list item
			// the "active" class will only be used if the user navigates to that page
			<li key={option.id} className="nav-item">
				<NavLink className="nav-link" to={"/" + option.id} activeClassName="active">
				<i className={option.icon}></i>
				<span>{option.name}</span></NavLink>
			</li>
		);

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
				{options}
	
			</ul>
		)
	}
}

export default Sidebar;
