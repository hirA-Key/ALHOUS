import React from 'react';
import Amplify, { I18n } from 'aws-amplify';
import { vocabularies } from './assets/vocabularies/message';
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsconfig from './aws-exports';
import {
  HashRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AllPosts from './containers/AllPosts';
import PostsBySpecifiedUser from './containers/PostsBySpecifiedUser';

Amplify.configure(awsconfig);
I18n.putVocabularies(vocabularies);
I18n.setLanguage("ja");

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#1EA1F2',
      contrastText: "#fff",
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
    divider: '#37444C',
  },
  overrides: {
    MuiButton: {
      color: 'white',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
    ].join(','),
  },
  status: {
    danger: 'orange',
  },
});

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  appBar: {
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

const App = () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  const classes = useStyles();
  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData)
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <div className={classes.root} >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HashRouter>
          <Switch>
            <Route exact path='/' component={AllPosts} />
            <Route exact path='/home' component={AllPosts} />
            <Route exact path='/:userId' component={PostsBySpecifiedUser}/>
            <Redirect path="*" to="/" />
          </Switch>
        </HashRouter>
      </ThemeProvider>
    </div>
  ) : (
    <AmplifyAuthenticator>
      <AmplifySignUp
        slot="sign-up"
        formFields={[
          { type: "username" },
          { type: "password" },
          { type: "email" }
        ]}
      />
    </AmplifyAuthenticator>
  );
}

export default App;
