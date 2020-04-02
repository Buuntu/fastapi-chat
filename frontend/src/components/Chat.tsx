import React, { FC, useState, useEffect, useRef } from 'react';
import { Typography, Grid, Paper, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import Message from './Message';
import { Message as MessageType, MESSAGE_TYPES } from '../types';
import { BASE_BACKEND_DOMAIN } from '../config';
import { startTyping, stopTyping, sendMessage } from '../utils';

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

const Chat: FC = () => {
  const classes = useStyles();
  const { nickname } = useParams();
  const [text, setText] = useState<string>('');
  const [ws, setWebsocket] = useState<WebSocket | null>(null);
  const [timeout, setTimeoutFunc] = useState<any>(null);
  const [users, setUsers] = useState<string[]>([]);

  const [messages, setMessages] = useState<MessageType[]>([]);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWebsocket(
      new WebSocket(`ws://${BASE_BACKEND_DOMAIN}/ws?user_id=${nickname}`)
    );

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  if (ws) {
    ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected');
    };

    ws.onclose = () => {
      console.log('disconnected');
      // automatically try to reconnect on connection loss
    };

    ws.onmessage = (event: any) => {
      // listen to data sent from the websocket server
      const response = JSON.parse(event.data);
      switch (response.type) {
        case MESSAGE_TYPES.MESSAGE_SENT:
        case MESSAGE_TYPES.USER_CONNECTED:
        case MESSAGE_TYPES.USER_DISCONNECTED:
          setMessages([...messages, response]);
          break;
        case MESSAGE_TYPES.USER_TYPING:
          if (
            !users.includes(response.data.user) &&
            response.data.user !== nickname
          ) {
            setUsers([...users, response.data.user]);
          }
          break;
        case MESSAGE_TYPES.USER_STOPPED_TYPING:
          if (users.includes(response.data.user)) {
            setUsers(users.filter((user) => user !== response.data.user));
          }
          break;
        default:
          break;
      }
      // scrollToBottom();
      console.log(response);
    };
  }

  const onChange = (e: any) => {
    clearTimeout(timeout);

    if (ws && nickname) {
      startTyping(ws, nickname);

      // Make a new timeout set to go off in 1000ms (1 second)
      setTimeoutFunc(
        setTimeout(() => {
          stopTyping(ws, nickname);
        }, 1000)
      );
    }

    setText(e.currentTarget.value);
  };

  const onSubmit = () => {
    try {
      if (ws && nickname) {
        sendMessage(ws, nickname, text);
        stopTyping(ws, nickname);
      }
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
              {messages &&
                messages.map((message) => (
                  <Message type={message.type} data={message.data} />
                ))}
              <div style={{ float: 'left', clear: 'both' }} ref={messagesEnd} />
              <Grid item xs={12}>
                {users.length > 0 && (
                  <span>{users.join(',')} is typing...</span>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.messageField}>
              <TextField
                className={classes.textField}
                label="Enter Message"
                variant="outlined"
                value={text}
                onChange={onChange}
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
