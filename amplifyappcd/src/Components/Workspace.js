import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Workspace.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faHashtag, faUser } from '@fortawesome/free-solid-svg-icons'


function Workspace() {


	const [isDesktop, setDesktop] = useState(window.innerWidth >= 1024);
	const [channelBarOpen, setChannelBarOpen] = useState(false);

	const updateMedia = () => {
		setDesktop(window.innerWidth >= 1024);
	}

	useEffect(() => {
		window.addEventListener("resize", updateMedia);
		return () => window.removeEventListener("resize", updateMedia);
	})

	const renderChannels = () => {
		let styles;
		if (isDesktop)
			styles = {};
		else if (channelBarOpen)
			styles = {width: '50vw'}
		else
			styles = {width: '0vw'}

		return (
			<div className='channel-container' style={styles} >
				{[...Array(40)].map(() => (<div className='channel'>Channel</div>))}
			</div >			
		)
	}

	const renderUsers = () => (
		<div className='users-container'>
		Item 3
	</div>
	)

	// NAV BAR
	const renderNavBarMobile = () => (
		<nav className='navbar'>
			<div> <FontAwesomeIcon icon={faArrowLeft}/> </div>
			<div onClick={toggleChannelBar}> <FontAwesomeIcon icon={faHashtag}/> </div>
			<div> <FontAwesomeIcon icon={faUser}/> </div>
		</nav>
	)

	const renderNavBarDesktop = () => (
		<nav className='navbar'>
			<div> <FontAwesomeIcon icon={faArrowLeft}/> </div>
		</nav>
	)

	const toggleChannelBar = () => {
		setChannelBarOpen(!channelBarOpen)
	}

	return (
		<div>
			{isDesktop ? renderNavBarDesktop() : renderNavBarMobile()}
			<div className='workspace-container'>
				{renderChannels()}
				<div className='main-container'>
					{isDesktop ? (<div>Desktop</div>) : (<div>Mobile</div>)}
				</div>
				{isDesktop && renderUsers()}
			</div>			
		</div>
	)
}



export default Workspace;