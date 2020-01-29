import React, {Component} from 'react';
import './App.css';

//Import Material UI Components
import { 
  AppBar,
  Toolbar,
  Typography,
  withStyles,
  Grid,
  Container,
  Select,
  MenuItem,
} from '@material-ui/core';

//Import Custom Components
import Graph from './components/Graph'
import DataTable from './components/DataTable'
import MapVisualization from './components/MapVisualization';
import styles from './styles.js'

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
      `${window.location.origin}/stats/${this.state.timeFrame}`,
      `${window.location.origin}/events/${this.state.timeFrame}`,
      `${window.location.origin}/poi`
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
            <Typography variant="h6" className={classes.grow}>
              EQW Work Sample by Ryan Udugampola
            </Typography>
            <Select
              value = {this.state.timeFrame}
              onChange = {this.handleTimeChange}
              className = {classes.dataSelect}
            >
              <MenuItem value='daily'>Daily Data</MenuItem>
              <MenuItem value='hourly'>Hourly Data</MenuItem>
            </Select>
          </Toolbar>
        </AppBar>
        <Container>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            className={classes.mainGrid}
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

export default withStyles(styles)(App);
