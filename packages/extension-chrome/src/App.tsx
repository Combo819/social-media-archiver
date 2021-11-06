import React, { useState } from 'react';
import { Server } from './Components/Server/Server';
import { Crawler } from './Components/Crawler/Crawler';
import './App.css';

function App() {
  const [server, setServer] = useState('');
  return (
    <div className="App">
      <Server server={server} setServer={setServer} />
      <Crawler server={server} />
    </div>
  );
}

export default App;
