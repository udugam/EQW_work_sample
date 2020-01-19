import React, {Component} from 'react'
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from '@react-google-maps/api'

class Map extends Component {

    state = {
        poi: []
    }

    fetchData = () => {
        fetch(`https://pure-bastion-53936.herokuapp.com/poi`)
            .then(res => res.json())
            .then(json => this.setState({poi:json}))
    }

    componentDidMount() {
        this.fetchData()
    }

    render() {
        return(
            <LoadScript
                id="script-loader"
                googleMapsApiKey="AIzaSyD552D9ip_aM8XR9xwihw91hkhPdA9vHjE"
            >
                <GoogleMap 
                    id="circle-example"
                    mapContainerStyle={{
                        height: "400px",
                        width: "800px"
                    }}
                    zoom={12}
                    center={{
                        lat: 43.6532,
                        lng: -79.3832
                    }}
                >
                    <MarkerClusterer
                        options = {{ 
                            imagePath:"https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m" 
                          }}
                    >

                    {(clusterer) => this.state.poi.map((location, i) => (
                        <Marker
                            key = {location.poi_id} 
                            position = {{
                                lat: location.lat,
                                lng: location.lon
                            }}
                            clusterer = {clusterer}
                        />
                    ))}
                    </MarkerClusterer>
                </GoogleMap>
            </LoadScript>
        )
    }    
}

export default Map