import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import LoginRegistrationForm from './Components/LoginForm'
import Workspaces from './Components/Workspaces'
import axios from 'axios';
import { LoginContext } from './Contexts/LoginContext';

function App() {
  let proxy;

  if (process.env.NODE_ENV === 'development')
    proxy = 'http://localhost:5000';

  const [data, setData] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [username, setUsername] = useState('')

  const fetchData = () => {
    axios.get(proxy + '/test')
    .then((response) => {
      setData(response.data)
    }).catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => {
    fetchData();
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <div>
          {accessToken === null ? 
            <LoginRegistrationForm accessToken={accessToken} setAccessToken={setAccessToken} setAppUsername={setUsername}/> :
            <LoginContext.Provider value={{username: username, accessToken: accessToken}}>
              <Workspaces accessToken={accessToken} username={username} proxy={proxy}/>
            </LoginContext.Provider>
          }
        </div>

      </header>

    </div>
  );
}

export default App;
