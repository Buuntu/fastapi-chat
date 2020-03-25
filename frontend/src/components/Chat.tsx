import React, { FC, useState, useEffect } from 'react';
import {
  Typography, Grid, Paper, TextField, Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles({
  chatBox: {
    backgroundColor: '#FFF',
    height: '400px',
    width: '400px',
    elevation: 5,
  },
  textField: {
    marginRight: '20px',
  },
  input: {
    height: '20px',
  },
  outline: {
    borderColor: 'white',
  },
  messages: {
    height: '300px',
  },
  button: {
    height: '56px',
  },
  messageField: {
    marginTop: '20px',
    margin: '10px',
  },
});

interface ChatProps {
  ws: any,
}


const Chat: FC<ChatProps> = ({ ws }) => {
  const classes = useStyles();
  const { roomName } = useParams();
  const [text, setText] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);


  useEffect(() => {
    return () => {
      ws.close();
    };
  }, []);

  ws.onopen = () => {
    // on connecting, do nothing but log it to the console
    console.log('connected');
  };

  ws.onmessage = (event: any) => {
    // listen to data sent from the websocket server
    const response = JSON.parse(event.data);
    setMessages([...messages, response.data]);
    console.log(response);
  };

  ws.onclose = () => {
    console.log('disconnected');
    // automatically try to reconnect on connection loss
  };

  const onSubmit = () => {
    try {
      ws.send(text); // send data to the server
    } catch (error) {
      console.log(error); // catch error
    }
    setText('');
  };

  return (
    <div>
      <Grid item xs={12}>
        <Typography variant="h5">Chat Room: {roomName}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={7} className={classes.chatBox}>
          <Grid container>
            <Grid item xs={12} className={classes.messages}>
              {messages && messages.map((message) => (
                <p>{message}</p>
              ))}
            </Grid>
            <Grid item xs={12} className={classes.messageField}>
              <TextField
                className={classes.textField}
                label="Enter Message"
                variant="outlined"
                value={text}
                onChange={(e) => setText(e.currentTarget.value)}
                InputProps={{
                  classes: {
                    input: classes.input,
                  },
                }}
              />
              <Button
                variant="outlined"
                className={classes.button}
                onClick={onSubmit}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </div>
  );
};

export default Chat;
