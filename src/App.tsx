import React from 'react';
import './App.css';
import { GameBoard } from './components/GameBoard';

function App() {
  return (
    <section className='background'>
      <div className="content">
        <GameBoard></GameBoard>
      </div>
    </section>
  );
}

export default App;
