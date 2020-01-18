import React, {Component} from 'react'
import { Chart } from "react-google-charts";
import { 
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox
} from "@material-ui/core"

class Stats extends Component {
    state = {
        timeFrame: "daily",
        rawData: {},
        massagedData: {},
        metrics: {
          impressions: true,
          clicks: false,
          revenue: false
        }
    }

    handleChange = (metric, metricState) => {
      let metrics = this.state.metrics
      metrics[metric] = !metricState
      this.setState({metrics},this.massageData)
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
        let metrics = this.state.metrics
        for(var key in metrics) {
          if(metrics[key] === true) headings.push(key) 
        }
        massagedData.push(headings)
  
        //  Loop through rawData and push data in corrected format into massagedData Array
        let rawData = this.state.rawData
        rawData.forEach(stat => {
          let row = [new Date(stat.date)]
          let metrics = this.state.metrics
          for(var key in metrics) {
            if(metrics[key] === true) row.push(Number(stat[key])) 
          }
          massagedData.push(row)
        })
        console.log(massagedData)

        //  Save massagedData into state
        this.setState({massagedData})

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
                  <FormControlLabel
                    control={
                      <Checkbox checked={this.state.metrics.impressions} onChange={()=>this.handleChange('impressions',this.state.metrics.impressions)} value="impressions"/>
                      // <Checkbox    />
                    }
                    label="Impressions"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={this.state.metrics.clicks} onChange={()=>this.handleChange('clicks',this.state.metrics.clicks)} value="clicks"/>
                    }
                    label="Clicks"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={this.state.metrics.revenue} onChange={()=>this.handleChange('revenue',this.state.metrics.revenue)} value="revenue"/>
                    }
                    label="Revenue"
                  />
                </FormGroup>
              </Grid>
              <Grid item >
                <Chart
                    width={'600px'}
                    height={'400px'}
                    chartType="Line"
                    loader={<div>Loading Chart</div>}
                    data={this.state.massagedData}
                    options={{
                        chart: {
                        title: 'Daily Events',
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

export default Stats