import React, { FC, useState } from 'react';
import {
  Button, TextField, Grid,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import { BACKEND_URL } from '../config';

const useStyles = makeStyles({
  button: {
    marginTop: '20px',
  },
  roomInput: {
    font: 'white',
  },
});

const Home:FC = () => {
  const classes = useStyles();
  const [roomNumber, setRoomNumber] = useState<string>('');
  const history = useHistory();

  const onClick = () => {
    history.push(`room/${roomNumber}`);
  };

  return (
    <div>
      <Grid item xs={12}>
        <TextField
          className={classes.roomInput}
          label="Room Number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.currentTarget.value)}
          variant="filled"
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          className={classes.button}
          onClick={() => onClick()}
        >
          Create
        </Button>
      </Grid>
    </div>
  );
};

export default Home;
