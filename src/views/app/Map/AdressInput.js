import React, { Component } from 'react';
import Map from './Map';
import Autocomplete from 'react-google-autocomplete';

class AdressInput extends Component {
    onPlaceSelected = (place) => {
        const address = place.formatted_address,
            addressArray = place.address_components,

            latValue = place.geometry.location.lat(),
            lngValue = place.geometry.location.lng();
        // Set these values in the state.
        this.setState({
            address: (address) ? address : '',

            markerPosition: {
                lat: latValue,
                lng: lngValue
            },
            mapPosition: {
                lat: latValue,
                lng: lngValue
            },
        },()=>{
            this.props.address(this.state.address)
            this.props.place(place)
        })
        
    };
    render() {
        return (
            <Autocomplete
                style={{
                    width: '70%',
                    // height: '40px',
                    paddingLeft: '16px',
                    marginTop: '2px',
                }}
                onPlaceSelected={this.onPlaceSelected}
                types={['(regions)']}
                tabIndex={this.props.tabIndex}
    
                
            />
        );
    }
}

export default AdressInput;
