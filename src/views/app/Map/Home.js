/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import Map from './Map';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      place: '',
    };
  }

  render() {
    if (this.state.place !== this.props.place) {
      this.setState({ place: this.props.place });
    }

    return (
      <div>
        <Map
          google={this.props.google}
          center={{ lat: 18.5204, lng: 73.8567 }}
          height="300px"
          zoom={13}
          place={this.props.place}
        />
      </div>
    );
  }
}

export default Home;
