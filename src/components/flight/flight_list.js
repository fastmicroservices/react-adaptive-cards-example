import React, {Component} from 'react';
import './flight_list.css';



class FlightList extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <ul>
                {this.props.flights.map(function(flight, i){
                    return <li key={i} ref={(n) => { n &&  n.appendChild(flight) }} />
                })}
            </ul>
        )
    }

}

export default FlightList;