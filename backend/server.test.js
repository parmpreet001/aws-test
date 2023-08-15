const request = require('supertest');
const app = require('./server.js'); 

let accessToken;
let username = 'bitch';
let password = 'bitch';
let newWorkspaceName = 'testWorkspace';
let addedWorkspace;

describe('Basic Connection', () => {
	it('should return 200', async () => {
			const response = await request(app).get('/');
			expect(response.status).toBe(200);
	});
});

describe('Login', () => {
	it('should return 200 and access token', async () => {
			const requestBody = {
				username: username,
				password: password,
			}

			const response = await request(app).post('/login').send(requestBody);
			checkResponseBody(response);
			expect(response.body.accessToken).toBeTruthy();
			accessToken = response.body.accessToken;
	});
});

describe('Add New Workspace', () => {
	it('Should return 200', async () => {
		const requestBody = {
			username: username,
			workspaceName: newWorkspaceName,
			accessToken: accessToken,
		}

		const response = await request(app).post('/addWorkspace').send(requestBody);
		checkResponseBody(response);
		expect(response.status).toBe(200);
	})
})

describe('Check New Workspace in Workspaces', () => {
	it('Should return 200. New workspace should exist in workspaces list', async () => {
		const requestBody = {
			accessToken: accessToken
		}

		const response = await request(app).post('/getWorkspaces').send(requestBody);
		checkResponseBody(response);
		expect(response.status).toBe(200);
		expect(response.body.length != 0);

		let workspaces = response.body;
		addedWorkspace = workspaces.filter(workspace => workspace.owner == username && workspace.name == newWorkspaceName);
		expect(addedWorkspace).toBeTruthy();
	})
})

describe('Get Workspaces', () => {
	it('Should return 200 and list of workspaces', async () => {
		const requestBody = {
			accessToken: accessToken
		}

		const response = await request(app).post('/getWorkspaces').send(requestBody);
		checkResponseBody(response);
		expect(response.status).toBe(200);
		expect(response.body.length != 0);
	})
})

describe('Delete Added Workspace', () => {
	it('Should return 200', async () => {
		const requestBody = {
			workspacesToDelete : addedWorkspace,
			accessToken: accessToken
		}

		const response = await request(app).post('/deleteWorkspaces').send(requestBody);
		checkResponseBody(response);
		expect(response.status).toBe(200);
	})
})

function checkResponseBody(response) {
	expect(response).toBeTruthy();
	expect(response.body).toBeTruthy();
}

