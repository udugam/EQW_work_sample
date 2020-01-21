import React, {Component} from 'react';
import './App.css';
import moment from 'moment'

//Import Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
  AppBar,
  Toolbar,
  Typography,
  withStyles,
  Grid,
  Container,
  Select,
  MenuItem
} from '@material-ui/core';

//Import Custom Components
import Graph from './components/Graph'
// import DataTable from './components/DataTable'
// import Map from './components/Map'

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
    timeFrame: "daily",
    rawData: [],
    joinedData: [],
    tableHeadings: [],
    tableData: []
  }
  
  handleTimeChange = (event) => {
    this.setState({timeFrame : event.target.value}, this.fetchData)
  }

  joinData = () => {
    let joinedData = []
    this.state.rawData[0].forEach( (row, index) => {
      let joinedRowData = {...row}
      joinedRowData.events = this.state.rawData[1][index].events
      joinedRowData.poi = this.state.rawData[2][index%4]
      joinedData.push(joinedRowData)
    })
    this.setState({joinedData})
  }

  fetchData = () => {
    const urls = [
      `https://pure-bastion-53936.herokuapp.com/stats/${this.state.timeFrame}`,
      `https://pure-bastion-53936.herokuapp.com/events/${this.state.timeFrame}`,
      `https://pure-bastion-53936.herokuapp.com/poi`
    ]

    Promise.all(urls.map(url =>
      fetch(url)               
        .then(res => res.json())
    ))
    .then(data => {
      this.setState({rawData: data}, this.joinData)
    })
  }
  
  componentDidMount() {
    this.fetchData()
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
            <Select
              value={this.state.timeFrame}
              onChange={this.handleTimeChange}
            >
              <MenuItem value='daily'>Daily</MenuItem>
              <MenuItem value='hourly'>Hourly</MenuItem>
            </Select>
          </Toolbar>
        </AppBar>
        <Container>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Graph rawData={this.state.joinedData} timeFrame={this.state.timeFrame}/>
          </Grid>
        </Container>
        

      </div>
    )
  }
}

export default withStyles(useStyles)(App);
