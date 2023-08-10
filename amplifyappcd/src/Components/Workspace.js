import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Workspace.scss'



function Workspaces({accessToken, proxy}) {
	const [workspaces, setWorkspaces] = useState([])
	const [addingWorkspace, setAddingWorkspace] = useState(false);

	// GET WORKSPACES
	const GetWorkspacesAxios = () => {
		axios.post(proxy + '/getWorkspaces', {accessToken: accessToken})
		.then((response) => {
			setWorkspaces(response.data);
		}).catch((err) => {
			console.log(err);
		});
	}

	useEffect(() => {
    GetWorkspacesAxios();
  }, [])

	const ToggleAddingWorkspace = () => {
		setAddingWorkspace(!addingWorkspace);
	}

	// SUBCOMPONENTS
	const WorkspaceButtons = () => (
		<div className='workspace-buttons'>
			<button className='workspace-button-new' onClick={ToggleAddingWorkspace}>New Workspace</button>
			<button className='workspace-button-delete'>Delete Workspace</button>
			{AddNewWorkspace()}
			
		</div>
	)

	const AddNewWorkspace = () => (
		<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
			<input
				className={addingWorkspace ? 'new-workspace-name-input' : 'new-workspace-name-input-onExit'}
				type='text'
				id='new-workspace-name'>
			</input>			
		</div>

	)

	const WorkspaceCard = (name, owner) => (
		<div className='workspace-card-container'>
			<div>
				<div className='workspace-card-name'>{name}</div>
				<div className='workspace-card-owner'>{owner}</div>				
			</div>
			<div className='workspace-card-messages'>
				50
			</div>
		</div>
	)

	return (
		<div>
			{WorkspaceButtons()}
			{workspaces.map((item, index) => (
				<div key={index}>{WorkspaceCard(item.name, item.owner)}</div>
			))}
		</div>
	)
}

export default Workspaces;