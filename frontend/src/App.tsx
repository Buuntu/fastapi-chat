import React, { FC } from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Home from './components/Home';
import Chat from './components/Chat';
import { BASE_BACKEND_DOMAIN } from './config';


import './App.css';

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
    backgroundColor: '#344547',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white',
  },
});

const App:FC = () => {
  const styles = useStyles();

  const ws = new WebSocket(`ws://${BASE_BACKEND_DOMAIN}/ws`);

  return (
    <div className={styles.root}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >
        <Switch>
          <Route path="/room/:roomName">
            <Chat ws={ws} />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Grid>
    </div>
  );
};

export default App;
