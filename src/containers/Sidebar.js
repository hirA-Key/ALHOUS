import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  ListItemIcon,
} from '@material-ui/core';
import {
  Person as PersonIcon,
  Home as HomeIcon,
} from '@material-ui/icons';
import {Auth, API, graphqlOperation } from 'aws-amplify';
import { createPost } from '../graphql/mutations';
import { useHistory } from 'react-router';

const drawerWidth = 280;
const MAX_POST_CONTENT_LENGTH = 140;
const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    position: 'relative',
  },
  drawerPaper: {
    width: drawerWidth,
    position: 'relative',
  },
  toolbar: theme.mixins.toolbar,
  textField: {
    width: drawerWidth,
  },
  list: {
    width: 340,
  },
}));

export default function Sidebar({activeListItem}) {
  const classes = useStyles();
  const history = useHistory();

  const [value, setValue] = React.useState('');
  const [isError, setIsError] = React.useState(false);
  const [helperText, setHelperText] = React.useState('');

  //textFiledの設定(140文字制限)
  const handleChange = event => {
    setValue(event.target.value);
    if (event.target.value.length > MAX_POST_CONTENT_LENGTH) {
      setIsError(true);
      setHelperText(MAX_POST_CONTENT_LENGTH - event.target.value.length);
    } else {
      setIsError(false);
      setHelperText('');
    }
  };

  //投稿
  const onPost = async () => {
    const res = await API.graphql(graphqlOperation(createPost, { input: {
      type: 'post',
      content: value,
      timestamp: Math.floor(Date.now() / 1000),
    }}));

    console.log(res)
    setValue('');
  }

  //サインアウト機能
  const signOut = () => {
    Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <div className={classes.toolbar} />
      <List>
      <ListItem
          button
          selected={activeListItem === 'home'}
          onClick={() => {
            Auth.currentAuthenticatedUser().then((user) => {
              history.push('/home');
            })
          }}
          key='home'
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="HOME" />
        </ListItem>

        <ListItem
          button
          selected={activeListItem === 'profile'}
          onClick={() => {
            Auth.currentAuthenticatedUser().then((user) => {
              history.push('/' + user.username);
            })
          }}
          key='profile'
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="プロフィール" />
        </ListItem>

        <ListItem key='post-input-field'>
          <ListItemText primary={
            <TextField
              error={isError}
              helperText={helperText}
              id="post-input"
              label="つぶやく"
              multiline
              rowsMax="8"
              variant="filled"
              value={value}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          } />
        </ListItem>
        <ListItem key='post-button'>
          <ListItemText primary={
            <Button
              variant="contained"
              color="primary"
              disabled={isError}
              onClick={onPost}
              fullWidth
            >
              送信
            </Button>
          } />
        </ListItem>
        <ListItem key='logout'>
          <ListItemText primary={
            <Button
              variant="outlined"
              onClick={signOut}
              fullWidth
            >
              Logout
            </Button>
          } />
        </ListItem>
      </List>
    </Drawer>
  )
}
