import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Workspace.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faHashtag, faUser } from '@fortawesome/free-solid-svg-icons'


function Workspace() {


	const [isDesktop, setDesktop] = useState(window.innerWidth >= 1024);

	const updateMedia = () => {
		setDesktop(window.innerWidth >= 1024);
	}

	useEffect(() => {
		window.addEventListener("resize", updateMedia);
		return () => window.removeEventListener("resize", updateMedia);
	})

	const renderChannels = () => (
		<div className='channel-container'>
			{[...Array(40)].map(() => (<div className='channel'>Channel</div>))}
		</div >
	)

	const renderUsers = () => (
		<div className='users-container'>
		Item 3
	</div>
	)

	// NAV BAR
	const renderNavBarMobile = () => (
		<nav className='navbar'>
			<div> <FontAwesomeIcon icon={faArrowLeft}/> </div>
			<div> <FontAwesomeIcon icon={faHashtag}/> </div>
			<div> <FontAwesomeIcon icon={faUser}/> </div>
		</nav>
	)

	const renderNavBarDesktop = () => (
		<nav className='navbar'>
			<div> <FontAwesomeIcon icon={faArrowLeft}/> </div>
		</nav>
	)

	return (
		<div>
			{isDesktop ? renderNavBarDesktop() : renderNavBarMobile()}
			<div className='workspace-container'>
				{isDesktop && renderChannels()}
				<div className='main-container'>
					{isDesktop ? (<div>Desktop</div>) : (<div>Mobile</div>)}
				</div>
				{isDesktop && renderUsers()}
			</div>			
		</div>

	)
}



export default Workspace;