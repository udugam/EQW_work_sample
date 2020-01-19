import React, {Component} from 'react'
import { Chart } from "react-google-charts";
import { 
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem
} from "@material-ui/core"
import moment from 'moment'

//  Import custom components
import DataTable from './DataTable'

// import uuid for unique rowId's
const uuidv4 = require('uuid/v4');

class Stats extends Component {
    state = {
        timeFrame: "daily",
        rawData: {},
        massagedData: {},
        metrics: {
          impressions: true,
          clicks: false,
          revenue: false
        },
        tableHeadings: [],
        tableData: []
    }

    handleMetricChange = (metric, metricState) => {
      let metrics = this.state.metrics
      metrics[metric] = !metricState
      this.setState({metrics},this.massageData)
    }

    handleTimeChange = (event) => {
      this.setState({timeFrame : event.target.value}, this.fetchData)
    }

    fetchData = () => {
        fetch(`https://pure-bastion-53936.herokuapp.com/stats/${this.state.timeFrame}`)
            .then(res => res.json())
            .then(json => this.setState({rawData:json}, this.massageData))
    }
    
    massageData = () => {
      //  Set x-axis and metric names
      let massagedData = []
      let headings = ['Day']
      let tableHeadings = ['date']
      let tableData = []
      let metrics = this.state.metrics
      let rawData = this.state.rawData

        for(var key in metrics) {
          tableHeadings.push(key)
          if(metrics[key] === true) {
            if (key === 'impressions') headings.push('impressions/1000')
            else headings.push(key)
          }
        }
        massagedData.push(headings)
  
        //  Loop through rawData and push data in corrected format into massagedData Array
        rawData.forEach(stat => {
          let row = []
          let dataRow = []

          // Date Logic
          if(this.state.timeFrame === 'hourly') {
            row.push(moment(stat.date).add(stat.hour,'h').toDate())
            dataRow.push(moment(stat.date).add(stat.hour,'h').toString())
          } else {
            row.push(new Date(stat.date))
            dataRow.push(moment(stat.date).toString())
          }

          //  Metric Logic
          for(var key in metrics) {
            dataRow.push(stat[key])
            if(metrics[key] === true) {
              if(key === 'impressions') {
                row.push(Number(stat[key])/1000) 
              } else {
                row.push(Number(stat[key])) 
              }
            }
          }
          massagedData.push(row)
          tableData.push(dataRow)
        })

        //  Save massagedData into state
        this.setState({massagedData, tableHeadings, tableData})

    }

    componentDidMount() {
        this.fetchData()
    }

    render() {
        return(
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item>
                <FormGroup row>
                  <Select
                    value={this.state.timeFrame}
                    onChange={this.handleTimeChange}
                  >
                    <MenuItem value='daily'>Daily</MenuItem>
                    <MenuItem value='hourly'>Hourly</MenuItem>
                  </Select>
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
              <Grid item>
              {this.state.tableHeadings.length > 0 && 
                <DataTable headings={this.state.tableHeadings} data={this.state.tableData}/>
              }
              </Grid>
            </Grid>
        )
    }
}

export default Stats