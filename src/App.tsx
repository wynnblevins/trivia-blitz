import React, { useEffect, useState } from 'react';
import { retrieveToken } from './services/tokenService';
import './App.css';
import { GameBoard } from './components/GameBoard';

function App() {
  return (
    <div className="App">
      <GameBoard></GameBoard>
    </div>
  );
}

export default App;
