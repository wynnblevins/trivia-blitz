import React from 'react';
import './App.css';
import { GameBoard } from './components/GameBoard';
import { Grid } from '@material-ui/core';

function App() {
  return (
    <section className='background'>
      <div className="content">
        <h1 className='jeopardy-text'>Trivia Blitz!</h1>
        <Grid container>
          <GameBoard></GameBoard>
          
        </Grid>
      </div>
    </section>
  );
}

export default App;
