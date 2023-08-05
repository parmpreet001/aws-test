import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import LoginForm from './Components/LoginForm'
import axios from 'axios';

function App() {
  const proxy = 'https://3.12.73.226/5000'
  const [data, setData] = useState([]);

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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          {data === null ? <p>Loading...</p> : <p>{data}</p>}
        </div>
        <div>
          <LoginForm/>
        </div>

      </header>

    </div>
  );
}

export default App;
