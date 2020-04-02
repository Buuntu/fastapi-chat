import React, { FC } from 'react';
import { AccountCircle } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';
import { MESSAGE_TYPES } from '../types';

const useStyles = makeStyles({
  root: {
    textAlign: 'left',
  },
  messageSent: {
    textAlign: 'left',
  },
  connectOrDisconnect: {
    color: 'gray',
  },
  user: {
    fontWeight: 'bold',
    display: 'inline',
    marginRight: '10px',
    marginLeft: '3px',
  },
});

type MessageProps = {
  type: MESSAGE_TYPES;
  data: {
    message?: string;
    num_users?: number;
    user?: string;
  };
};

const Message: FC<MessageProps> = ({ type, data }) => {
  const classes = useStyles();
  let content;

  switch (type) {
    case MESSAGE_TYPES.MESSAGE_SENT:
      content = (
        <div className={classes.messageSent}>
          <AccountCircle />
          <div className={classes.user}>{data.user}</div>
          {data.message}
        </div>
      );
      break;
    case MESSAGE_TYPES.USER_CONNECTED:
      content = (
        <div className={classes.connectOrDisconnect}>
          User <strong>{data.user}</strong> connected.
          {data.num_users && data.num_users > 1 && (
            <span>There are {data.num_users} participants</span>
          )}
        </div>
      );
      break;
    case MESSAGE_TYPES.USER_DISCONNECTED:
      content = (
        <div className={classes.connectOrDisconnect}>
          User <strong>{data.user}</strong> disconnected.
          {data.num_users && data.num_users > 1 && (
            <span>There are {data.num_users} participants</span>
          )}
        </div>
      );
      break;
    default:
      content = data.message;
      break;
  }
  return <div className={classes.root}>{content}</div>;
};

export default Message;
