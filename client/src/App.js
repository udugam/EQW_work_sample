import React, {Component} from 'react';
import './App.css';

//Import Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
  AppBar,
  Toolbar,
  Typography,
  withStyles,
  Button
} from '@material-ui/core';

//Import Custom Components
import Events from './components/Events'
import Poi from './components/Poi'
import Stats from './components/Stats'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

class App extends Component {

  state = {
    currentPage: "home"
  }
  
  handlePageChange = (pageName) => {
    this.setState({currentPage: pageName})
  }
  
  render() {
    const {classes} = this.props
    return(
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Welcome to EQ Works <span role="img" aria-label="Cool Emoji">😎</span>
            </Typography>
            <Button 
              color="inherit" 
              variant = {this.state.currentPage === "events" ? "outlined" : "text"} 
              onClick = {() => this.handlePageChange("events")}
            > 
              Events
            </Button>
            <Button 
              color="inherit"
              variant = {this.state.currentPage === "stats" ? "outlined" : "text"} 
              onClick = {() => this.handlePageChange("stats")}
            >
              Stats
            </Button>
            <Button 
              color="inherit"
              variant = {this.state.currentPage === "poi" ? "outlined" : "text"} 
              onClick = {() => this.handlePageChange("poi")}
            >
              Points of Interest
            </Button>
          </Toolbar>
        </AppBar>
        {this.state.currentPage === "events" &&
          <Events />
        }
        {this.state.currentPage === "poi" &&
          <Poi />
        }
        {this.state.currentPage === "stats" &&
          <Stats />
        }

      </div>
    )
  }
}

export default withStyles(useStyles)(App);
