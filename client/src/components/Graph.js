import React, {Component} from 'react'
import { Chart } from "react-google-charts";
import { 
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  withStyles
} from "@material-ui/core"
import moment from 'moment'
import styles from '../styles.js'

class Graph extends Component {

  state = {
    metrics: {
      impressions: true,
      clicks: false,
      revenue: false,
      events: false
    },
    rawData: this.props.rawData
  }

  massageData = () => {
    //  Set x-axis and metric names
    let massagedData = []
    let headings = ['Day']
    let metrics = this.state.metrics
    let rawData = this.state.rawData

      for(var key in metrics) {
        if(metrics[key] === true) {
          if (key === 'impressions') headings.push('impressions/1000')
          else headings.push(key)
        }
      }
      massagedData.push(headings)

      //  Loop through rawData and push data in corrected format into massagedData Array
      rawData.forEach(stat => {
        let row = []

        // Date Logic
        if(this.props.timeFrame === 'hourly') {
          row.push(moment(stat.date).add(stat.hour,'h').toDate())
        } else {
          row.push(new Date(stat.date))
        }

        //  Metric Logic
        for(var key in metrics) {
          if(metrics[key] === true) {
            if(key === 'impressions') {
              row.push(Number(stat[key])/1000) 
            } else {
              row.push(Number(stat[key])) 
            }
          }
        }
        massagedData.push(row)
      })

      //  Save massagedData into state
      this.setState({massagedData})

  }
  
  handleMetricChange = (metric, metricState) => {
    let metrics = this.state.metrics
    metrics[metric] = !metricState
    this.setState({metrics},this.massageData)
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.rawData !== this.props.rawData) {
      this.setState({rawData: this.props.rawData}, this.massageData())
    }
  }
  
  render() {
    const {classes} = this.props
      return(
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              className={classes.chartGrid}
            >
              <Grid item>
                <Typography variant="h4">
                  General Chart Visualizations
                </Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox checked={this.state.metrics.impressions} onChange={()=>this.handleMetricChange('impressions',this.state.metrics.impressions)} value="impressions"/>
                    }
                    label="Impressions"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={this.state.metrics.clicks} onChange={()=>this.handleMetricChange('clicks',this.state.metrics.clicks)} value="clicks"/>
                    }
                    label="Clicks"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={this.state.metrics.revenue} onChange={()=>this.handleMetricChange('revenue',this.state.metrics.revenue)} value="revenue"/>
                    }
                    label="Revenue"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={this.state.metrics.events} onChange={()=>this.handleMetricChange('events',this.state.metrics.events)} value="events"/>
                    }
                    label="Events"
                  />
                </FormGroup>
              </Grid>
              <Grid item >
                <Chart
                    width={'75vw'}
                    height={'75vh'}
                    chartType="Line"
                    loader={<div>Loading Chart</div>}
                    data={this.state.massagedData}
                    options={{
                        chart: {
                        legend: 'none'
                        },
                    }}
                    rootProps={{ 'data-testid': '3' }}                    
                />
              </Grid>
            </Grid>
      )
  }
}

export default withStyles(styles)(Graph)