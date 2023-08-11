import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Workspace.scss'


function Workspaces({username, accessToken, proxy}) {
	const [workspaces, setWorkspaces] = useState([])
	const [userWorkspaces, setUserWorkspaces] = useState([]); //Workspaces owned by user
	const [addingWorkspace, setAddingWorkspace] = useState(false);
	const [deletingWorkspace, setDeletingWorkspace] = useState(false);
	const [workspacesToDelete, setWorkspacesToDelete] = useState([]);
	const [newWorkspaceName, setNewWorkspaceName] = useState(null);

	const OnNewWorkspaceNameChange = (event) => {
		setNewWorkspaceName(event.target.value);
	}

	// SERVER FUNCTIONS
	const GetWorkspacesAxios = () => {
		axios.post(proxy + '/getWorkspaces', {accessToken: accessToken})
		.then((response) => {
			const fetchedWorkspaces = response.data;
			setWorkspaces(fetchedWorkspaces);
			return fetchedWorkspaces;
		})
		.then((fetchedWorkspaces) => {
			//Parse array of workspaces and determie which ones are owned by the user
			let userWorkspacesTemp = [];
			fetchedWorkspaces.map((workspaces) => {
				if (workspaces.owner === username) {
					userWorkspacesTemp.push(workspaces);
				}
			})
			setUserWorkspaces(userWorkspacesTemp);
		})
		.catch((err) => {
			console.log(err);
		});
	}

	const DeleteWorkspacesAxios = () => {
		axios.post(proxy + '/deleteWorkspaces', {accessToken: accessToken, workspacesToDelete: workspacesToDelete})
		.then((response) => {
			console.log(response);
			ToggleDeletingWorkspace();
		})
	}

	const AddWorkspaceAxios = () => {
		if (newWorkspaceName === null || newWorkspaceName === '')
			return;
		axios.post(proxy + '/addWorkspace', {accessToken: accessToken, username: username, workspaceName: newWorkspaceName})
			.then((response) => {
				console.log(response);
			})
			.then(() => {
				return GetWorkspacesAxios();
			})
			.catch((err) => {
				console.log(err);
			})
	}

	useEffect(() => {
    GetWorkspacesAxios();
  }, [])

	// TOGGLES
	const ToggleAddingWorkspace = () => {
		setAddingWorkspace(!addingWorkspace);
		setDeletingWorkspace(false);
		setWorkspacesToDelete([]);
	}

	const ToggleDeletingWorkspace = () => {
		setDeletingWorkspace(!deletingWorkspace);
		setAddingWorkspace(false);
		setWorkspacesToDelete([]);
	}

	// DATA MANIP. FUNCTIONS
	const MarkWorkspaceForDeletion = (event) => {
		const workspaceID = event.currentTarget.id; // ID of the workspace user clicked on
		const workspace = GetWorkspaceByID(workspaceID);

		if (UserOwnsWorkspace(workspaceID)) {
			if (!WorkspaceMarkedForDeletion(workspaceID))
				setWorkspacesToDelete([...workspacesToDelete, workspace])
			else {
				let temp = workspacesToDelete.filter(e => e._id !== workspaceID);
				setWorkspacesToDelete(temp);
			}
		}
	}

	const DeleteMarkedWorkspaces = (event) => {
		axios.post(proxy + '/getWorkspaces', {accessToken: accessToken})
	}

	// SUBCOMPONENTS
	// Buttons for adding and removing workspaces
	const WorkspaceButtons = () => (
		<div className='workspace-buttons'>
			<button className='workspace-button-new' onClick={ToggleAddingWorkspace}>New Workspace</button>
			<button className='workspace-button-delete' onClick={ToggleDeletingWorkspace}>Delete Workspace</button>
			{deletingWorkspace && <button className='workspace-button-confirmDelete' onClick={DeleteWorkspacesAxios}>Confirm</button>}
			{AddNewWorkspace()}
		</div>
	)

	//Text input and button for adding new workspace
	const AddNewWorkspace = () => (
		<div className='new-workspace-container'>
			{addingWorkspace && <button style={{width: '3rem', backgroundColor: 'green'}} className='workspace-button' onClick={AddWorkspaceAxios}>Add</button>}
			<input
				className={addingWorkspace ? 'new-workspace-name-input' : 'new-workspace-name-input-onExit'}
				type='text'
				onChange={OnNewWorkspaceNameChange}>
			</input>
		</div>
	)

	// Card to display workspaces
	const WorkspaceCard = (name, owner, _id) => {
		
		const GetClassName = () => {
			if (workspacesToDelete.some(e => e._id === _id))
				return 'workspace-card-container-deleteMarked';
			else if (deletingWorkspace && owner==username)
				return 'workspace-card-container-deleteMode';
			else
				return 'workspace-card-container';
		}

		return (
			<div
				id={_id}
				className={GetClassName()}
				onClick={MarkWorkspaceForDeletion}>
				<div>
					<div className='workspace-card-name'>{name}</div>
					<div className='workspace-card-owner'>{owner}</div>				
				</div>
				<div className='workspace-card-messages'>
					50
				</div>
			</div>
		)
	}

	return (
		<div>
			{WorkspaceButtons()}
			{workspaces.map((item, index) => (
				<div key={index}>{WorkspaceCard(item.name, item.owner, item._id)}</div>
			))}
		</div>
	)

	// HELPER FUNCTIONS
	function WorkspaceMarkedForDeletion(_id) {
		return workspacesToDelete.some(e => e._id === _id);
	}

	function UserOwnsWorkspace(_id) {
		return userWorkspaces.some(e => e._id === _id);
	}

	function GetWorkspaceByID(_id) {
		return userWorkspaces.find(item => item._id === _id)
	}
}

export default Workspaces;