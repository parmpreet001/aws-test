import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const proxy = 'https:localhost:5000'
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(proxy + '/test');
      const jsonData = await response.json();
      setData(jsonData);
      console.log(`Successfuly retrieved data from node endpoint`)
    } catch(error) {
      console.error("Error fetching data:", error);
    }
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

      </header>

    </div>
  );
}

export default App;
