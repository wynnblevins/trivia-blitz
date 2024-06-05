import React, { useEffect, useState } from 'react';
import { retrieveToken } from './services/tokenService';
import './App.css';
import { GameBoard } from './components/GameBoard';

function App() {
  const [token, setToken] = useState<string>('');
  const [tokenRequested, setTokenRequested] = useState<boolean>(false);
  
  useEffect(() => {
    if (!tokenRequested) {
      initializeGame();
      setTokenRequested(true);
    }
    
  }, [])

  const initializeGame = async () => {
    if (!token) {
      const tokenResponse = await retrieveToken();
      setToken(tokenResponse)
    }
  };

  return (
    <div className="App">
      <GameBoard token={token}></GameBoard>
    </div>
  );
}

export default App;
