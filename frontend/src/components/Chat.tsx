import React, { FC, useState, useEffect, useRef } from 'react';
import {
  Typography, Grid, Paper, TextField, Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import Message from './Message';
import { Message as MessageType } from '../types';

const useStyles = makeStyles({
  chatBox: {
    backgroundColor: '#FFF',
    height: '600px',
    width: '600px',
    elevation: 5,
  },
  textField: {
    marginRight: '20px',
  },
  input: {
    height: '20px',
    width: '400px',
  },
  outline: {
    borderColor: 'white',
  },
  messages: {
    height: '500px',
    maxHeight: '500px',
    overflow: 'scroll',
    padding: '20px',
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
  ws: WebSocket,
}

const scrollToRef = (ref: any) => window.scrollTo(0, ref.current.offsetTop);

const Chat: FC<ChatProps> = ({ ws }) => {
  const classes = useStyles();
  const { nickname } = useParams();
  const [text, setText] = useState<string>('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const messagesEnd = useRef<HTMLDivElement>(null);


  useEffect(() => {
    return () => {
      ws.close();
    };
  }, []);

  const scrollToBottom = () => {
    scrollToRef(messagesEnd);
  };

  ws.onopen = () => {
    // on connecting, do nothing but log it to the console
    console.log('connected');
    ws.send(JSON.stringify(
      { add_user: nickname },
    ));
  };

  ws.onmessage = (event: any) => {
    // listen to data sent from the websocket server
    const response = JSON.parse(event.data);
    setMessages([...messages, response]);
    // scrollToBottom();
    console.log(response);
  };

  ws.onclose = () => {
    console.log('disconnected');
    // automatically try to reconnect on connection loss
  };

  const onSubmit = () => {
    try {
      ws.send(JSON.stringify(
        { user: nickname, message: text },
      )); // send data to the server
    } catch (error) {
      console.log(error); // catch error
    }
    setText('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div>
      <Grid item xs={12}>
        <Typography variant="h5">User: {nickname}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={7} className={classes.chatBox}>
          <Grid container>
            <Grid item xs={12} className={classes.messages}>
              {messages && messages.map((message) => (
                <Message type={message.type} data={message.data} />
              ))}
              <div
                style={{ float: 'left', clear: 'both' }}
                ref={messagesEnd}
              />
            </Grid>
            <Grid item xs={12} className={classes.messageField}>
              <TextField
                className={classes.textField}
                label="Enter Message"
                variant="outlined"
                value={text}
                onChange={(e) => setText(e.currentTarget.value)}
                onKeyDown={handleKeyPress}
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
