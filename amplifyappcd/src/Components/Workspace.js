import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Workspace.css'



function Workspaces({accessToken, proxy}) {
	const [workspaces, setWorkspaces] = useState([])

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

	const WorkspaceCard = (name, owner) => (
		<div className='workspace-card-container'>
			<div>
				<div className='workspacel-card-name'>{name}</div>
				<div className='workspace-card-owner'>{owner}</div>				
			</div>
			<div className='workspace-card-messages'>
				50
			</div>
		</div>
	)

	return (
		<div>
			<button>New Workspacel</button>
			{workspaces.map((item, index) => (
				<div key={index}>{WorkspaceCard(item.name, item.owner)}</div>
			))}
		</div>
	)
}

export default Workspaces;