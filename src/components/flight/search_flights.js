import React, {Component} from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import * as AdaptiveCards from "adaptivecards";
import './search_flights.css';
import * as Mustach from 'mustache/mustache.min';
import destination_card from './cards/destination_card.json';
import dates_card from './cards/dates_card.json';
import passengers_card from './cards/passengers_card.json';
import flight_itenerary_card from './cards/flight_itenerary.json';
import flight_data from './cards/flight_data.json';
import FlightList from "./flight_list";



class SearchFlights extends Component {

    constructor() {
        let date = new Date();
        let departureDate = date.toISOString().split('T')[0];
        let arrivalDate = new Date(date.getTime() + (86400000 * 7)).toISOString().split('T')[0];
        super();
        this.state = {
            booking: {
                "from": "1",
                "to": "3",
                "departureDate": departureDate,
                "arrivalDate": arrivalDate,
                "seatClass": "1",
                "passengers": {
                    "adult": 1,
                    "child": 0,
                    "infant": 0
                }
            },
            cards: [destination_card, dates_card, passengers_card],
            destinations: ['Jakarta', 'Bali/Denpasar', 'Bangkok'],
            destinationsCodes: ['CGK', 'DPS', 'BKK'],
            seatClasses: ['Economy', 'Premium Economy', 'Business', 'First Class'],
            counter: 0,
            flights: [],
            showFlights: true,
            showSearchCards: false
        };

        this.setOnExecuteAction = this.setOnExecuteAction.bind(this);
    }

    componentDidMount(){
        this.renderCard(this.state.cards[this.state.counter]);
    }

    renderCard(card) {
        if (this.state.counter < this.state.cards.length && this.state.counter >= 0) {
            this.refs.flight_card.innerHTML="";
            card = this.replaceValuesDynamically(card);
            // Create an AdaptiveCard instance
            var adaptiveCard = new AdaptiveCards.AdaptiveCard();

            adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
                fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
                // More host config options
            });

            this.setOnExecuteAction(adaptiveCard);

            adaptiveCard.parse(card);

            var renderedCard = adaptiveCard.render();

            this.refs.flight_card.appendChild(renderedCard);
        }
    }

    setOnExecuteAction(adaptiveCard) {
        adaptiveCard.onExecuteAction = function (action) {
            let count = this.state.counter;
            if (action.title === 'Next step') {
                this.onNextStepAction(adaptiveCard, count, action);
            } else if (action.title === 'Previous step') {
                this.onPreviousStepAction(adaptiveCard, count, action);
            } else if (action.title === 'Search Flights') {
                this.onSearchFlights(adaptiveCard, action)
            }
        }.bind(this);
    }

    onNextStepAction(adaptiveCard, count, action) {
        let currentBooking = this.saveValues(action, count);
        count++;
        this.setState({counter: count, booking: currentBooking}, function () {
            this.renderCard(this.state.cards[this.state.counter]);
        });
    }

    onPreviousStepAction(adaptiveCard, count, action) {
        let currentBooking = this.saveValues(action, count);
        count--;
        this.setState({counter: count, booking: currentBooking}, function () {
            this.renderCard(this.state.cards[this.state.counter]);
        });
    }

    onSearchFlights(adaptiveCard, action) {
        let currentBooking = this.saveValues(action);
        this.generateFlightIteneraries(currentBooking);

    }

    generateFlightIteneraries(currentBooking) {
        var flightList = [];
        var flight;
        let destinations = this.state.destinations;
        let codes = this.state.destinationsCodes;
        let seatClasses = this.state.seatClasses;
        for (var key in flight_data) {
            flight = JSON.parse(Mustach.render(JSON.stringify(flight_itenerary_card),
                {
                    from: destinations[currentBooking.from - 1],
                    to: destinations[currentBooking.to - 1],
                    fromInitials: codes[currentBooking.from - 1],
                    toInitials: codes[currentBooking.to - 1],
                    departure: currentBooking.departureDate,
                    departureTime: flight_data[key].departureTime,
                    return: currentBooking.arrivalDate,
                    returnTime: flight_data[key].returnTime,
                    adults: currentBooking.passengers.adult,
                    children: currentBooking.passengers.child,
                    infants: currentBooking.passengers.infant,
                    seatClass: seatClasses[currentBooking.seatClass - 1],
                    price: flight_data[key].price
                }));

            var adaptiveCard = new AdaptiveCards.AdaptiveCard();
            adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
                fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
            });

            adaptiveCard.parse(flight);
            var flightCard = adaptiveCard.render();

            flightList.push(flightCard);
        }

        this.setState({flights: flightList, showFlights: false, showSearchCards: true});
    }

    replaceValuesDynamically(card) {
        let booking = this.state.booking;
        if (this.state.counter === 0) {
            return JSON.parse(Mustach.render(JSON.stringify(card), {fromValue: booking.from, toValue: booking.to}));
        } else if (this.state.counter === 1) {
            return JSON.parse(Mustach.render(JSON.stringify(card), {
                departure: booking.departureDate,
                arrival: booking.arrivalDate
            }));
        } else if (this.state.counter === 2) {
            return JSON.parse(Mustach.render(JSON.stringify(card), {
                adult: booking.passengers.adult,
                child: booking.passengers.child,
                infant: booking.passengers.infant,
                seatClass: booking.seatClass
            }));
        } else {
            return card;
        }
    }

    saveValues(action) {
        let currentBooking = this.state.booking;
        if (this.state.counter === 0) {
            currentBooking.from = action.data.from;
            currentBooking.to = action.data.to;
        } else if (this.state.counter === 1) {
            currentBooking.departureDate = action.data.departure;
            currentBooking.arrivalDate = action.data.arrival;
        } else if (this.state.counter === 2) {
            currentBooking.seatClass = action.data.seatClass;
            currentBooking.passengers.adult = action.data.adult;
            currentBooking.passengers.child = action.data.child;
            currentBooking.passengers.infant = action.data.infant;
        }

        return currentBooking;
    }


    render() {
        return (
            <div>
                <Row>
                    <Col md={8} mdOffset={2}>
                        <div className="flight_card" ref="flight_card" hidden={this.state.showSearchCards}></div>
                        <FlightList flights={this.state.flights} hidden={this.state.showFlights}/>
                    </Col>
                </Row>
            </div>
        )
    }

}

export default SearchFlights;