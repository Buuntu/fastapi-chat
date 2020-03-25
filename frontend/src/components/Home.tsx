import React, { FC, useState } from 'react';
import {
  Button, TextField, Grid, Paper, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import { BACKEND_URL } from '../config';

const useStyles = makeStyles({
  root: {
    height: '120px',
    width: '250px',
    padding: '50px',
  },
  button: {
    marginTop: '20px',
  },
  roomInput: {
    font: 'white',
  },
});

const Home:FC = () => {
  const classes = useStyles();
  const [nickname, setNickname] = useState<string>('');
  const history = useHistory();

  const onClick = () => {
    history.push(`chat/${nickname}`);
  };

  return (
    <div>
      <Typography variant="h3">Chat Room</Typography>
      <Paper className={classes.root}>
        <Grid item xs={12}>
          <TextField
            className={classes.roomInput}
            label="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.currentTarget.value)}
            variant="filled"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => onClick()}
          >
            Join
          </Button>
        </Grid>
      </Paper>
    </div>
  );
};

export default Home;
