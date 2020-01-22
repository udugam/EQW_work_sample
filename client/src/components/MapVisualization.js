import React, {Component, Fragment} from 'react'
import { GoogleMap, LoadScript, HeatmapLayer, MarkerClusterer, Marker} from '@react-google-maps/api'
import {
    Grid,
    Typography,
    FormControl,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText
} from '@material-ui/core'
import moment from 'moment'

class MapVisualization extends Component {

    state = {
        metric: 'impressions',
        date: moment("2017-01-01T00:00:00.000Z").format("dddd, MMMM Do YYYY, h:mm:ss a"),
        aggregatedData: [],
        dates: [],
        showHeatMap: false,
        libraries: ["visualization"],
        locationInfo: {
            name: "",
            metric: ""
        },
        currentLocation: {lat: 48.6,lng: -95.5}
    }

    populateMap = () => {
        this.determineDateRange()
        this.filterData()
    }

    filterData = () => {
        // Loop through the rawData and for entry, push the selected metric
        // to the filteredData Object 
        let filteredData = []
        let filteredDataRow = {}
        // let aggregatedData = []
        this.props.rawData.forEach( data => {
            filteredDataRow[this.state.metric] = data[this.state.metric]
            filteredDataRow.date = data.date
            filteredDataRow.id = data.id
            filteredDataRow.poi = data.poi
            filteredData.push({...filteredDataRow})
        })
        this.aggregateData(filteredData)
    }

    aggregateData = (filteredData) => {
        //  This function will aggregate all data by POI
        let aggregatedData = new Map()
        filteredData.forEach( data => {
            if( aggregatedData.has(data.poi.poi_id) ) {
                let poiData = aggregatedData.get(data.poi.poi_id)
                poiData[this.state.metric] = parseInt(poiData[this.state.metric]) + parseInt(data[this.state.metric])
                aggregatedData.set(data.poi.poi_id, {...poiData})
            } else {
                aggregatedData.set(data.poi.poi_id, {...data})
            }
        })
        this.setState({aggregatedData: Array.from(aggregatedData), loadHeatMap: true})
    }

    handleMetricChange = (event) => {
        this.setState({metric: event.target.value},this.filterData)
    }

    handleSelection = () => {
        let state = this.state.showHeatMap
        this.setState({showHeatMap: !state})
      }

    handleClose = () => {
        this.setState({locationInfoOpen: false})
    }

    determineDateRange = () => {
        let dates = new Set()
        this.props.rawData.forEach(data => {
            let date = moment(data.date)
            if( this.props.timeFrame === 'hourly') date.add( data.hour, 'h')
            dates.add(date.format("dddd, MMMM Do YYYY, h:mm:ss a"))
        })
        let datesArray = Array.from(dates)
        this.setState({dates:datesArray})
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps !== this.props) {
            this.populateMap()
        }
    }

    render() {
        return(
            <Grid item>
                <Typography variant="h4">
                  Geo Visualizations
                </Typography>
                <FormControl variant="outlined">
                    <Select
                        value={this.state.metric}
                        onChange={this.handleMetricChange}
                    >
                    <MenuItem value={'impressions'}>Impressions</MenuItem>
                    <MenuItem value={'clicks'}>Clicks</MenuItem>
                    <MenuItem value={'events'}>Events</MenuItem>
                    <MenuItem value={'revenue'}>Revenue</MenuItem>
                    </Select>
                    <FormControlLabel
                    control={
                      <Checkbox checked={this.state.showHeatMap} onChange={()=>this.handleSelection()}/>
                    }
                    label={`Show Heat Map of ${this.state.metric}`}
                  />
                </FormControl>
                <Typography variant="h6">
                  {`from ${this.state.dates[0]} - ${this.state.dates[this.state.dates.length-1]}`}
                </Typography>
                <LoadScript
                    id="script-loader"
                    googleMapsApiKey="AIzaSyD552D9ip_aM8XR9xwihw91hkhPdA9vHjE"
                    libraries={this.state.libraries}
                >
                    <GoogleMap
                        id="circle-example"
                        mapContainerStyle={{
                            height: "75vh",
                            width: "75vw"
                        }}
                        zoom={4}
                        center={this.state.currentLocation}
                        onCenterChanged	= {(e)=>console.log(e)}
                        onLoad = {this.populateMap}
                    >
                        <MarkerClusterer
                            options = {{ 
                                imagePath:"https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m" 
                            }}
                        >
                            {
                                (clusterer) => this.state.aggregatedData.map( location => (
                                <Fragment>
                                    <Marker
                                        key = {location[1].id} 
                                        position = {{
                                            lat: location[1].poi.lat,
                                            lng: location[1].poi.lon
                                        }}
                                        clusterer={clusterer}
                                        onClick = { () => {
                                            this.setState({
                                                locationInfo: {
                                                    name: location[1].poi.name,
                                                    metric: location[1][this.state.metric]
                                                },
                                                locationInfoOpen: true,
                                            })
                                        }}
                                    />
                                </Fragment>
                                ))
                            }
                        </MarkerClusterer>
                        {this.state.showHeatMap && 
                        <HeatmapLayer
                            options = {{radius: 50}}
                            data={this.state.aggregatedData.map( location => {
                                return {location: new window.google.maps.LatLng(location[1].poi.lat, location[1].poi.lon), weight: location[1][this.state.metric]/100 }
                            })}
                        />
                        }
                    </GoogleMap>
                </LoadScript>
                <Dialog onClose={this.handleClose} open={this.state.locationInfoOpen}>
                <DialogTitle>{this.state.locationInfo.name}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {`${this.state.metric} : ${this.state.locationInfo.metric}`}
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </Grid>
        )
    }    
}

export default MapVisualization