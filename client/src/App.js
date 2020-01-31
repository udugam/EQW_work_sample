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
  CircularProgress
} from '@material-ui/core';
import { withSnackbar } from 'notistack'

//Import Custom Components
import Graph from './components/Graph'
import DataTable from './components/DataTable'
import MapVisualization from './components/MapVisualization';
import styles from './styles.js'

class App extends Component {

  state = {
    timeFrame: "daily",
    joinedData: [],
    tableHeadings: [],
    tableData: [],
    loading: true
  }

  setLoader = (value) => {
    this.setState({loading: value})
  }
  
  handleTimeChange = (event) => {
    this.setState({timeFrame : event.target.value, loading: true}, this.fetchData)
  }

  fetchData = () => {
    fetch(`${window.location}joinedData/${this.state.timeFrame}`)
    .then(response => {
      if (!response.ok) throw Error(`${response.status} : ${response.statusText}`);
      return response;
    })             
    .then(response => response.json())
    .then(response => {
      this.setState({joinedData: response, loading: false})
    })
    .catch( err => {
      console.log(err)
      this.props.enqueueSnackbar(err.toString(), {variant: 'error'})
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
            <DataTable setLoader={this.setLoader} rawData={this.state.joinedData} timeFrame={this.state.timeFrame}/>
            <MapVisualization rawData={this.state.joinedData} timeFrame={this.state.timeFrame}/>
          </Grid>
        </Container>
        {this.state.loading && <CircularProgress className={classes.loader} size={75}/>}
      </div>
    )
  }
}

export default withStyles(styles)(withSnackbar(App));
