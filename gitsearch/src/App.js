import './App.css';
import SearchResult from './components/SearchResult';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from "react-router-dom";
import Profile from './components/Profile';
//This is my main application - it displays a search box and the search results (once there are search results to display)
function App() {
  // Set states
  const [user, setUser] = useState('');
  const [error, setError] = useState('');
  const [backendData, setBackendData] = useState(null);

  // Function to handle search
  const handleSearch = async () => {
    console.log(error);
    try {
      const response = await fetch(`/api/github?username=${user}`);
      const data = await response.json();
      setBackendData(data);
    } catch (error) {
      setError('An error occurred: ' + error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p className='todo'>Search For a github profile</p>
        <div className="input-group">

          <input
            className="form-control rounded"
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            onFocus={(e) => e.target.value = ''}
          />
          <button onClick={handleSearch} className="btn btn-outline-primary">
            Search
          </button>
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<SearchResult backendData={backendData} />} />
            <Route path="/profile/:username" element={<Profile />} />
          </Routes>
        </div>
      </header>
    </div>
  );
}

export default App;
