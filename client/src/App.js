import React, {Component} from 'react';
import './App.css';

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
import DataTable from './components/DataTable'
import MapVisualization from './components/MapVisualization';

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
  container: {
    maxHeight: 400
  }
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
      //  Copy all properties from all three endpoint responses into one object
      let joinedRowData = {...row}
      joinedRowData.events = this.state.rawData[1][index].events
      joinedRowData.poi = this.state.rawData[2][index%4]

      //  Add id identifier for each row of data (will be used for fuzzy search row heighlighting)
      //  Then push joined object to joinedData Array
      joinedRowData.id = index
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
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              EQW Work Sample by Ryan Udugampola
            </Typography>
            <Select
              value={this.state.timeFrame}
              onChange={this.handleTimeChange}
              variant= "outlined"
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
            <DataTable {...this.props} rawData={this.state.joinedData} timeFrame={this.state.timeFrame}/>
            <MapVisualization rawData={this.state.joinedData} timeFrame={this.state.timeFrame}/>
          </Grid>
        </Container>
      
      </div>
    )
  }
}

export default withStyles(useStyles)(App);
