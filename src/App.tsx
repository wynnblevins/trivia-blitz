import React from 'react';
import './App.css';
import { GameBoard } from './components/GameBoard';

function App() {
  return (
    <section className='background'>
      <div className="content">
        <h1 className='jeopardy-text'>Trivia Blitz!</h1>
        <GameBoard></GameBoard>
      </div>
    </section>
  );
}

export default App;
